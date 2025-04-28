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
import { FaCalendarAlt, FaClock, FaArrowLeft } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetEventDetailsQuery,
  useUpdateEventMutation,
  useCreateEventMutation,
} from "../../slices/eventApiSlice";
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

const EventEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    allDay: false,
  });

  const [errors, setErrors] = useState({});

  const {
    data: event,
    isLoading,
    error: fetchError,
  } = useGetEventDetailsQuery(id, {
    skip: !id,
  });

  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);

      setFormData({
        title: event.title,
        description: event.description,
        start: startDate.toISOString().split("T")[0],
        end: endDate.toISOString().split("T")[0],
        allDay: event.allDay,
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.start) {
      newErrors.start = "Start date is required";
    }
    if (!formData.end) {
      newErrors.end = "End date is required";
    }
    if (new Date(formData.end) < new Date(formData.start)) {
      newErrors.end = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const eventData = {
        ...formData,
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
      };

      if (id) {
        await updateEvent({ id, ...eventData }).unwrap();
        toast.success("Event updated successfully");
      } else {
        await createEvent(eventData).unwrap();
        toast.success("Event created successfully");
      }
      navigate("/admin/events");
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
  if (fetchError)
    return (
      <Message variant="danger">
        {fetchError?.data?.message || "Error loading event"}
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
                  <h1 className="mb-0">
                    {id ? "Edit Event" : "Create New Event"}
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

                  <Row>
                    <Col md={6}>
                      <FormField
                        label="Start Date"
                        type="date"
                        value={formData.start}
                        onChange={handleInputChange("start")}
                        required
                        error={errors.start}
                      />
                    </Col>
                    <Col md={6}>
                      <FormField
                        label="End Date"
                        type="date"
                        value={formData.end}
                        onChange={handleInputChange("end")}
                        required
                        error={errors.end}
                      />
                    </Col>
                  </Row>

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
                      disabled={isUpdating || isCreating}
                    >
                      {isUpdating || isCreating ? (
                        <Loader size="sm" />
                      ) : id ? (
                        "Update Event"
                      ) : (
                        "Create Event"
                      )}
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

export default EventEditScreen;
