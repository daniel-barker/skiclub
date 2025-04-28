import { useState, useMemo } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Card,
} from "react-bootstrap";
import {
  FaTrash,
  FaTimes,
  FaEdit,
  FaCheck,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by name"
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by email"
          value={filters.email}
          onChange={(e) => onFilterChange("email", e.target.value)}
        />
      </Form.Group>
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Status Badge Component
const StatusBadge = ({ isActive, label }) => (
  <span
    className={`badge ${
      isActive ? "bg-success" : "bg-danger"
    } d-inline-flex align-items-center gap-1`}
    style={{ width: "80px", justifyContent: "center", padding: "6px 8px" }}
  >
    {isActive ? <FaCheck size={12} /> : <FaTimes size={12} />}
    {label}
  </span>
);

StatusBadge.propTypes = {
  isActive: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [filters, setFilters] = useState({
    name: "",
    email: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase())
    );
  }, [users, filters]);

  if (isLoading || loadingDelete) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Error loading users"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">User Management</h1>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Body>
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>

                    <th className="text-center">Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaUser className="text-primary me-2" />
                          {user.name}
                        </div>
                      </td>
                      <td>
                        <a
                          href={`mailto:${user.email}`}
                          className="text-decoration-none"
                        >
                          {user.email}
                        </a>
                      </td>

                      <td className="text-center">
                        <StatusBadge
                          isActive={user.isApproved}
                          label={user.isApproved ? "Active" : "Pending"}
                        />
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <LinkContainer to={`/admin/user/${user._id}/edit`}>
                            <Button variant="outline-primary" size="sm">
                              <FaEdit className="me-1" /> Edit
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <FaUser size={48} className="text-muted mb-3" />
                        <h4 className="text-muted">No users found</h4>
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

export default UserListScreen;
