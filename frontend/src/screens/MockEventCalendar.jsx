import { useState, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Container, Spinner, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import ErrorBoundary from "../components/ErrorBoundary";
import { events } from "../mockData/eventsMock";

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
        <Modal show={show} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>{event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Date:</strong> {moment(event.start).format("MMMM D, YYYY")}
            </p>
            <p>
              <strong>Time:</strong> {moment(event.start).format("hh:mm A")} -{" "}
              {moment(event.end).format("hh:mm A")}
            </p>
            <p>
              <strong>Location:</strong> {event.location || "TBD"}
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

  return (
    <div className="rbc-event-content">
      <strong>{event.title}</strong>
      <div className="event-time small">
        {startTime}
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

// Main Calendar Component
const MockEventCalendar = () => {
  const [modalShow, setModalShow] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const formattedEvents = useMemo(() => {
    return events.map((event) => {
      const startDate = new Date(event.date);
      // Create an end date 2 hours after the start
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 2);
      
      return {
        id: event._id,
        title: event.title,
        description: event.description,
        start: startDate,
        end: endDate,
        allDay: false,
        location: event.location,
      };
    });
  }, []);

  const handleEventClick = (event) => {
    setActiveEvent(event);
    setModalShow(true);
  };

  const handleCloseModal = () => {
    setModalShow(false);
    setActiveEvent(null);
  };

  return (
    <ErrorBoundary>
      <Container fluid className="py-4">
        <h1 className="text-center mb-4">Event Calendar</h1>
        <p className="text-center text-muted mb-4">
          View and manage all upcoming club events
        </p>
        
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

export default MockEventCalendar;
