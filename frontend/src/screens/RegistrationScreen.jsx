import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";
import ErrorBoundary from "../components/ErrorBoundary";

// Custom hook for form validation
const useRegistrationForm = (initialState = {}) => {
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

    // Username validation
    if (!values.username) {
      newErrors.username = "Username is required";
    } else if (values.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Name validation
    if (!values.name) {
      newErrors.name = "Full name is required";
    }

    // Email validation
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email address is invalid";
    }

    // Password validation
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
const FormInput = ({
  type,
  placeholder,
  name,
  value,
  onChange,
  error,
  label,
}) => (
  <Form.Group controlId={name} className="mb-4">
    <Form.Label>
      {label || name.charAt(0).toUpperCase() + name.slice(1)}
    </Form.Label>
    <Form.Control
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      isInvalid={!!error}
      className="w-100"
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
  label: PropTypes.string,
};

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setErrors,
  } = useRegistrationForm({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await register({
          username: values.username,
          name: values.name,
          email: values.email,
          password: values.password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Registration successful!");
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.message || err.data || err.error);
        setErrors((prev) => ({
          ...prev,
          submit: err?.data?.message || "Registration failed",
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
          className="registration-container bg-white p-4 rounded shadow-lg"
          style={{ maxWidth: "32rem" }}
        >
          <div className="text-center mb-4">
            <Image src={club_logo} fluid alt="Club Logo" />
          </div>

          <h2 className="text-center mb-4">Register</h2>

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
              type="text"
              placeholder="Enter full name"
              name="name"
              label="Full Name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
            />

            <FormInput
              type="email"
              placeholder="Enter email"
              name="email"
              label="Email Address"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              type="password"
              placeholder="Enter password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
            />

            <FormInput
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              label="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
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
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </Button>

            <div className="text-center">
              Already have an account? <Link to="/login">Sign In</Link>
            </div>
          </Form>

          {isLoading && <Loader />}
        </div>
      </Container>
    </ErrorBoundary>
  );
};

export default RegistrationScreen;
