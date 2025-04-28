import { useState } from "react";
import { Row, Col, Container, Button, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaRegClock,
  FaUser,
  FaNewspaper,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetMyPostsQuery,
  useDeletePostAsUserMutation,
} from "../../slices/postApiSlice";
import DOMPurify from "dompurify";
import Message from "../../components/Message";
import ErrorBoundary from "../../components/ErrorBoundary";

const PostCard = ({ post, onDelete, onToggleExpand, isExpanded }) => {
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

  return (
    <Card className="shadow-sm hover-shadow mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 className="h4 fw-bold mb-2">{post.title}</h2>
            <div className="text-muted small d-flex align-items-center gap-3">
              <span className="d-flex align-items-center">
                <FaRegClock className="me-1" /> {formatDate(post.createdAt)}
              </span>
              <span
                className={`badge ${
                  post.status === "approved"
                    ? "bg-success"
                    : post.status === "pending"
                    ? "bg-warning"
                    : "bg-secondary"
                }`}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/bb/edit/${post._id}`}>
              <Button variant="outline-primary" size="sm">
                <FaEdit className="me-1" /> Edit
              </Button>
            </Link>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(post._id)}
            >
              <FaTrash className="me-1" /> Delete
            </Button>
          </div>
        </div>

        {post.image && (
          <div className="text-center mb-3">
            <img
              src={`/${post.thumbnail}`}
              alt={post.title}
              className="img-fluid rounded"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </div>
        )}

        <div className="post-content">
          <div
            className={`post-body ${!isExpanded ? "truncated" : ""}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                isExpanded ? post.body : post.body.substring(0, 300) + "..."
              ),
            }}
          />
          {post.body.length > 300 && (
            <Button
              variant="link"
              className="p-0 text-primary"
              onClick={() => onToggleExpand(post._id)}
            >
              {isExpanded ? "Show Less" : "Read More"}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

const MyPosts = () => {
  const { data: posts, refetch, isLoading, error } = useGetMyPostsQuery();
  const [deletePost, { isLoading: loadingDelete }] =
    useDeletePostAsUserMutation();
  const [expandedPostIds, setExpandedPostIds] = useState([]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        toast.success("Post deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete post");
      }
    }
  };

  const togglePostBody = (id) => {
    setExpandedPostIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((postId) => postId !== id)
        : [...prevIds, id]
    );
  };

  if (isLoading || loadingDelete) {
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

  if (error) {
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading posts"}
      </Message>
    );
  }

  // Filter out rejected posts
  const visiblePosts = posts.filter((post) => post.status !== "rejected");

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="display-6 fw-bold text-center">My Posts</h1>
            <p className="text-muted text-center">
              Manage and track your bulletin board posts
            </p>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col className="d-flex gap-2 justify-content-center">
            <Link to="/bb" className="btn btn-outline-primary">
              <FaNewspaper className="me-2" /> All Posts
            </Link>
            <Link to="/bb/create" className="btn btn-primary">
              <FaPlus className="me-2" /> Create Post
            </Link>
          </Col>
        </Row>

        {visiblePosts.length === 0 ? (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <FaNewspaper size={48} className="text-muted mb-3" />
              <h4>No Posts Yet</h4>
              <p className="text-muted">
                Create your first post to get started!
              </p>
              <Link to="/bb/create" className="btn btn-primary">
                <FaPlus className="me-2" /> Create Post
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col xs={12}>
              {visiblePosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={deleteHandler}
                  onToggleExpand={togglePostBody}
                  isExpanded={expandedPostIds.includes(post._id)}
                />
              ))}
            </Col>
          </Row>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default MyPosts;
