import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const location = useLocation(); // Temporarily removed with Google auth

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
        dispatch(setCredentials({ ...res }));
        navigate("/home");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        setErrors((prev) => ({
          ...prev,
          submit: err?.data?.message || "Login failed",
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
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="login-container bg-white p-4 rounded shadow-lg"
          style={{ maxWidth: "32rem" }}
        >
          <div className="text-center mb-4">
            <Image src={club_logo} fluid alt="Club Logo" />
          </div>

          <h2 className="text-center mb-4">Sign In</h2>

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
              className="w-100 mb-4"
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
          </Form>

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
      </Container>
    </ErrorBoundary>
  );
};

export default LoginScreen;
