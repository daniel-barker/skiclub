import React from "react";
import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import { FaTrash, FaEdit, FaUpload, FaImage } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetImagesQuery,
  useDeleteImageMutation,
} from "../../slices/imageApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Group>
        <Form.Label>Image Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by Title"
          value={filters.title}
          onChange={(e) => onFilterChange("title", e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Carousel Status</Form.Label>
        <Form.Select
          value={filters.carousel}
          onChange={(e) => onFilterChange("carousel", e.target.value)}
        >
          <option value="">All Images</option>
          <option value="yes">In Carousel</option>
          <option value="no">Not in Carousel</option>
        </Form.Select>
      </Form.Group>
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string.isRequired,
    carousel: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Image Card Component
const ImageCard = ({ image, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="h-100 shadow-sm">
        <div className="position-relative">
          <Card.Img
            variant="top"
            src={image.thumbnail}
            alt={image.title}
            style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
            onClick={() => setShowModal(true)}
          />
          {image.carousel && (
            <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
              Carousel
            </span>
          )}
        </div>
        <Card.Body>
          <Card.Title className="text-truncate">{image.title}</Card.Title>
          <p className="text-muted small mb-2">
            Tags: {image.tags.join(", ") || "No tags"}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <LinkContainer to={`/admin/images/${image._id}/edit`}>
              <Button variant="outline-primary" size="sm">
                <FaEdit className="me-1" /> Edit
              </Button>
            </LinkContainer>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(image._id)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{image.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <img
            src={image.image}
            alt={image.title}
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

ImageCard.propTypes = {
  image: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    carousel: PropTypes.bool.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ImageListScreen = () => {
  const { data: images, refetch, isLoading, error } = useGetImagesQuery();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const [filters, setFilters] = useState({
    title: "",
    carousel: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImage(id).unwrap();
        toast.success("Image deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete image");
      }
    }
  };

  const filteredImages = useMemo(() => {
    if (!images) return [];

    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (filters.carousel === "" ||
          (filters.carousel === "yes" && image.carousel) ||
          (filters.carousel === "no" && !image.carousel))
    );
  }, [images, filters]);

  if (isLoading || isDeleting) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading images"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">Gallery Management</h1>
          </Col>
          <Col xs="auto">
            <Link to="/admin/images/upload" className="btn btn-primary">
              <FaUpload className="me-1" /> Upload Image
            </Link>
          </Col>
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        {filteredImages.length === 0 ? (
          <div className="text-center py-5">
            <FaImage size={48} className="text-muted mb-3" />
            <h4 className="text-muted">No images found</h4>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredImages.map((image) => (
              <Col key={image._id}>
                <ImageCard image={image} onDelete={deleteHandler} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default ImageListScreen;
