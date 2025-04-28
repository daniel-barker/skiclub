import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Banner component that indicates the application is running in portfolio mode
 * This helps viewers understand that this is a frontend-only version
 */
const PortfolioBanner = () => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert 
      variant="info" 
      className="mb-0 rounded-0 d-flex justify-content-between align-items-center"
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 1050,
        fontSize: '0.9rem',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        borderRadius: 0,
        backgroundColor: 'rgba(209, 236, 250, 0.95)'
      }}
    >
      <div className="d-flex align-items-center">
        <FaInfoCircle className="me-2" />
        <span>
          <strong>Portfolio Mode:</strong> This application is running with mock data for demonstration purposes.
          All features are functional but no actual data is saved.
        </span>
      </div>
      <Button 
        variant="link" 
        className="p-0 text-dark" 
        onClick={() => setShow(false)}
        aria-label="Close portfolio banner"
      >
        <FaTimes />
      </Button>
    </Alert>
  );
};

export default PortfolioBanner;
