import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaSave,
  FaUserShield,
  FaUserCheck,
} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Form Field Component
const FormField = ({ label, type, value, onChange, icon: Icon, required }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <InputGroup>
      <InputGroup.Text>
        <Icon />
      </InputGroup.Text>
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </InputGroup>
  </Form.Group>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  required: PropTypes.bool,
};

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    isAdmin: false,
    isApproved: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        isAdmin: user.isAdmin || false,
        isApproved: user.isApproved || false,
      });
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId,
        ...formData,
      });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/user/list");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading || loadingUpdate) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading user"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Edit User</h1>
                  <Link
                    to="/admin/user/list"
                    className="btn btn-outline-primary"
                  >
                    <FaArrowLeft className="me-1" /> Back to Users
                  </Link>
                </div>

                <Form onSubmit={submitHandler}>
                  <FormField
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange("name")}
                    icon={FaUser}
                    required
                  />

                  <FormField
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    icon={FaEnvelope}
                    required
                  />

                  <FormField
                    label="Username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange("username")}
                    icon={FaLock}
                    required
                  />

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="isAdmin"
                          label={
                            <span>
                              <FaUserShield className="me-1" />
                              Admin User
                            </span>
                          }
                          checked={formData.isAdmin}
                          onChange={handleChange("isAdmin")}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="switch"
                          id="isApproved"
                          label={
                            <span>
                              <FaUserCheck className="me-1" />
                              Approved
                            </span>
                          }
                          checked={formData.isApproved}
                          onChange={handleChange("isApproved")}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="mt-3"
                    >
                      <FaSave className="me-1" /> Save Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default UserEditScreen;
