import { useCallback } from "react";
import { Row, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MockLatestNews from "../components/MockLatestNews";
import MockLatestPosts from "../components/MockLatestPosts";
import MockMemberPageCarousel from "../components/MockMemberPageCarousel";
import ErrorBoundary from "../components/ErrorBoundary";

import bboard from "../assets/images/bboard.png";
import memdir from "../assets/images/memdir.png";
import calendar from "../assets/images/calendar.png";
import gallery from "../assets/images/gallery.png";
import news from "../assets/images/news.png";

// Quick Link Card Component
const QuickLinkCard = ({ image, title, path }) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(path);
  }, [navigate, path]);

  return (
    <Card
      className="text-center h-100 shadow-sm"
      style={{
        cursor: "pointer",
        backgroundColor: "#0A0A0A",
        borderColor: "#5DA9E9",
        borderWidth: "2px",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(93, 169, 233, 0.3)";
        e.currentTarget.style.borderColor = "#FF6B35";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.borderColor = "#5DA9E9";
      }}
      onClick={handleClick}
    >
      <Card.Body className="d-flex flex-column align-items-center">
        <div className="mb-3">
          <img
            src={image}
            alt={title}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "contain",
              padding: "10px",
              backgroundColor: "#5DA9E9",
              borderRadius: "50%",
              transition: "all 0.3s ease-in-out",
              border: "2px solid #FFFFFF",
            }}
            className="icon-image"
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(255, 107, 53, 0.3)";
              e.currentTarget.style.backgroundColor = "#FF6B35";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.backgroundColor = "#5DA9E9";
            }}
          />
        </div>
        <Card.Title className="mt-auto" style={{ color: "#FFFFFF", fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>{title}</Card.Title>
      </Card.Body>
    </Card>
  );
};

QuickLinkCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

// Quick Links Data
const quickLinks = [
  { image: news, title: "News", path: "/news" },
  { image: gallery, title: "Gallery", path: "/gallery" },
  { image: bboard, title: "Bulletin Board", path: "/bb" },
  { image: memdir, title: "Directory", path: "/directory" },
  { image: calendar, title: "Calendar", path: "/calendar" },
];

const MemberScreen = () => {
  return (
    <ErrorBoundary>
      <div className="member-screen">
        <MockMemberPageCarousel />

        <div className="member-page-container mx-5">
          {/* Latest Updates Section */}
          <Row className="mt-5 justify-content-center">
            <Col md={8} className="p-2">
              <ErrorBoundary>
                <MockLatestNews />
              </ErrorBoundary>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} className="mb-5">
              <ErrorBoundary>
                <MockLatestPosts />
              </ErrorBoundary>
            </Col>
          </Row>

          {/* Quick Links Section
          <Row className="mt-5 mx-1 justify-content-center">
            {quickLinks.map((link) => (
              <Col key={link.path} xs={12} sm={6} md={4} lg={2} className="p-2">
                <QuickLinkCard {...link} />
              </Col>
            ))}
          </Row> */}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MemberScreen;
