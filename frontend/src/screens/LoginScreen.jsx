import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image, Container, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/powderpost_logo.svg";
import ErrorBoundary from "../components/ErrorBoundary";

// Custom hook for form validation
const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!values.username) {
      newErrors.username = "Username is required";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setErrors,
  };
};

// Form Input Component
const FormInput = ({ type, placeholder, name, value, onChange, error }) => (
  <Form.Group controlId={name} className="mb-4">
    <Form.Label>{name.charAt(0).toUpperCase() + name.slice(1)}</Form.Label>
    <Form.Control
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={!!error}
    />
    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
  </Form.Group>
);

FormInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCredentialsModal, setShowCredentialsModal] = useState(true);

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setErrors,
  } = useFormValidation({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  // Temporarily commented out Google OAuth success handler
  /*
  useEffect(() => {
    // Handle Google OAuth success
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        dispatch(setCredentials(user));
        navigate("/home");
      } catch (error) {
        toast.error("Failed to process Google login");
      }
    }
  }, [location, dispatch, navigate]);
  */

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await login({
          username: values.username,
          password: values.password,
        }).unwrap();

        if (!res) {
          throw new Error('Login failed - no response from server');
        }

        // Successfully logged in
        dispatch(setCredentials({ ...res }));

        // Show success message with user role information
        const roleMessage = res.isAdmin ?
          'Logged in as Administrator' :
          'Logged in as Member';
        toast.success(`Welcome, ${res.name}! ${roleMessage}`);

        navigate("/home");
      } catch (err) {
        console.error('Login error:', err);
        toast.error(err?.data?.message || err.error || 'Invalid username or password');
        setErrors((prev) => ({
          ...prev,
          submit: err?.data?.message || err.error || "Invalid username or password",
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <ErrorBoundary>
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <div className="login-form p-4 rounded shadow" style={{ width: "100%", maxWidth: "450px", backgroundColor: "white", borderTop: "4px solid #FF6B35" }}>
          <div className="text-center mb-4">
            <Image src={club_logo} alt="PowderPost Logo" style={{ width: "180px" }} />
            <h2 className="mt-3 heading-font">Member Login</h2>
            <p className="tagline">Ride Together. Rise Above.</p>
          </div>
          <Form onSubmit={submitHandler}>
            <FormInput
              type="text"
              placeholder="Enter username"
              name="username"
              value={values.username}
              onChange={handleChange}
              error={errors.username}
            />

            <FormInput
              type="password"
              placeholder="Enter password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />

            {errors.submit && (
              <div className="text-danger mb-3 text-center">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-100 mb-4 btn-action"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center mb-3">
              <Link to="/forgot-username" className="me-2">
                Forgot Username?
              </Link>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <div className="text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setShowCredentialsModal(true)}
                className="p-0"
              >
                View demo login credentials
              </Button>
            </div>
          </Form>

          {/* Credentials Modal */}
          <Modal
            show={showCredentialsModal}
            onHide={() => setShowCredentialsModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title className="heading-font">PowderPost Demo Credentials</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>For demonstration purposes, you can use the following credentials:</p>

              <div className="bg-light p-3 rounded mb-3">
                <h6>Admin Access:</h6>
                <p className="mb-1">Username: <strong>admin</strong></p>
                <p>Password: <strong>abc123</strong></p>
              </div>

              <div className="bg-light p-3 rounded">
                <h6>Regular User Access:</h6>
                <p className="mb-1">Username: <strong>user</strong></p>
                <p>Password: <strong>abc123</strong></p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" className="btn-action" onClick={() => setShowCredentialsModal(false)}>
                Got it!
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="text-center mt-3">
            {/* Temporarily commented out Google sign-in button
            <div className="divider d-flex align-items-center my-4">
              <span className="divider-line flex-grow-1"></span>
              <span className="divider-text px-3">OR</span>
              <span className="divider-line flex-grow-1"></span>
            </div>
            <Button
              variant="outline-dark"
              className="w-100"
              onClick={() =>
                (window.location.href =
                  "http://localhost:5000/api/users/auth/google")
              }
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                style={{ width: "20px", marginRight: "10px" }}
              />
              Sign in with Google
            </Button>
            <small className="text-muted d-block mt-2">
              Note: New Google accounts require admin approval before access is
              granted.
            </small>
            */}
          </div>

          {isLoading && <Loader />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginScreen;
