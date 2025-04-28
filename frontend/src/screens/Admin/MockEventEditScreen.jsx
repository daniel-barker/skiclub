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
import { FaCalendarAlt, FaClock, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ErrorBoundary from "../../components/ErrorBoundary";
import { events as mockEvents } from "../../mockData/eventsMock";
import { handleFormSuccess } from "../../mockData/formHelper";

// Form Field Component
const FormField = ({ label, type, value, onChange, required, error, icon }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <InputGroup>
      {icon && (
        <InputGroup.Text>
          {icon}
        </InputGroup.Text>
      )}
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        isInvalid={!!error}
        as={type === "textarea" ? "textarea" : "input"}
        rows={type === "textarea" ? 3 : undefined}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  icon: PropTypes.node,
};

const MockEventEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isEditing) {
      const event = mockEvents.find(e => e._id === id);
      if (event) {
        const eventDate = new Date(event.date);
        
        setFormData({
          title: event.title,
          description: event.description,
          date: eventDate.toISOString().split('T')[0],
          time: eventDate.toTimeString().split(' ')[0].substring(0, 5),
          location: event.location,
        });
      }
    } else {
      // For new event, set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      setFormData({
        title: "",
        description: "",
        date: tomorrow.toISOString().split('T')[0],
        time: "09:00",
        location: "Club Lodge",
      });
    }
    
    setIsLoading(false);
  }, [id, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Combine date and time into a single ISO string
      const dateTimeString = `${formData.date}T${formData.time}:00`;
      const eventDateTime = new Date(dateTimeString);
      
      if (isNaN(eventDateTime.getTime())) {
        throw new Error("Invalid date or time");
      }
      
      // In a real app, we would save to the backend here
      // For our mock, we'll just show a success message
      await handleFormSuccess(isEditing ? "Event updated successfully" : "Event created successfully");
      navigate("/admin/events/list");
    } catch (err) {
      toast.error(err?.message || "An error occurred");
    }
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">
                    {isEditing ? "Edit Event" : "Create New Event"}
                  </h1>
                  <Link
                    to="/admin/events/list"
                    className="btn btn-outline-secondary"
                  >
                    <FaArrowLeft className="me-1" /> Back to Events
                  </Link>
                </div>

                <Form onSubmit={handleSubmit}>
                  <FormField
                    label="Event Title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    required
                    error={errors.title}
                    icon={<FaCalendarAlt />}
                  />

                  <FormField
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={handleInputChange("description")}
                    icon={null}
                  />

                  <Row>
                    <Col md={6}>
                      <FormField
                        label="Date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange("date")}
                        required
                        error={errors.date}
                        icon={<FaCalendarAlt />}
                      />
                    </Col>
                    <Col md={6}>
                      <FormField
                        label="Time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange("time")}
                        required
                        error={errors.time}
                        icon={<FaClock />}
                      />
                    </Col>
                  </Row>

                  <FormField
                    label="Location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange("location")}
                    required
                    error={errors.location}
                    icon={<FaMapMarkerAlt />}
                  />

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {isEditing ? "Update Event" : "Create Event"}
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

export default MockEventEditScreen;
