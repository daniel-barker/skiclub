import { useState, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import {
  FaSearch,
  FaEnvelope,
  FaTimes,
  FaPhone,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import PropTypes from "prop-types";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useGetAllUnitsQuery } from "../slices/unitApiSlice";
import ErrorBoundary from "../components/ErrorBoundary";
import "./MemberDirectory.css";

// Custom hook for filtering and pagination
const useFilteredPagination = (
  items,
  initialItemsPerPage = 25,
  pageRange = 5
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
  });

  const filteredItems = useMemo(() => {
    return items?.filter((unit) =>
      unit.members.some(
        (member) =>
          `${member.firstName ?? ""} ${member.lastName ?? ""}`
            .toLowerCase()
            .includes(filters.name.toLowerCase()) &&
          (member.email ?? "")
            .toLowerCase()
            .includes(filters.email.toLowerCase())
      )
    );
  }, [items, filters]);

  const totalPages = useMemo(
    () => (filteredItems ? Math.ceil(filteredItems.length / itemsPerPage) : 1),
    [filteredItems, itemsPerPage]
  );

  const currentItems = useMemo(() => {
    if (itemsPerPage === -1) return filteredItems; // Return all items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when items per page changes
  }, []);

  // Calculate pagination range
  const { startPage, endPage } = useMemo(() => {
    const start = Math.max(1, currentPage - Math.floor(pageRange / 2));
    const end = Math.min(totalPages, start + pageRange - 1);
    return { startPage: start, endPage: end };
  }, [currentPage, totalPages, pageRange]);

  return {
    currentItems,
    currentPage,
    totalPages,
    startPage,
    endPage,
    filters,
    itemsPerPage,
    handlePageChange,
    handleFilterChange,
    handleItemsPerPageChange,
  };
};

// Image Modal Component
const ImageModal = ({ show, onHide, image }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Body className="p-0">
      <Button
        variant="light"
        onClick={onHide}
        className="position-absolute top-0 end-0 m-2 rounded-circle"
        style={{
          fontSize: "1.5rem",
          background: "rgba(0, 0, 0, 0.5)",
          color: "#fff",
          border: "none",
          width: "40px",
          height: "40px",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        &times;
      </Button>
      <img
        src={image}
        alt="Enlarged"
        className="img-fluid rounded-3"
        style={{ width: "100%", height: "auto", objectFit: "contain" }}
      />
    </Modal.Body>
  </Modal>
);

ImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  image: PropTypes.string,
};

// Filter Controls Component
const FilterControls = ({ filters, onFilterChange }) => (
  <Card className="shadow-sm mb-4">
    <Card.Body>
      <Row className="g-3">
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => onFilterChange("name", e.target.value)}
            />
            {filters.name && (
              <Button
                variant="outline-secondary"
                onClick={() => onFilterChange("name", "")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => onFilterChange("email", e.target.value)}
            />
            {filters.email && (
              <Button
                variant="outline-secondary"
                onClick={() => onFilterChange("email", "")}
              >
                <FaTimes />
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

// Member Info Component
const MemberInfo = ({ member }) => (
  <div className="mb-3">
    <h4 className="fw-bold d-flex align-items-center">
      {member.firstName} {member.lastName}
      {member.honorary && (
        <FaStar className="ms-2 text-warning" title="Honorary Member" />
      )}
    </h4>
    <div className="text-muted mb-2">
      <FaEnvelope className="me-2" />
      {member.email || "N/A"}
    </div>
    {member.phoneNumber.map((phone) => (
      <div key={phone._id} className="text-muted mb-1">
        <FaPhone className="me-2" />
        {phone.type}: {phone.number}
      </div>
    ))}
    {member.memberSince && (
      <div className="text-muted small mt-2">
        <FaUsers className="me-2" />
        Member Since: {member.memberSince}
      </div>
    )}
  </div>
);

MemberInfo.propTypes = {
  member: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    honorary: PropTypes.bool,
    email: PropTypes.string,
    phoneNumber: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        number: PropTypes.string,
      })
    ),
    memberSince: PropTypes.number,
  }).isRequired,
};

// Address Info Component
const AddressInfo = ({ address }) => (
  <div className="mb-3">
    <h5 className="fw-bold d-flex align-items-center">
      <FaMapMarkerAlt className="me-2" />
      {address.addressType} Address
    </h5>
    <div className="text-muted ms-4">
      <p className="mb-1">{address.street}</p>
      {address.street2 && <p className="mb-1">{address.street2}</p>}
      <p className="mb-1">{`${address.city}, ${address.state} ${address.zip}`}</p>
    </div>
  </div>
);

AddressInfo.propTypes = {
  address: PropTypes.shape({
    addressType: PropTypes.string,
    street: PropTypes.string,
    street2: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
  }).isRequired,
};

// Member Card Component
const MemberCard = ({ unit, onImageClick }) => (
  <Card className="member-card mb-4 shadow-sm hover-shadow">
    <Card.Body className="p-4">
      <Row className="g-4">
        <Col md={4} className="d-flex justify-content-center align-items-start">
          <div className="text-center">
            <div className="image-container position-relative">
              <img
                src={unit.thumbnail}
                alt="Member"
                className="rounded-3 img-hover-zoom"
                style={{
                  width: "100%",
                  height: "230px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => onImageClick(unit.image)}
              />
            </div>
          </div>
        </Col>
        <Col md={8}>
          <Row>
            <Col md={6}>
              {unit.members.map((member) => (
                <MemberInfo key={member._id} member={member} />
              ))}
            </Col>
            <Col md={6}>
              {unit.addresses.map((address) => (
                <AddressInfo key={address._id} address={address} />
              ))}
            </Col>
          </Row>
          {unit.bio && (
            <>
              <hr className="my-3" />
              <p className="text-center fst-italic mb-0">{unit.bio}</p>
            </>
          )}
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

MemberCard.propTypes = {
  unit: PropTypes.shape({
    _id: PropTypes.string,
    thumbnail: PropTypes.string,
    image: PropTypes.string,
    members: PropTypes.array,
    addresses: PropTypes.array,
    bio: PropTypes.string,
  }).isRequired,
  onImageClick: PropTypes.func.isRequired,
};

// Pagination Controls Component
const PaginationControls = ({
  currentPage,
  totalPages,
  startPage,
  endPage,
  onPageChange,
}) => (
  <div className="d-flex justify-content-center mb-4">
    <div className="pagination-container">
      <Button
        variant="outline-primary"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="mx-1 rounded-circle"
      >
        {"<<"}
      </Button>
      <Button
        variant="outline-primary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mx-1 rounded-circle"
      >
        {"<"}
      </Button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const pageNumber = startPage + index;
        return (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "primary" : "outline-primary"}
            onClick={() => onPageChange(pageNumber)}
            className="mx-1 rounded-circle"
          >
            {pageNumber}
          </Button>
        );
      })}
      <Button
        variant="outline-primary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="mx-1 rounded-circle"
      >
        {">"}
      </Button>
      <Button
        variant="outline-primary"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="mx-1 rounded-circle"
      >
        {">>"}
      </Button>
    </div>
  </div>
);

PaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  startPage: PropTypes.number.isRequired,
  endPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

// Page Size Selector Component
const PageSizeSelector = ({ value, onChange, totalItems }) => (
  <div className="d-flex align-items-center gap-2">
    <span className="text-muted">Show:</span>
    <Form.Select
      size="sm"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{ width: "auto" }}
    >
      <option value="5">5</option>
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="100">100</option>
      <option value="-1">All ({totalItems})</option>
    </Form.Select>
  </div>
);

PageSizeSelector.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  totalItems: PropTypes.number,
};

const MemberDirectory = () => {
  const { data: units, isLoading, error } = useGetAllUnitsQuery();
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const {
    currentItems,
    currentPage,
    totalPages,
    startPage,
    endPage,
    filters,
    itemsPerPage,
    handlePageChange,
    handleFilterChange,
    handleItemsPerPageChange,
  } = useFilteredPagination(units);

  const handleImageClick = useCallback((image) => {
    setModalImage(image);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Failed to fetch members"}
      </Message>
    );

  return (
    <ErrorBoundary>
      <Container className="my-4">
        <Row className="align-items-center mb-4">
          <Col className="text-center">
            <h1 className="display-5 fw-bold mb-2">Member Directory</h1>
            <p className="text-muted lead">
              Connect with your fellow club members
            </p>
          </Col>
          <hr className="my-3" />
        </Row>

        <FilterControls filters={filters} onFilterChange={handleFilterChange} />

        {currentItems?.length === 0 ? (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <FaUsers size={48} className="text-muted mb-3" />
              <h4>No Members Found</h4>
              <p className="text-muted">
                Try adjusting your search criteria to find members
              </p>
            </Card.Body>
          </Card>
        ) : (
          <>
            <div className="d-flex justify-content-end mb-3">
              <PageSizeSelector
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                totalItems={units?.length}
              />
            </div>

            {currentItems?.map((unit) => (
              <MemberCard
                key={unit._id}
                unit={unit}
                onImageClick={handleImageClick}
              />
            ))}

            <div className="text-center mb-4">
              <p className="text-muted small">
                <FaStar className="text-warning me-1" />
                Indicates honorary membership
              </p>
            </div>

            {itemsPerPage !== -1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                startPage={startPage}
                endPage={endPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <ImageModal
          show={showModal}
          onHide={handleCloseModal}
          image={modalImage}
        />
      </Container>
    </ErrorBoundary>
  );
};

export default MemberDirectory;
