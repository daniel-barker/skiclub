import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Editor from "../../components/Editor";
import ErrorBoundary from "../../components/ErrorBoundary";
import {
  useGetPostByIdQuery,
  useUpdatePostAsAdminMutation,
  useUploadPostImageMutation,
} from "../../slices/postApiSlice";
import { toast } from "react-toastify";

// Custom hook for file handling
const useFileHandler = (initialImage = "", initialThumbnail = "") => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialThumbnail);
  const [originalImage, setOriginalImage] = useState(initialImage);
  const [originalThumbnail, setOriginalThumbnail] = useState(initialThumbnail);
  const [removeFile, setRemoveFile] = useState(false);

  useEffect(() => {
    setOriginalImage(initialImage);
    setOriginalThumbnail(initialThumbnail);
    setPreview(initialThumbnail);
  }, [initialImage, initialThumbnail]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveChange = (e) => {
    setRemoveFile(e.target.checked);
    if (e.target.checked) {
      setPreview("");
      setFile(null);
    }
  };

  return {
    file,
    preview,
    originalImage,
    originalThumbnail,
    removeFile,
    handleFileChange,
    handleRemoveChange,
  };
};

// Status Toggle Component
const StatusToggle = ({ status, onChange, postId }) => {
  const [updatePost] = useUpdatePostAsAdminMutation();

  const handleStatusChange = async (newStatus) => {
    try {
      await updatePost({
        _id: postId,
        status: newStatus,
      }).unwrap();
      onChange(newStatus);
      toast.success(`Post status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <ToggleButtonGroup
      type="radio"
      name="status"
      value={status}
      onChange={handleStatusChange}
      className="w-100 mb-3"
    >
      <ToggleButton
        id="toggle-pending"
        variant={status === "pending" ? "warning" : "outline-warning"}
        value="pending"
      >
        Pending
      </ToggleButton>
      <ToggleButton
        id="toggle-approved"
        variant={status === "approved" ? "success" : "outline-success"}
        value="approved"
      >
        Approved
      </ToggleButton>
      <ToggleButton
        id="toggle-rejected"
        variant={status === "rejected" ? "danger" : "outline-danger"}
        value="rejected"
      >
        Rejected
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

StatusToggle.propTypes = {
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired,
};

// Image Preview Component
const ImagePreview = ({ preview, thumbnail, onRemove, removeChecked }) => (
  <Col md={6} className="d-flex flex-column align-items-center mb-3">
    <Form.Group>
      <Form.Label>Image Preview</Form.Label>
      {preview || thumbnail ? (
        <div className="position-relative">
          <img
            src={
              preview
                ? preview.startsWith("data:")
                  ? preview
                  : `/${thumbnail}`
                : `/${thumbnail}`
            }
            alt="Preview"
            className="img-fluid rounded shadow-sm"
            style={{
              maxWidth: "300px",
              opacity: removeChecked ? 0.5 : 1,
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div className="text-muted">No image to preview</div>
      )}
      {(preview || thumbnail) && (
        <Form.Check
          type="checkbox"
          label="Remove Image"
          checked={removeChecked}
          onChange={onRemove}
          className="mt-2"
        />
      )}
    </Form.Group>
  </Col>
);

ImagePreview.propTypes = {
  preview: PropTypes.string,
  thumbnail: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  removeChecked: PropTypes.bool.isRequired,
};

const BBEditScreen = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("pending");
  const [initialState, setInitialState] = useState({});

  const { data: post, isLoading, error } = useGetPostByIdQuery(postId);

  const {
    file: image,
    preview: imagePreview,
    originalImage,
    originalThumbnail,
    removeFile: removeImage,
    handleFileChange: handleImageChange,
    handleRemoveChange: handleRemoveImage,
  } = useFileHandler(post?.image || "", post?.thumbnail || "");

  const [updatePost, { isLoading: loadingUpdate }] =
    useUpdatePostAsAdminMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadPostImageMutation();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setStatus(post.status);
      setInitialState({
        title: post.title,
        body: post.body,
        status: post.status,
      });
    }
  }, [post]);

  const hasChanges = useCallback(() => {
    return (
      title !== initialState.title ||
      body !== initialState.body ||
      status !== initialState.status ||
      image ||
      removeImage
    );
  }, [title, body, status, initialState, image, removeImage]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const updatedPost = {
        _id: postId,
        title,
        body,
        status,
      };

      // Handle image upload
      if (removeImage) {
        updatedPost.image = "";
        updatedPost.thumbnail = "";
      } else if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedPost.image = uploadResult.image;
        updatedPost.thumbnail = uploadResult.thumbnail;
      } else if (originalImage) {
        updatedPost.image = originalImage;
        updatedPost.thumbnail = originalThumbnail;
      }

      await updatePost(updatedPost).unwrap();
      toast.success("Post updated successfully");
      navigate("/admin/bb");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update post");
    }
  };

  if (isLoading) return <Loader />;
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
          <Col md={10} lg={8}>
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="d-flex justify-content-end mb-3">
                <Link to="/admin/bb" className="btn btn-outline-secondary">
                  <FaArrowLeft className="me-1" /> Back to Bulletin Board
                </Link>
              </div>
              <h1 className="text-center mb-4">Edit Bulletin Board Post</h1>
              <Form onSubmit={submitHandler}>
                <StatusToggle
                  status={status}
                  onChange={setStatus}
                  postId={postId}
                />

                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Editor content={body} setContent={setBody} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>

                <Row>
                  <ImagePreview
                    preview={imagePreview}
                    thumbnail={originalThumbnail}
                    onRemove={handleRemoveImage}
                    removeChecked={removeImage}
                  />
                </Row>

                <div className="d-flex gap-2 justify-content-end">
                  <Button variant="secondary" as={Link} to="/admin/bb">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loadingUpdate || loadingUpload || !hasChanges()}
                  >
                    {loadingUpdate || loadingUpload
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default BBEditScreen;
