import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
} from "react-bootstrap";
import { FaArrowLeft, FaImage, FaTags, FaUpload } from "react-icons/fa";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../slices/imageApiSlice";
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
const ImagePreview = ({ preview }) => (
  <div className="text-center mb-4">
    <h5 className="mb-3">Image Preview</h5>
    <img
      src={preview}
      alt="Preview"
      className="img-fluid rounded shadow-sm"
      style={{ maxHeight: "300px", objectFit: "contain" }}
    />
  </div>
);

ImagePreview.propTypes = {
  preview: PropTypes.string.isRequired,
};

const ImageUploadScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    carousel: false,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!image) {
      newErrors.image = "Image is required";
    }
    return newErrors;
  };

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

  const handleImageChange = (e) => {
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

      // Clear any existing image error
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);

        const tagArray = formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        formDataToSend.append("tags", JSON.stringify(tagArray));

        formDataToSend.append("image", image);
        formDataToSend.append("carousel", formData.carousel);

        const result = await uploadImage(formDataToSend).unwrap();
        toast.success("Image uploaded successfully");
        // Use setTimeout to ensure the toast is visible before navigation
        setTimeout(() => {
          navigate("/admin/images/list");
        }, 2000);
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.error || "Failed to upload image";
        toast.error(errorMessage, {
          autoClose: 5000, // Keep error message visible longer
        });
      }
    } else {
      setErrors(validationErrors);
      // Show validation errors in toast
      Object.values(validationErrors).forEach((error) => {
        toast.error(error, {
          autoClose: 5000,
        });
      });
    }
  };

  if (isLoading) return <Loader />;

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Upload New Image</h1>
                  <Link
                    to="/admin/images/list"
                    className="btn btn-outline-secondary"
                  >
                    <FaArrowLeft className="me-1" /> Back to Images
                  </Link>
                </div>

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
                    <Form.Label>
                      <FaImage className="me-2" />
                      Image
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      isInvalid={!!errors.image}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.image}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Maximum file size: 10MB. Supported formats: JPEG, PNG,
                      GIF, TIFF, BMP, HEIC/HEIF, and various RAW formats
                    </Form.Text>
                  </Form.Group>

                  {imagePreview && <ImagePreview preview={imagePreview} />}

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
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader size="sm" /> Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload className="me-1" /> Upload Image
                        </>
                      )}
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

export default ImageUploadScreen;
