import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { useCreateEventMutation } from "../../slices/eventApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Form Field Component
const FormField = ({ label, type, value, onChange, required, error }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <InputGroup>
      {type.startsWith("date") && (
        <InputGroup.Text>
          <FaCalendarAlt />
        </InputGroup.Text>
      )}
      {type === "time" && (
        <InputGroup.Text>
          <FaClock />
        </InputGroup.Text>
      )}
      <Form.Control
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        isInvalid={!!error}
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
};

const EventCreateScreen = () => {
  const navigate = useNavigate();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "09:00",
    endTime: "17:00",
    allDay: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.date) {
      newErrors.date = "Event date is required";
    }
    if (!formData.allDay) {
      if (!formData.startTime) {
        newErrors.startTime = "Start time is required";
      }
      if (!formData.endTime) {
        newErrors.endTime = "End time is required";
      }
      // Compare times on the same day
      const createTimeDate = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        return date;
      };

      const startTime = createTimeDate(formData.startTime);
      const endTime = createTimeDate(formData.endTime);
      if (endTime <= startTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const createEventDateTime = (time) => {
        const [hours, minutes] = time.split(':');
        const eventDate = new Date(formData.date);
        eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
        return eventDate.toISOString();
      };

      const eventData = {
        title: formData.title,
        description: formData.description,
        allDay: formData.allDay,
        start: formData.allDay
          ? new Date(`${formData.date}T00:00:00`).toISOString()
          : createEventDateTime(formData.startTime),
        end: formData.allDay
          ? new Date(`${formData.date}T23:59:59`).toISOString()
          : createEventDateTime(formData.endTime),
      };

      await createEvent(eventData).unwrap();
      toast.success("Event created successfully");
      navigate("/admin/events/list");
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  const handleInputChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
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

  if (isLoading) return <Loader />;

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Create New Event</h1>
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
                  />

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange("description")}
                    />
                  </Form.Group>

                  <Row className="justify-content-center">
                    <Col md={6}>
                      <FormField
                        label="Event Date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange("date")}
                        required
                        error={errors.date}
                      />
                    </Col>
                  </Row>

                  {!formData.allDay && (
                    <Row>
                      <Col md={6}>
                        <FormField
                          label="Start Time"
                          type="time"
                          value={formData.startTime}
                          onChange={handleInputChange("startTime")}
                          required
                          error={errors.startTime}
                        />
                      </Col>
                      <Col md={6}>
                        <FormField
                          label="End Time"
                          type="time"
                          value={formData.endTime}
                          onChange={handleInputChange("endTime")}
                          required
                          error={errors.endTime}
                        />
                      </Col>
                    </Row>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="All Day Event"
                      checked={formData.allDay}
                      onChange={handleInputChange("allDay")}
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader size="sm" /> : "Create Event"}
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

export default EventCreateScreen;
