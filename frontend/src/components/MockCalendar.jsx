import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { events } from "../mockData/eventsMock";
import { Card, Badge } from "react-bootstrap";

function MockEventCalendar() {
  const [futureEvents] = useState(events.filter(event => new Date(event.date) > new Date()));

  const extractTime = (datetime) => {
    const time = new Date(datetime).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return time;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const groupEventsByDate = (events) => {
    const groups = events.reduce((groups, event) => {
      // Extract the date part from the datetime string
      const date = event.date.split("T")[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {});

    // Sort the groups by date
    return Object.keys(groups)
      .sort()
      .reduce((sortedGroups, date) => {
        sortedGroups[date] = groups[date];
        return sortedGroups;
      }, {});
  };

  const groupedEvents = groupEventsByDate(futureEvents);

  return (
    <div className="my-4">
      <h1 className="text-center mb-4">Upcoming Events</h1>
      
      {Object.entries(groupedEvents).length === 0 ? (
        <Card className="text-center p-4 mb-4">
          <Card.Body>
            <Card.Title>No upcoming events</Card.Title>
            <Card.Text>Check back later for new events.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        Object.entries(groupedEvents).map(([date, events]) => (
          <Card className="mb-4 shadow-sm" key={date}>
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">{formatDate(date)}</h3>
            </Card.Header>
            <Card.Body>
              {events.map((event) => (
                <div className="mb-3 pb-3 border-bottom" key={event._id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h4>{event.title}</h4>
                      <p className="text-muted mb-2">
                        <strong>Time:</strong> {extractTime(event.date)} | <strong>Location:</strong> {event.location}
                      </p>
                      <p className="mb-0">{event.description}</p>
                    </div>
                    <Badge bg="info" className="p-2">
                      <FontAwesomeIcon icon={faMagnifyingGlass} className="me-1" />
                      Details
                    </Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default MockEventCalendar;
