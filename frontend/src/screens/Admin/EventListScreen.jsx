import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaTrash, FaEdit, FaPlus, FaCalendarAlt } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "../../slices/eventApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Group>
        <Form.Label>Event Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by Event Name"
          value={filters.title}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group>
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col md={3}>
      <Form.Group>
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
        />
      </Form.Group>
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Event Table Row Component
const EventTableRow = ({ event, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return event.allDay
      ? date.toLocaleDateString()
      : date.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  return (
    <tr>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <FaCalendarAlt className="text-primary me-2" />
          <span>{event.title}</span>
        </div>
      </td>
      <td className="align-middle">{formatDate(event.start)}</td>
      <td className="align-middle">{formatDate(event.end)}</td>
      <td className="align-middle">
        <div className="d-flex justify-content-center gap-2">
          <LinkContainer to={`/admin/events/${event._id}/edit`}>
            <Button variant="outline-primary" size="sm">
              <FaEdit className="me-1" /> Edit
            </Button>
          </LinkContainer>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(event._id)}
          >
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

EventTableRow.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    allDay: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const EventListScreen = () => {
  const { data: events, refetch, isLoading, error } = useGetAllEventsQuery();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const [filters, setFilters] = useState({
    title: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id).unwrap();
        toast.success("Event deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter((event) => {
      const matchesTitle = event.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const withinStartDate =
        !filters.startDate ||
        new Date(event.start) >= new Date(filters.startDate);
      const withinEndDate =
        !filters.endDate || new Date(event.end) <= new Date(filters.endDate);
      return matchesTitle && withinStartDate && withinEndDate;
    });
  }, [events, filters]);

  if (isLoading || isDeleting) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading events"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">Event Management</h1>
          </Col>
          <Col xs="auto">
            <Link to="/admin/events/create" className="btn btn-primary">
              <FaPlus className="me-1" /> Add Event
            </Link>
          </Col>
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        <div className="table-responsive">
          <Table hover className="align-middle bg-white shadow-sm rounded">
            <thead className="bg-light">
              <tr>
                <th>Event Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <EventTableRow
                  key={event._id}
                  event={event}
                  onDelete={deleteHandler}
                />
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </ErrorBoundary>
  );
};

export default EventListScreen;
