import { useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaUser, FaRegClock, FaImage } from "react-icons/fa";
import DOMPurify from "dompurify";
import ErrorBoundary from "../../components/ErrorBoundary";

// Import mock posts data
import { posts } from "../../mockData/postsMock";

const MockBulletinBoard = () => {
  const [expandedPostIds, setExpandedPostIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const togglePostBody = (id) => {
    setExpandedPostIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((postId) => postId !== id)
        : [...prevIds, id]
    );
  };

  const handleImageClick = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  return (
    <ErrorBoundary>
      <Container className="my-4">
        <Row className="align-items-center mb-4">
          <Col className="text-center">
            <h1 className="display-5 fw-bold mb-2">Bulletin Board</h1>
            <p className="text-muted lead">
              Stay connected with the latest community updates and announcements
            </p>
          </Col>
          <hr className="my-3" />
        </Row>

        <Row className="mb-4">
          <Col className="d-flex gap-2 justify-content-center">
            <Link to="/bb/create" className="btn btn-primary">
              <FaPlus className="me-2" /> Create Post
            </Link>
            <Link to="/bb/mine" className="btn btn-outline-primary">
              <FaUser className="me-2" /> My Posts
            </Link>
          </Col>
        </Row>

        {posts?.length === 0 ? (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <FaImage size={48} className="text-muted mb-3" />
              <h4>No posts yet</h4>
              <p className="text-muted">Be the first to create a post!</p>
              <Link to="/bb/create" className="btn btn-primary">
                <FaPlus className="me-2" /> Create Post
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {posts.map((post) => (
              <Col xs={12} className="mb-4" key={post._id}>
                <Card className="shadow-sm hover-shadow">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h2 className="h4 fw-bold mb-2">{post.title}</h2>
                        <div className="text-muted small d-flex align-items-center gap-3">
                          <span className="d-flex align-items-center">
                            <FaUser className="me-1" /> {post.user?.name}
                          </span>
                          <span className="d-flex align-items-center">
                            <FaRegClock className="me-1" />{" "}
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {post.image && (
                      <div className="text-center mb-3">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="img-fluid rounded cursor-pointer hover-scale"
                          style={{ maxHeight: "300px", objectFit: "cover" }}
                          onClick={() => handleImageClick(post.image)}
                        />
                      </div>
                    )}

                    <div className="post-content">
                      <div
                        className={`post-body ${
                          !expandedPostIds.includes(post._id) ? "truncated" : ""
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            expandedPostIds.includes(post._id)
                              ? post.body
                              : post.body.substring(0, 300) + "..."
                          ),
                        }}
                      />
                      {post.body.length > 300 && (
                        <Button
                          variant="link"
                          className="p-0 text-primary"
                          onClick={() => togglePostBody(post._id)}
                        >
                          {expandedPostIds.includes(post._id)
                            ? "Show Less"
                            : "Read More"}
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="lg"
          className="image-modal"
        >
          <Modal.Body className="p-0">
            <Button
              variant="light"
              onClick={() => setShowModal(false)}
              className="position-absolute top-0 end-0 m-2 rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.9)",
                zIndex: 1,
              }}
            >
              ×
            </Button>
            <img
              src={modalImage}
              alt="Enlarged view"
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto" }}
            />
          </Modal.Body>
        </Modal>
      </Container>
    </ErrorBoundary>
  );
};

export default MockBulletinBoard;
