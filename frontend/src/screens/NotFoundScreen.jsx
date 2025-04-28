import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountain, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFoundScreen = () => {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <FontAwesomeIcon 
              icon={faMountain} 
              size="5x" 
              className="text-powder-blue mb-3" 
              style={{ color: '#5DA9E9' }}
            />
            <h1 className="heading-font display-1 mb-0">404</h1>
            <h2 className="heading-font mb-4">Trail Not Found</h2>
          </div>
          
          <div className="p-4 mb-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
            <p className="mb-3">Looks like you've ventured off the marked trail. The powder's great out here, but there's nothing to see.</p>
            <p>Let's get you back to the main runs.</p>
          </div>
          
          <Link to="/">
            <Button variant="primary" size="lg" className="btn-action">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              Back to Base Camp
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundScreen;
