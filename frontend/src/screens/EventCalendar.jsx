import { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Container, Spinner, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { useGetAllEventsQuery } from "../slices/eventApiSlice";
import ErrorBoundary from "../components/ErrorBoundary";

const localizer = momentLocalizer(moment);

// Event Modal Component
const EventModal = ({ event, show, onHide }) => {
  const createGoogleCalendarUrl = (event) => {
    const formatDate = (date) =>
      moment(date).utc().format("YYYYMMDDTHHmmss[Z]");

    const startDate = formatDate(event.start);
    const endDate = formatDate(event.end);
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
  };

  if (!event) return null;

  return (
    <ErrorBoundary>
      <Container>
        <h1 className="display-5 fw-bold mb-2">Event Calendar</h1>
        <Modal show={show} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>{event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Time:</strong> {moment(event.start).format("hh:mm A")} -{" "}
              {moment(event.end).format("hh:mm A")}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {event.description || "No description available"}
            </p>

            <a
              href={createGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Add to Google Calendar
            </a>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </ErrorBoundary>
  );
};

EventModal.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    description: PropTypes.string,
    location: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

// Event Component for Calendar
const EventComponent = ({ event }) => {
  const startTime = moment(event.start).format("hh:mm A");
  const endTime = moment(event.end).format("hh:mm A");

  return (
    <div className="rbc-event-content">
      <strong>{event.title}</strong>
      <div className="event-time small">
        {startTime} - {endTime}
      </div>
    </div>
  );
};

EventComponent.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
};

// Loading Component
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "80vh" }}
  >
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

// Main Calendar Component
const EventCalendar = () => {
  const { data: events, error, isLoading } = useGetAllEventsQuery();
  const [modalShow, setModalShow] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const formattedEvents = useMemo(() => {
    if (!events) return [];

    return events.map((event) => ({
      id: event._id,
      title: event.title,
      description: event.description,
      start: new Date(event.start),
      end: new Date(event.end),
      allDay: event.allDay,
      location: event.location,
    }));
  }, [events]);

  const handleEventClick = (event) => {
    setActiveEvent(event);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setActiveEvent(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert variant="danger" className="m-3">
        Error loading events: {error?.data?.message || error.error}
      </Alert>
    );

  return (
    <ErrorBoundary>
      <Container fluid className="py-4">
        <div className="calendar-wrapper" style={{ height: "80vh" }}>
          <Calendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            components={{
              event: EventComponent,
            }}
            onSelectEvent={handleEventClick}
            popup
            views={["month", "week", "day"]}
            defaultView="month"
            className="shadow-sm rounded bg-white p-3"
          />
        </div>

        <EventModal
          event={activeEvent}
          show={modalShow}
          onHide={handleCloseModal}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default EventCalendar;

// Add these styles to your CSS
/*
.calendar-wrapper {
  .rbc-calendar {
    background: white;
  }

  .rbc-event {
    background-color: #007bff;
    border: none;
    padding: 2px 5px;

    &:hover {
      background-color: #0056b3;
    }
  }

  .rbc-event-content {
    font-size: 0.9em;

    .event-time {
      opacity: 0.8;
    }
  }

  .rbc-today {
    background-color: #f8f9fa;
  }
}
*/
