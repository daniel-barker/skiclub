import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaUpload, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Editor from "../../components/Editor";
import ErrorBoundary from "../../components/ErrorBoundary";
import {
  useGetNewsByIdQuery,
  useUpdateNewsMutation,
  useUploadNewsImageMutation,
  useUploadNewsPDFMutation,
} from "../../slices/newsApiSlice";



// Custom hook for file handling
const useFileHandler = (initialFile = "", initialPreview = "") => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);
  const [originalFile, setOriginalFile] = useState(initialFile);
  const [removeFile, setRemoveFile] = useState(false);

  useEffect(() => {
    setOriginalFile(initialFile);
    setPreview(initialFile);
  }, [initialFile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(selectedFile);
      }
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
    originalFile,
    removeFile,
    handleFileChange,
    handleRemoveChange,
  };
};

// File Preview Component
const FilePreview = ({ type, preview, original, onRemove, removeChecked }) => (
  <Col md={6} className="d-flex flex-column align-items-center mb-3">
    <Form.Group>
      <Form.Label>
        {type === "image" ? "Image Preview" : "Current PDF"}
      </Form.Label>
      {type === "image"
        ? (preview || original) && (
            <div className="position-relative">
              <img
                src={
                  preview.startsWith("data:")
                    ? preview
                    : `/${preview || original}`
                }
                alt="Preview"
                className="img-fluid rounded shadow-sm"
                style={{ maxWidth: "300px", opacity: removeChecked ? 0.5 : 1 }}
              />
            </div>
          )
        : original && (
            <div
              className="position-relative"
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
              }}
            >
              <img
                src={`/${preview || original}`}
                alt="PDF Preview"
                style={{ maxWidth: "300px", opacity: removeChecked ? 0.5 : 1 }}
              />
            </div>
          )}
      {(preview || original) && (
        <Form.Check
          type="checkbox"
          label={`Remove ${type === "image" ? "Image" : "PDF"}`}
          checked={removeChecked}
          onChange={onRemove}
          className="mt-2"
        />
      )}
    </Form.Group>
  </Col>
);

FilePreview.propTypes = {
  type: PropTypes.oneOf(["image", "pdf"]).isRequired,
  preview: PropTypes.string,
  original: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  removeChecked: PropTypes.bool.isRequired,
};

const NewsEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [initialState, setInitialState] = useState({});

  const { data: news, isLoading, error } = useGetNewsByIdQuery(id);
  const [updateNews, { isLoading: loadingUpdate }] = useUpdateNewsMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadNewsImageMutation();
  const [uploadPDF, { isLoading: loadingPDF }] = useUploadNewsPDFMutation();

  const {
    file: image,
    preview: imagePreview,
    originalFile: originalImage,
    removeFile: removeImage,
    handleFileChange: handleImageChange,
    handleRemoveChange: handleRemoveImage,
  } = useFileHandler(news?.image || "", news?.image || "");

  const {
    file: pdf,
    originalFile: originalPdf,
    removeFile: removePdf,
    handleFileChange: handlePdfChange,
    handleRemoveChange: handleRemovePdf,
  } = useFileHandler(news?.pdf || "", news?.pdf || "");

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setPost(news.post);
      setIsPublished(news.isPublished);
      setInitialState({
        title: news.title,
        post: news.post,
        isPublished: news.isPublished,
        image: news.image,
        pdf: news.pdf,
      });
    }
  }, [news]);

  const hasChanges = useCallback(() => {
    return (
      title !== initialState.title ||
      post !== initialState.post ||
      isPublished !== initialState.isPublished ||
      image ||
      pdf ||
      removeImage ||
      removePdf
    );
  }, [
    title,
    post,
    isPublished,
    initialState,
    image,
    pdf,
    removeImage,
    removePdf,
  ]);

  const submitHandler = async (e, publish = null) => {
    e.preventDefault();

    try {
      // If publish is explicitly set (not null), use it, otherwise keep current state
      const publishState = publish !== null ? publish : isPublished;

      const updatedNews = {
        id,
        title,
        post,
        isPublished: publishState,
      };

      // Handle image upload
      if (removeImage) {
        updatedNews.image = "";
        updatedNews.thumbnail = "";
      } else if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(formData).unwrap();
        updatedNews.image = uploadResult.image;
        updatedNews.thumbnail = uploadResult.thumbnail;
      } else if (originalImage) {
        updatedNews.image = originalImage;
      }

      // Handle PDF upload
      if (removePdf) {
        updatedNews.pdf = "";
        updatedNews.pdfPreview = "";
        updatedNews.pdfThumbnail = "";
      } else if (pdf) {
        const formData = new FormData();
        formData.append("pdf", pdf);
        const uploadResult = await uploadPDF(formData).unwrap();
        updatedNews.pdf = uploadResult.pdf;
        updatedNews.pdfPreview = uploadResult.pdfPreview;
        updatedNews.pdfThumbnail = uploadResult.pdfThumbnail;
      } else if (originalPdf) {
        updatedNews.pdf = originalPdf;
        updatedNews.pdfPreview = news.pdfPreview;
        updatedNews.pdfThumbnail = news.pdfThumbnail;
      }

      await updateNews(updatedNews).unwrap();
      toast.success("News updated successfully");
      navigate("/admin/news/list");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update news");
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error.data?.message || "Error loading news"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="bg-white p-4 rounded shadow-sm">
              <h1 className="text-center mb-4">Edit News</h1>
              <Form onSubmit={submitHandler}>
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
                  <Editor content={post} setContent={setPost} />
                </Form.Group>

                <Row className="mb-3 justify-content-center">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Form.Group>
                  </Col>
                  {/* <Col md={6}>
                    <Form.Group>
                      <Form.Label>PDF Attachment</Form.Label>
                      <Form.Control
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfChange}
                      />
                    </Form.Group>
                  </Col> */}
                </Row>

                <Row className="justify-content-center">
                  <FilePreview
                    type="image"
                    preview={imagePreview}
                    original={originalImage}
                    onRemove={handleRemoveImage}
                    removeChecked={removeImage}
                  />
                  {/* <FilePreview
                    type="pdf"
                    original={originalPdf}
                    onRemove={handleRemovePdf}
                    removeChecked={removePdf}
                  /> */}
                </Row>

                <div className="d-flex gap-2 justify-content-center">
                  <Button variant="secondary" as={Link} to="/admin/news/list">
                    <FaTimes className="me-1" /> Cancel
                  </Button>
                  <Button
                    variant="warning"
                    onClick={(e) => submitHandler(e, false)}
                    disabled={loadingUpdate || loadingUpload || loadingPDF}
                  >
                    <FaSave className="me-1" /> Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={(e) => submitHandler(e, true)}
                    disabled={loadingUpdate || loadingUpload || loadingPDF}
                  >
                    <FaUpload className="me-1" /> Publish News
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

export default NewsEditScreen;
