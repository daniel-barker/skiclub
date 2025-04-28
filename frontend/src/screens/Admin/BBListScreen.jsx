import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetAllPostsQuery,
  useDeletePostAsAdminMutation,
} from "../../slices/postApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Control
        type="text"
        placeholder="Filter by Post Title"
        value={filters.title}
        onChange={(e) => onFilterChange("title", e.target.value)}
      />
    </Col>
    <Col md={6}>
      <Form.Control
        type="text"
        placeholder="Filter by Author"
        value={filters.author}
        onChange={(e) => onFilterChange("author", e.target.value)}
      />
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <span className={`badge bg-${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

// Post Table Row Component
const PostTableRow = ({ post, onDelete }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <tr>
      <td className="align-middle">{post.title}</td>
      <td className="align-middle">{formatDate(post.createdAt)}</td>
      <td className="align-middle">{post.user.name}</td>
      <td className="align-middle">
        <StatusBadge status={post.status} />
      </td>
      <td className="align-middle">
        <div className="d-flex justify-content-start gap-2">
          <LinkContainer to={`/admin/bb/${post._id}/edit`}>
            <Button variant="primary" size="sm">
              <FaEdit className="me-1" /> Edit
            </Button>
          </LinkContainer>
          <Button variant="danger" size="sm" onClick={() => onDelete(post._id)}>
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

PostTableRow.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const BBListScreen = () => {
  const { data: posts, refetch, isLoading, error } = useGetAllPostsQuery();
  const [deletePost, { isLoading: loadingDelete }] =
    useDeletePostAsAdminMutation();

  const [filters, setFilters] = useState({
    title: "",
    author: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(id);
        toast.success("Post deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        post.user.name.toLowerCase().includes(filters.author.toLowerCase())
    );
  }, [posts, filters]);

  if (isLoading || loadingDelete) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading bulletin board posts"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">Bulletin Board Management</h1>
          </Col>
          <Col xs="auto">
            <LinkContainer to="/bb/create">
              <Button variant="primary">
                <FaPlus className="me-1" /> Create Post
              </Button>
            </LinkContainer>
          </Col>
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        <div className="table-responsive">
          <Table hover className="align-middle bg-white shadow-sm rounded">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Created On</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <PostTableRow
                  key={post._id}
                  post={post}
                  onDelete={deleteHandler}
                />
              ))}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </ErrorBoundary>
  );
};

export default BBListScreen;
