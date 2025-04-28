import { useCallback } from "react";
import { Row, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import LatestNews from "../components/LatestNews";
import LatestPosts from "../components/LatestPosts";
import MemberPageCarousel from "../components/MemberPageCarousel";
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
      className="member-screen-links text-center h-100 shadow-sm hover-shadow"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <Card.Body className="d-flex flex-column align-items-center">
        <div className="mb-3">
          <img
            src={image}
            alt={title}
            style={{
              width: "128px",
              height: "128px",
              objectFit: "cover",
              borderRadius: "50%",
              transition: "transform 0.2s ease-in-out",
            }}
            className="hover-scale"
          />
        </div>
        <Card.Title className="mt-auto">{title}</Card.Title>
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
        <MemberPageCarousel />

        <div className="member-page-container mx-5">
          {/* Latest Updates Section */}
          <Row className="mt-5 justify-content-center">
            <Col md={8} className="p-2">
              <ErrorBoundary>
                <LatestNews />
              </ErrorBoundary>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} className="p-2">
              <ErrorBoundary>
                <LatestPosts />
              </ErrorBoundary>
            </Col>
          </Row>

          {/* Quick Links Section */}
          <Row className="mt-5 mx-1 justify-content-center">
            {quickLinks.map((link) => (
              <Col key={link.path} xs={12} sm={6} md={4} lg={2} className="p-2">
                <QuickLinkCard {...link} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MemberScreen;
