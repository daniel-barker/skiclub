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
  Badge,
} from "react-bootstrap";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useGetAllUnitsQuery,
  useDeleteUnitMutation,
} from "../../slices/unitApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Row className="my-3 g-3">
    <Col md={6}>
      <Form.Group>
        <Form.Label>
          <FaUser className="me-2" />
          Member Name
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by Member Name"
          value={filters.member}
          onChange={(e) => onFilterChange("member", e.target.value)}
        />
      </Form.Group>
    </Col>
    <Col md={6}>
      <Form.Group>
        <Form.Label>
          <FaEnvelope className="me-2" />
          Email Address
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => onFilterChange("email", e.target.value)}
        />
      </Form.Group>
    </Col>
  </Row>
);

FilterControls.propTypes = {
  filters: PropTypes.shape({
    member: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// Member Info Component
const MemberInfo = ({ member }) => (
  <div className="mb-2">
    <div className="d-flex align-items-center">
      <span className="fw-bold">
        {member.firstName} {member.lastName}
      </span>
      {member.honorary && (
        <Badge bg="secondary" className="ms-2">
          Honorary
        </Badge>
      )}
    </div>
    <div className="text-muted small">
      {member.email && (
        <div>
          <FaEnvelope className="me-1" /> {member.email}
        </div>
      )}
      {member.phoneNumber.map((phone, index) => (
        <div key={index}>
          <FaPhone className="me-1" /> {phone.type}: {phone.number}
        </div>
      ))}
    </div>
  </div>
);

MemberInfo.propTypes = {
  member: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    honorary: PropTypes.bool,
    email: PropTypes.string,
    phoneNumber: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

// Address Info Component
const AddressInfo = ({ address }) => (
  <div className="mb-2">
    <div className="text-muted small">
      <FaMapMarkerAlt className="me-1" />
      {address.addressType === "Primary" ? "Primary: " : "Secondary: "}
      {address.street}
      {address.street2 && <>, {address.street2}</>}
      {`, ${address.city}, ${address.state} ${address.zip}`}
    </div>
  </div>
);

AddressInfo.propTypes = {
  address: PropTypes.shape({
    addressType: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    street2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
  }).isRequired,
};

const MemberListScreen = () => {
  const { data: units, refetch, isLoading, error } = useGetAllUnitsQuery();
  const [deleteUnit, { isLoading: isDeleting }] = useDeleteUnitMutation();

  const [filters, setFilters] = useState({
    member: "",
    email: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this member unit?")) {
      try {
        await deleteUnit(id).unwrap();
        toast.success("Member unit deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const filteredUnits = useMemo(() => {
    if (!units) return [];

    return units.filter(
      (unit) =>
        unit.members.some(
          (member) =>
            member.firstName
              .toLowerCase()
              .includes(filters.member.toLowerCase()) ||
            member.lastName.toLowerCase().includes(filters.member.toLowerCase())
        ) &&
        unit.members.some((member) =>
          member.email?.toLowerCase().includes(filters.email.toLowerCase())
        )
    );
  }, [units, filters]);

  if (isLoading || isDeleting) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to fetch members"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="align-items-center mb-4">
          <Col>
            <h1 className="mb-0">Membership Directory</h1>
          </Col>
          <Col xs="auto">
            <Link to="/admin/members/create" className="btn btn-primary">
              <FaPlus className="me-1" /> Add Member
            </Link>
          </Col>
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        <div className="table-responsive">
          <Table hover className="align-middle bg-white shadow-sm rounded">
            <thead className="bg-light">
              <tr>
                <th style={{ width: "30%" }}>Members</th>
                <th style={{ width: "30%" }}>Contact Info</th>
                <th style={{ width: "25%" }}>Addresses</th>
                <th style={{ width: "15%" }} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map((unit) => (
                <tr key={unit._id}>
                  <td>
                    {unit.members.map((member, index) => (
                      <MemberInfo key={index} member={member} />
                    ))}
                  </td>
                  <td>
                    {unit.members.map((member, index) => (
                      <div key={index} className="mb-3">
                        {member.phoneNumber.map((phone, phoneIndex) => (
                          <div key={phoneIndex} className="text-muted small">
                            <FaPhone className="me-1" />
                            {phone.type}: {phone.number}
                          </div>
                        ))}
                      </div>
                    ))}
                  </td>
                  <td>
                    {unit.addresses.map((address, index) => (
                      <AddressInfo key={index} address={address} />
                    ))}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <LinkContainer to={`/admin/members/${unit._id}/edit`}>
                        <Button variant="outline-primary" size="sm">
                          <FaEdit className="me-1" /> Edit
                        </Button>
                      </LinkContainer>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => deleteHandler(unit._id)}
                      >
                        <FaTrash className="me-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUnits.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <FaUser size={48} className="text-muted mb-3" />
                    <h4 className="text-muted">No members found</h4>
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

export default MemberListScreen;
