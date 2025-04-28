import React from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert variant="danger" className="m-3">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>{this.state.error && this.state.error.toString()}</p>
          {process.env.NODE_ENV === "development" && this.state.errorInfo && (
            <pre className="mt-3 p-3 bg-light">
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </Alert>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
