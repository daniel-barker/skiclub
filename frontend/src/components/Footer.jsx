import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const navigation = {
  clubInfo: [
    { name: "Club History", to: "/history", icon: "fas fa-book-open" },
  ],
  memberResources: [
    { name: "Member Directory", to: "/directory", icon: "fas fa-address-book" },
    { name: "Club Events", to: "/events", icon: "fas fa-calendar-alt" },
    { name: "Photo Gallery", to: "/gallery", icon: "fas fa-images" },
    { name: "Bulletin Board", to: "/bb", icon: "fas fa-bullhorn" },
  ],
  external: [
    {
      name: "Powder Forecast",
      href: "https://opensnow.com/",
      icon: "fas fa-snowflake",
    },
    {
      name: "Mountain Gear",
      href: "https://www.backcountry.com/",
      icon: "fas fa-mountain",
    },
    {
      name: "Trail Maps",
      href: "https://www.trailforks.com/",
      icon: "fas fa-map-marked-alt",
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
    <footer className="footer text-light py-4 powderpost-footer">
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
              &copy; {new Date().getFullYear()} PowderPost. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
