import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Image, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import { useForgotUsernameMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import club_logo from "../assets/images/club_logo.png";
import ErrorBoundary from "../components/ErrorBoundary";

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
      required
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

// Custom hook for form validation
const useForgotUsernameForm = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
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
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = {};
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email address is invalid";
    }
    return newErrors;
  }, [values]);

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

const ForgotUsernameScreen = () => {
  const navigate = useNavigate();
  const [forgotUsername, { isLoading }] = useForgotUsernameMutation();

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setErrors,
  } = useForgotUsernameForm({
    email: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await forgotUsername({ email: values.email }).unwrap();
        toast.success("Username sent to email");
        navigate("/login");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to send username");
        setErrors((prev) => ({
          ...prev,
          submit: err?.data?.message || "Failed to send username",
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
          className="forgot-username-container bg-white p-4 rounded shadow-lg"
          style={{ maxWidth: "32rem" }}
        >
          <div className="text-center mb-4">
            <Image src={club_logo} fluid alt="Club Logo" />
          </div>

          <h2 className="text-center mb-4">Forgot Username</h2>

          <Form onSubmit={submitHandler}>
            <FormInput
              type="email"
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              label="Email Address"
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
              {isSubmitting ? "Sending..." : "Send Username"}
            </Button>

            <div className="text-center mb-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="text-center">
              Remember your account? <Link to="/login">Sign In</Link>
            </div>
          </Form>

          {isLoading && <Loader />}
        </div>
      </Container>
    </ErrorBoundary>
  );
};

export default ForgotUsernameScreen;
