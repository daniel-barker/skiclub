import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Table, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck, FaPlus } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetAllNewsQuery,
  useDeleteNewsMutation,
} from "../../slices/newsApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={4}>
      <Form.Control
        type="text"
        placeholder="Filter by Title"
        value={filters.title}
        onChange={(e) => onFilterChange("title", e.target.value)}
      />
    </Col>
    <Col md={4}>
      <Form.Control
        type="text"
        placeholder="Filter by Author"
        value={filters.author}
        onChange={(e) => onFilterChange("author", e.target.value)}
      />
    </Col>
    <Col md={4}>
      <Form.Select
        value={filters.published}
        onChange={(e) => onFilterChange("published", e.target.value)}
      >
        <option value="">All Published Status</option>
        <option value="yes">Published</option>
        <option value="no">Unpublished</option>
      </Form.Select>
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// News Table Row Component
const NewsTableRow = ({ newsItem, onDelete }) => {
  const truncateTitle = (title) =>
    title.length > 50 ? `${title.substring(0, 50)}...` : title;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <tr>
      <td className="align-middle">{truncateTitle(newsItem.title)}</td>
      <td className="align-middle">{formatDate(newsItem.updatedAt)}</td>
      <td className="align-middle">
        {newsItem.user ? newsItem.user.name : "Unknown Author"}
      </td>
      <td className="align-middle">
        {newsItem.isPublished ? (
          <FaCheck className="text-success" />
        ) : (
          <FaTimes className="text-danger" />
        )}
      </td>
      <td className="align-middle">
        <div className="d-flex justify-content-center gap-2">
          <LinkContainer to={`/admin/news/${newsItem._id}/edit`}>
            <Button variant="outline-primary" size="sm">
              <FaEdit className="me-1" /> Edit
            </Button>
          </LinkContainer>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(newsItem._id)}
          >
            <FaTrash className="me-1" /> Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

NewsTableRow.propTypes = {
  newsItem: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    isPublished: PropTypes.bool.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const NewsListScreen = () => {
  const { data: news, refetch, isLoading, error } = useGetAllNewsQuery();
  const [deleteNews, { isLoading: loadingDelete }] = useDeleteNewsMutation();

  const [filters, setFilters] = useState({
    title: "",
    author: "",
    published: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
      try {
        await deleteNews(id);
        toast.success("News deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredNews = useMemo(() => {
    if (!news) return [];

    return news.filter(
      (newsItem) =>
        newsItem.title.toLowerCase().includes(filters.title.toLowerCase()) &&
        (newsItem.user?.name
          .toLowerCase()
          .includes(filters.author.toLowerCase()) ||
          "Unknown Author"
            .toLowerCase()
            .includes(filters.author.toLowerCase())) &&
        (filters.published === "" ||
          (filters.published === "yes" && newsItem.isPublished) ||
          (filters.published === "no" && !newsItem.isPublished))
    );
  }, [news, filters]);

  if (isLoading || loadingDelete) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading news"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">News Management</h1>
          </Col>
          <Col xs="auto">
            <Link to="/admin/news/create" className="btn btn-primary">
              <FaPlus className="me-1" /> Create Post
            </Link>
          </Col>
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        <div className="table-responsive">
          <Table hover className="align-middle bg-white shadow-sm rounded">
            <thead className="bg-light">
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Author</th>
                <th>Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((newsItem) => (
                <NewsTableRow
                  key={newsItem._id}
                  newsItem={newsItem}
                  onDelete={deleteHandler}
                />
              ))}
              {filteredNews.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No news posts found
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

export default NewsListScreen;
