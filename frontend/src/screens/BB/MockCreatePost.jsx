import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { FaArrowLeft, FaSave, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import ErrorBoundary from "../../components/ErrorBoundary";
import { handleFormSuccess } from "../../mockData/formHelper";

const MockCreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!body.trim()) newErrors.body = "Content is required";
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Use the form success handler
    await handleFormSuccess(
      "Post created successfully and is pending approval",
      navigate,
      "/bb/mine"
    );
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage("");
    setImagePreview("");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="display-6 fw-bold text-center">Create New Post</h1>
            <p className="text-muted text-center">
              Share updates and announcements with the community
            </p>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Body>
            <Form onSubmit={submitHandler}>
              <Row className="mb-4">
                <Col>
                  <Button variant="outline-primary" onClick={handleGoBack}>
                    <FaArrowLeft className="me-2" /> Back
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button type="submit" variant="primary">
                    <FaSave className="me-2" /> Create Post
                  </Button>
                </Col>
              </Row>

              <Form.Group controlId="title" className="mb-4">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  isInvalid={!!errors.title}
                  className="form-control-lg"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="body" className="mb-4">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  placeholder="Type your post content here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  isInvalid={!!errors.body}
                  className="form-control-lg"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.body}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="image" className="mb-4">
                <Form.Label>
                  <FaImage className="me-2" />
                  Add Image (Optional)
                </Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    type="file"
                    onChange={imageHandler}
                    accept="image/*"
                    className="form-control-lg"
                  />
                  {imagePreview && (
                    <Button
                      variant="outline-danger"
                      onClick={removeImage}
                      className="flex-shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Form.Text className="text-muted">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, WEBP
                </Form.Text>
              </Form.Group>

              {imagePreview && (
                <div className="text-center mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </ErrorBoundary>
  );
};

export default MockCreatePost;
