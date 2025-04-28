import React, { useState, useEffect } from "react";
import { Navbar, Nav, NavDropdown, Image } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import logo from "../assets/images/powderpost_logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCalendarAlt,
  faBullhorn,
  faImages,
  faBookOpen,
  faNewspaper,
  faPhotoVideo,
  faClipboardList,
  faUsersCog,
  faCalendarPlus,
  faUserShield,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const excludedHeaderPaths = [
    "/login",
    "/register",
    "/forgot-username",
    "/forgot-password",
    "/reset-password",
    "/pending-approval",
  ];

  if (excludedHeaderPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <header>
      <Navbar
        expand="lg"
        className={`powderpost-navbar ${scrolled ? "scrolled" : ""}`}
      >
        <LinkContainer to="/">
          <Navbar.Brand className="ms-5 d-flex flex-column align-items-center">
            <Image
              src={logo}
              alt="PowderPost Logo"
              className="navbar-logo"
            />
            <div className="tagline mt-1">Ride Together. Rise Above.</div>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {userInfo ? (
              <Nav className="">
                <LinkContainer to="/home">
                  <Nav.Link
                    className={
                      location.pathname === "/home" ? "active-link" : ""
                    }
                  >
                    Dashboard
                  </Nav.Link>
                </LinkContainer>

                <NavDropdown
                  title={<span>Membership</span>}
                  className={
                    location.pathname.startsWith("/member") ? "active-link" : ""
                  }
                >
                  <LinkContainer to="/directory">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faAddressBook} className="me-2" />
                      Member Directory
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/calendar">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      Club Events
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/bb">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBullhorn} className="me-2" />
                      Bulletin Board
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/gallery">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faImages} className="me-2" />
                      Photo Gallery
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/news">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faNewspaper} className="me-2" />
                      Club News
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <NavDropdown
                  title={<span>About</span>}
                  className={
                    location.pathname.startsWith("/about") ? "active-link" : ""
                  }
                >
                  <LinkContainer to="/history">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Club History
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown
                    title={<span className="admin-badge"><FontAwesomeIcon icon={faUserShield} className="me-2" />Admin</span>}
                    className={
                      location.pathname.startsWith("/admin")
                        ? "active-link"
                        : ""
                    }
                  >
                    <LinkContainer to="/admin/news/list">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon={faNewspaper} className="me-2" />
                        News Management
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/images/list">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon={faPhotoVideo} className="me-2" />
                        Gallery Management
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/bb">
                      <NavDropdown.Item>
                        <FontAwesomeIcon
                          icon={faClipboardList}
                          className="me-2"
                        />
                        Bulletin Board Management
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/members/list">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon={faUsersCog} className="me-2" />
                        Member Management
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/events/list">
                      <NavDropdown.Item>
                        <FontAwesomeIcon
                          icon={faCalendarPlus}
                          className="me-2"
                        />
                        Event Management
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/user/list">
                      <NavDropdown.Item>
                        <FontAwesomeIcon icon={faUserShield} className="me-2" />
                        User Management
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}

                <NavDropdown
                  title={<span className="user-dropdown">{userInfo.name}</span>}
                  align="end"
                >
                  <LinkContainer to="/bb">
                    <NavDropdown.Item>
                      <FontAwesomeIcon icon={faBullhorn} className="me-2" />
                      Bulletin Board
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
