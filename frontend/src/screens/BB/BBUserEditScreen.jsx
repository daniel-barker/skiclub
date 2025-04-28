import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaImage,
  FaSave,
  FaTrash,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Editor from "../../components/Editor";
import {
  useGetPostByIdQuery,
  useUpdatePostAsUserMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ErrorBoundary from "../../components/ErrorBoundary";

// Image Preview Component
const ImagePreview = ({ image, title, onRemove }) => (
  <div className="text-center mb-4">
    <div className="position-relative d-inline-block">
      <img
        src={image}
        alt={title}
        className="img-fluid rounded shadow-sm"
        style={{ maxHeight: "300px", objectFit: "contain" }}
      />
      {onRemove && (
        <Button
          variant="danger"
          size="sm"
          className="position-absolute top-0 end-0 m-2"
          onClick={onRemove}
        >
          <FaTrash />
        </Button>
      )}
    </div>
  </div>
);

ImagePreview.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  onRemove: PropTypes.func,
};

const BBUserEditScreen = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image: "",
    thumbnail: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [updatePost, { isLoading: loadingUpdate }] =
    useUpdatePostAsUserMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
        image: post.image,
        thumbnail: post.thumbnail,
      });
    }
  }, [post]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.body.trim()) {
      newErrors.body = "Content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Reset states before new upload
      setImagePreview("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const result = await uploadImage(formData).unwrap();
        setFormData((prev) => ({
          ...prev,
          image: result.image,
          thumbnail: result.thumbnail,
        }));
        // Only close modal after successful upload
        setShowModal(false);
        toast.success("Image uploaded successfully");
      } catch (err) {
        // Clear preview on error
        setImagePreview("");
        toast.error(err?.data?.message || "Failed to upload image");
      }
    }
  };

  const handleRemoveImage = () => {
    // Clear all image-related states
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      image: "",
      thumbnail: "",
    }));
    setShowModal(false);
    toast.success("Image removed");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updatePost({
        _id: postId,
        ...formData,
      }).unwrap();
      toast.success("Post updated successfully and is pending approval");
      navigate("/bb/mine");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update post");
    }
  };

  if (isLoading || loadingUpdate || loadingUpload) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading post"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Edit Post</h1>
                  <Link to="/bb/mine" className="btn btn-outline-secondary">
                    <FaArrowLeft className="me-1" /> Back to My Posts
                  </Link>
                </div>

                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-4">
                    <Form.Label>Title</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Enter a descriptive title"
                        value={formData.title}
                        onChange={handleInputChange("title")}
                        isInvalid={!!errors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.title}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Content</Form.Label>
                    <Editor
                      content={formData.body}
                      setContent={(content) =>
                        setFormData((prev) => ({ ...prev, body: content }))
                      }
                    />
                    {errors.body && (
                      <div className="text-danger mt-2">{errors.body}</div>
                    )}
                  </Form.Group>

                  {(formData.image || imagePreview) && (
                    <ImagePreview
                      image={
                        imagePreview ||
                        (formData.thumbnail ? `/${formData.thumbnail}` : "")
                      }
                      title={formData.title}
                      onRemove={handleRemoveImage}
                    />
                  )}

                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button
                      variant="primary"
                      onClick={() => setShowModal(true)}
                    >
                      <FaImage className="me-2" />
                      {formData.image ? "Change Image" : "Add Image"}
                    </Button>
                  </div>

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                      <FaSave className="me-2" /> Save Changes
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaUpload className="me-2" />
              {formData.image ? "Update Image" : "Add Image"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Choose an image (max 5MB)</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                accept="image/*"
              />
              <Form.Text className="text-muted">
                Supported formats: JPG, PNG, GIF
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <FaTimes className="me-2" /> Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </ErrorBoundary>
  );
};

export default BBUserEditScreen;
