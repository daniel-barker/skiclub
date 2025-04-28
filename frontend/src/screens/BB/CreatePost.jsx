import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import { FaArrowLeft, FaSave, FaImage } from "react-icons/fa";

import Editor from "../../components/Editor";
import { toast } from "react-toastify";
import {
  useCreatePostMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  const [createPost, { isLoading: loadingCreate }] = useCreatePostMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

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

    try {
      let imageData = null;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        try {
          const result = await uploadImage(formData).unwrap();
          imageData = {
            image: result.image,
            thumbnail: result.thumbnail,
          };
        } catch (error) {
          toast.error(error?.data?.message || "Failed to upload image");
          return;
        }
      }

      const postData = {
        title,
        body,
        ...(imageData && {
          image: imageData.image,
          thumbnail: imageData.thumbnail,
        }),
      };

      await createPost(postData).unwrap();
      toast.success("Post created successfully and is pending approval");
      navigate("/bb/mine");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create post");
    }
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

  if (loadingCreate || loadingUpload) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

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
                <Editor
                  content={body}
                  setContent={setBody}
                  className={errors.body ? "is-invalid" : ""}
                />
                {errors.body && (
                  <div className="invalid-feedback d-block">{errors.body}</div>
                )}
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

export default CreatePost;
