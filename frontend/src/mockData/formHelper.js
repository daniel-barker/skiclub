/**
 * Form Helper for Portfolio Version
 * 
 * This file provides helper functions for handling form submissions
 * in the portfolio version of the application (without a backend).
 */

import { toast } from 'react-toastify';

/**
 * Simulates a successful form submission with a toast notification
 * @param {string} message - Success message to display
 * @param {Function} navigate - React Router navigate function (optional)
 * @param {string} redirectPath - Path to redirect to after success (optional)
 * @param {number} delay - Delay before redirect in milliseconds (optional)
 * @returns {Promise} - Promise that resolves after the delay
 */
export const handleFormSuccess = async (message, navigate = null, redirectPath = null, delay = 1000) => {
  // Show success toast
  toast.success(message || 'Operation completed successfully');
  
  // Wait for the specified delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Redirect if navigate and redirectPath are provided
  if (navigate && redirectPath) {
    navigate(redirectPath);
  }
  
  return true;
};

/**
 * Simulates a form submission error with a toast notification
 * @param {string} message - Error message to display
 * @returns {Promise} - Promise that resolves after a short delay
 */
export const handleFormError = async (message) => {
  // Show error toast
  toast.error(message || 'An error occurred. Please try again.');
  
  // Wait for a short delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return false;
};

/**
 * Wrapper for form submission handlers in the portfolio version
 * @param {Function} handler - The original submission handler function
 * @param {string} successMessage - Success message to display
 * @param {Function} navigate - React Router navigate function (optional)
 * @param {string} redirectPath - Path to redirect to after success (optional)
 * @returns {Function} - New handler function that simulates backend interaction
 */
export const createPortfolioFormHandler = (successMessage, navigate = null, redirectPath = null) => {
  return async (e) => {
    e.preventDefault();
    
    // Show loading state (if you have a loading state in your app)
    // setLoading(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate success
      await handleFormSuccess(successMessage, navigate, redirectPath);
      
      return true;
    } catch (error) {
      // Simulate error (10% chance of error for realism)
      if (Math.random() < 0.1) {
        await handleFormError('Simulated error for demonstration purposes');
        return false;
      }
      
      // Otherwise succeed
      await handleFormSuccess(successMessage, navigate, redirectPath);
      return true;
    } finally {
      // Hide loading state
      // setLoading(false);
    }
  };
};

/**
 * Add a note to the console about portfolio mode
 */
console.info('Portfolio Mode: Form submissions are simulated and no data is sent to a backend server.');
