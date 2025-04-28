import { useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import DOMPurify from "dompurify";
import ErrorBoundary from "../components/ErrorBoundary";

// Import mock news data
import { news } from "../mockData/newsMock";

// Custom hook for pagination
const usePagination = (items, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => (items ? Math.ceil(items.length / itemsPerPage) : 1),
    [items, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items?.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  return { currentPage, totalPages, currentItems, handlePageChange };
};

// Modal component
const MediaModal = ({ show, onHide, content }) => (
  <Modal show={show} onHide={onHide} centered size="lg">
    <Modal.Body className="p-0">
      <Button
        className="news-modal-close position-absolute top-0 end-0 m-2"
        onClick={onHide}
      >
        &times;
      </Button>
      <div className="d-flex justify-content-center align-items-center w-100 py-0">
        {content}
      </div>
    </Modal.Body>
  </Modal>
);

MediaModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  content: PropTypes.node,
};

// News Card component
const NewsCard = ({ post, onImageClick }) => {
  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="news-card my-3 p-3 rounded shadow-sm">
      <Row className="g-0">
        <Col md={post.image ? 7 : 12}>
          <div className="news-card-body">
            <Card.Title className="news-card-title">{post.title}</Card.Title>
            <div className="news-card-date">
              Posted on: {formatDate(post.createdAt)}
            </div>
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}
            />
          </div>
        </Col>

        {post.image && (
          <Col md={5} className="news-card-media">
            <div className="d-flex justify-content-center">
              <img
                src={post.image}
                alt={post.title}
                className="img-fluid rounded news-card-image"
                style={{ cursor: "pointer" }}
                onClick={() => onImageClick(post.image)}
              />
            </div>
          </Col>
        )}
      </Row>
    </Card>
  );
};

NewsCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

const MockNewsScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // Use the mock news data directly
  const { currentPage, totalPages, currentItems, handlePageChange } =
    usePagination(news, 5);

  // PDF functionality removed for portfolio version

  const handleImageClick = useCallback((image) => {
    setModalContent(
      <img
        src={image}
        alt="Full size"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    );
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalContent(null);
  }, []);

  return (
    <ErrorBoundary>
      <Container>
        <Row className="align-items-center my-4">
          <Col className="text-center">
            <h2 className="display-6 fw-bold">Club News</h2>
            <p className="text-muted">Newest news first</p>
          </Col>
        </Row>

        {currentItems?.map((post) => (
          <NewsCard
            key={post._id}
            post={post}
            onImageClick={handleImageClick}
          />
        ))}

        <MediaModal
          show={showModal}
          onHide={handleCloseModal}
          content={modalContent}
        />

        <Row className="d-flex justify-content-center m-4">
          <Col xs="auto">
            <Button
              variant="primary"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default MockNewsScreen;
