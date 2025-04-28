import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Image, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import { useResetPasswordMutation } from "../slices/usersApiSlice";
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
const useResetPasswordForm = (initialState = {}) => {
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

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    setErrors,
  } = useResetPasswordForm({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await resetPassword({ token, password: values.password }).unwrap();
        toast.success("Your password has been reset successfully.");
        navigate("/login");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to reset password.");
        setErrors((prev) => ({
          ...prev,
          submit: err?.data?.message || "Failed to reset password",
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
          className="reset-password-container bg-white p-4 rounded shadow-lg"
          style={{ maxWidth: "32rem" }}
        >
          <div className="text-center mb-4">
            <Image src={club_logo} fluid alt="Club Logo" />
          </div>

          <h2 className="text-center mb-4">Reset Password</h2>

          <Form onSubmit={handleSubmit}>
            <FormInput
              type="password"
              placeholder="Enter new password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              label="New Password"
            />

            <FormInput
              type="password"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              label="Confirm New Password"
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
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </Form>

          {isLoading && <Loader />}
        </div>
      </Container>
    </ErrorBoundary>
  );
};

export default ResetPasswordScreen;
