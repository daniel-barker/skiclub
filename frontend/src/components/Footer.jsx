import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const navigation = {
  clubInfo: [
    { name: "Club History", to: "/history", icon: "fas fa-book-open" },
    { name: "House Rules", to: "/house-rules", icon: "fas fa-scroll" },
    { name: "Bylaws", to: "/bylaws", icon: "fas fa-gavel" },
  ],
  memberResources: [
    { name: "Member Directory", to: "/directory", icon: "fas fa-address-book" },
    { name: "Club Events", to: "/events", icon: "fas fa-calendar-alt" },
    { name: "Photo Gallery", to: "/gallery", icon: "fas fa-images" },
    { name: "Bulletin Board", to: "/bb", icon: "fas fa-bullhorn" },
  ],
  external: [
    {
      name: "Chamber Website",
      href: "https://www.ellicottvilleny.com/",
      icon: "fas fa-external-link-alt",
    },
    {
      name: "Holiday Valley Facebook",
      href: "https://www.facebook.com/holidayvalley",
      icon: "fab fa-facebook",
    },
    {
      name: "Holiday Valley Resort",
      href: "https://www.holidayvalley.com/",
      icon: "fas fa-skiing",
    },
  ],
};

const Footer = () => {
  const location = useLocation();
  const excludedHeaderPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/pending-approval",
  ];

  if (excludedHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="footer text-light py-4">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <p className="small text-light"></p>
          </Col>
        </Row>
        <Row className="gy-4 text-center">
          <Col md={4} className="text-center">
            <h5 className="footer-heading">External Links</h5>
            <ul className="list-unstyled">
              {navigation.external.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    <i className={`${item.icon} me-2`}></i> {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4} className="text-center">
            <h5 className="footer-heading">Club Info</h5>
            <ul className="list-unstyled">
              {navigation.clubInfo.map((item) => (
                <li key={item.name}>
                  <Link to={item.to} className="footer-link">
                    <i className={`${item.icon} me-2`}></i> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4} className="text-center">
            <h5 className="footer-heading">Member Resources</h5>
            <ul className="list-unstyled">
              {navigation.memberResources.map((item) => (
                <li key={item.name}>
                  <Link to={item.to} className="footer-link">
                    <i className={`${item.icon} me-2`}></i> {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        <Row className="mt-4 border-top pt-3">
          <Col className="text-center">
            <p className="small text-light mb-0">
              &copy; {new Date().getFullYear()} Ellicottville Ski Club. All
              rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
