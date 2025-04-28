import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaArrowLeft, FaTags } from "react-icons/fa";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import {
  useGetSingleImageQuery,
  useUpdateImageMutation,
} from "../../slices/imageApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Form Field Component
const FormField = ({ label, type, value, onChange, required, error }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <InputGroup>
      {type === "tags" && (
        <InputGroup.Text>
          <FaTags />
        </InputGroup.Text>
      )}
      <Form.Control
        type={type === "tags" ? "text" : type}
        value={value}
        onChange={onChange}
        required={required}
        isInvalid={!!error}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </InputGroup>
    {type === "tags" && (
      <Form.Text className="text-muted">
        Separate tags with commas (e.g., summer, party, club)
      </Form.Text>
    )}
  </Form.Group>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
};

// Image Preview Component
const ImagePreview = ({ image }) => (
  <div className="text-center mb-4">
    <h5 className="mb-3">Current Image</h5>
    <img
      src={image}
      alt="Preview"
      className="img-fluid rounded shadow-sm"
      style={{ maxHeight: "300px", objectFit: "contain" }}
    />
  </div>
);

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
};

const ImageEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    carousel: false,
  });

  const [errors, setErrors] = useState({});
  const [initialState, setInitialState] = useState({});

  const { data: image, isLoading, error } = useGetSingleImageQuery(id);
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();

  useEffect(() => {
    if (image) {
      const newFormData = {
        title: image.title,
        description: image.description || "",
        tags: image.tags.join(", "),
        carousel: image.carousel,
      };
      setFormData(newFormData);
      setInitialState(newFormData);
    }
  }, [image]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    return newErrors;
  };

  const hasChanges = useCallback(() => {
    return (
      formData.title !== initialState.title ||
      formData.description !== initialState.description ||
      formData.tags !== initialState.tags ||
      formData.carousel !== initialState.carousel
    );
  }, [formData, initialState]);

  const handleInputChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const tagArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

        await updateImage({
          id,
          title: formData.title,
          description: formData.description,
          tags: tagArray,
          carousel: formData.carousel,
        }).unwrap();

        toast.success("Image updated successfully");
        navigate("/admin/images/list");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to update image");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading image"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Edit Image</h1>
                  <Link
                    to="/admin/images/list"
                    className="btn btn-outline-secondary"
                  >
                    <FaArrowLeft className="me-1" /> Back to Images
                  </Link>
                </div>

                {image && <ImagePreview image={image.image} />}

                <Form onSubmit={submitHandler}>
                  <FormField
                    label="Title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    required
                    error={errors.title}
                  />

                  <FormField
                    label="Description"
                    type="text"
                    value={formData.description}
                    onChange={handleInputChange("description")}
                  />

                  <FormField
                    label="Tags"
                    type="tags"
                    value={formData.tags}
                    onChange={handleInputChange("tags")}
                  />

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Include in Carousel"
                      checked={formData.carousel}
                      onChange={handleInputChange("carousel")}
                      id="carousel-toggle"
                    />
                  </Form.Group>

                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="secondary"
                      as={Link}
                      to="/admin/images/list"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isUpdating || !hasChanges()}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default ImageEditScreen;
