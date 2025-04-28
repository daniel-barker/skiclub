import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CredentialsModal = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the modal has been shown before
    const hasShownModal = localStorage.getItem('credentialsModalShown');
    
    if (!hasShownModal) {
      // If not shown before, show it now
      setShow(true);
      // Mark as shown in localStorage so it doesn't appear again in this session
      localStorage.setItem('credentialsModalShown', 'true');
    }
  }, []);

  const handleClose = () => setShow(false);

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Welcome to PowderPost Ski Club</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>This is a portfolio demonstration site with mock data.</p>
        <p>For demonstration purposes, you can use the following credentials:</p>
        
        <div className="bg-light p-3 rounded mb-3">
          <h6>Admin Access:</h6>
          <p className="mb-1">Username: <strong>admin</strong></p>
          <p>Password: <strong>abc123</strong></p>
        </div>
        
        <div className="bg-light p-3 rounded">
          <h6>Regular User Access:</h6>
          <p className="mb-1">Username: <strong>user</strong></p>
          <p>Password: <strong>abc123</strong></p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Got it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CredentialsModal;
