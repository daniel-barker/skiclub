import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container, Row, Col, Form, Card } from "react-bootstrap";
import { FaTrash, FaEdit, FaPlus, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import ErrorBoundary from "../../components/ErrorBoundary";
import { images as mockImages } from "../../mockData/imagesMock";
import { handleFormSuccess } from "../../mockData/formHelper";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Control
        type="text"
        placeholder="Filter by Title"
        value={filters.title}
        onChange={(e) => onFilterChange("title", e.target.value)}
      />
    </Col>
    <Col md={6}>
      <Form.Control
        type="text"
        placeholder="Filter by Tags"
        value={filters.tags}
        onChange={(e) => onFilterChange("tags", e.target.value)}
      />
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Image Table Row Component
const ImageTableRow = ({ image, onDelete }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
  const truncateTags = (tags) => {
    if (!tags || tags.length === 0) return "No tags";
    const tagString = tags.join(", ");
    return tagString.length > 30 ? `${tagString.substring(0, 30)}...` : tagString;
  };

  return (
    <tr>
      <td className="align-middle">
        <div className="d-flex align-items-center">
          <img
            src={image.thumbnail}
            alt={image.title}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
            className="me-2 rounded"
          />
          {image.title}
        </div>
      </td>
      <td className="align-middle">{formatDate(image.createdAt)}</td>
      <td className="align-middle">{truncateTags(image.tags)}</td>
      <td className="align-middle">
        <div className="d-flex justify-content-start gap-2">
          <LinkContainer to={`/admin/images/${image._id}/edit`}>
            <Button variant="primary" size="sm">
              <FaEdit className="me-1" /> Edit
            </Button>
          </LinkContainer>
          <Button variant="danger" size="sm" onClick={() => onDelete(image._id)}>
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

ImageTableRow.propTypes = {
  image: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const MockImageListScreen = () => {
  const [images, setImages] = useState([...mockImages]);

  const [filters, setFilters] = useState({
    title: "",
    tags: "",
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
        setImages(images.filter(image => image._id !== id));
        await handleFormSuccess("Image deleted successfully");
      } catch (err) {
        toast.error("Error deleting image");
      }
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter(
      (image) =>
        image.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (filters.tags === "" ||
          (image.tags &&
            image.tags.some((tag) =>
              tag.toLowerCase().includes(filters.tags.toLowerCase())
            )))
    );
  }, [images, filters]);

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">Gallery Management</h1>
          </Col>
          <Col xs="auto">
            <LinkContainer to="/admin/images/upload">
              <Button variant="primary">
                <FaPlus className="me-1" /> Upload Image
              </Button>
            </LinkContainer>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Body>
            <FilterControls filters={filters} onFilterChange={handleFilterChange} />

            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Image</th>
                    <th>Uploaded</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImages.map((image) => (
                    <ImageTableRow
                      key={image._id}
                      image={image}
                      onDelete={deleteHandler}
                    />
                  ))}
                  {filteredImages.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        <FaImage size={48} className="text-muted mb-3" />
                        <h4 className="text-muted">No images found</h4>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </ErrorBoundary>
  );
};

export default MockImageListScreen;
