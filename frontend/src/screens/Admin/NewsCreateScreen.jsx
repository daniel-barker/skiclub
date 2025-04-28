import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { FaArrowLeft, FaImage, FaFilePdf, FaSave, FaUpload, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import Editor from "../../components/Editor";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useCreateNewsMutation,
  useUploadNewsImageMutation,
  useUploadNewsPDFMutation,
} from "../../slices/newsApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// File Preview Component
const FilePreview = ({ type, file, onRemove }) => (
  <div className="text-center mb-4">
    {type === "image" && file && (
      <div>
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="img-fluid rounded"
          style={{ maxHeight: "200px" }}
        />
        <Button
          variant="outline-danger"
          size="sm"
          onClick={onRemove}
          className="mt-2"
        >
          Remove Image
        </Button>
      </div>
    )}
    {type === "pdf" && file && (
      <div className="d-flex align-items-center justify-content-center gap-2">
        <FaFilePdf size={24} className="text-danger" />
        <span>{file.name}</span>
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
          Remove PDF
        </Button>
      </div>
    )}
  </div>
);

FilePreview.propTypes = {
  type: PropTypes.oneOf(["image", "pdf"]).isRequired,
  file: PropTypes.object,
  onRemove: PropTypes.func.isRequired,
};

const NewsCreateScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    post: "",
    isPublished: false, // Will be set based on which button is clicked
  });
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [errors, setErrors] = useState({});

  const [createNews, { isLoading: loadingCreate }] = useCreateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();
  const [uploadPDF, { isLoading: loadingPDF }] = useUploadNewsPDFMutation();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.post.trim()) {
      newErrors.post = "Content is required";
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
    }
  };

  const handlePDFChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("PDF size should be less than 10MB");
        return;
      }
      setPdf(file);
    }
  };

  const submitHandler = async (e, publish = false) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        let newsData = {
          title: formData.title,
          post: formData.post,
          isPublished: publish,
        };

        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          const uploadResult = await uploadImage(formData).unwrap();
          newsData.image = uploadResult.image;
          newsData.thumbnail = uploadResult.thumbnail;
        }

        if (pdf) {
          const pdfFormData = new FormData();
          pdfFormData.append("pdf", pdf);
          const pdfUploadResult = await uploadPDF(pdfFormData).unwrap();
          newsData.pdf = pdfUploadResult.pdf;
        }

        await createNews(newsData).unwrap();
        toast.success("News created successfully");
        navigate("/admin/news/list");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to create news");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (loadingCreate || loadingUpload || loadingPDF) return <Loader />;

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Create News Post</h1>
                  <Link
                    to="/admin/news/list"
                    className="btn btn-outline-secondary"
                  >
                    <FaArrowLeft className="me-1" /> Back to News
                  </Link>
                </div>

                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-4">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={handleInputChange("title")}
                      isInvalid={!!errors.title}
                      className="form-control-lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Content</Form.Label>
                    <Editor
                      content={formData.post}
                      setContent={(content) =>
                        setFormData((prev) => ({ ...prev, post: content }))
                      }
                      className={errors.post ? "is-invalid" : ""}
                    />
                    {errors.post && (
                      <div className="invalid-feedback d-block">
                        {errors.post}
                      </div>
                    )}
                  </Form.Group>

                  <Row className="mb-4 align-items-center justify-content-center">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaImage className="me-2" />
                          Add Image (Optional)
                        </Form.Label>
                        <Form.Control
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                        <Form.Text className="text-muted">
                          Maximum size: 5MB. Supported formats: JPG, PNG, GIF
                        </Form.Text>
                      </Form.Group>
                      {image && (
                        <FilePreview
                          type="image"
                          file={image}
                          onRemove={() => setImage(null)}
                        />
                      )}
                    </Col>
                    {/* <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          <FaFilePdf className="me-2" />
                          Add PDF (Optional)
                        </Form.Label>
                        <Form.Control
                          type="file"
                          onChange={handlePDFChange}
                          accept=".pdf"
                        />
                        <Form.Text className="text-muted">
                          Maximum size: 10MB
                        </Form.Text>
                      </Form.Group>
                      {pdf && (
                        <FilePreview
                          type="pdf"
                          file={pdf}
                          onRemove={() => setPdf(null)}
                        />
                      )}
                    </Col> */}
                  </Row>

                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="secondary" as={Link} to="/admin/news/list">
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                    <Button
                      variant="warning"
                      onClick={(e) => submitHandler(e, false)}
                      disabled={loadingCreate || loadingUpload || loadingPDF}
                    >
                      <FaSave className="me-1" /> Save Draft
                    </Button>
                    <Button
                      variant="primary"
                      onClick={(e) => submitHandler(e, true)}
                      disabled={loadingCreate || loadingUpload || loadingPDF}
                    >
                      <FaUpload className="me-1" /> Publish News
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

export default NewsCreateScreen;
