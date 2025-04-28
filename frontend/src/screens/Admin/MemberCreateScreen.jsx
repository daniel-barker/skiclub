import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import {
  FaArrowLeft,
  FaImage,
  FaUser,
  FaSave,
  FaPlus,
  FaTrash,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import {
  useCreateUnitMutation,
  useUploadUnitImageMutation,
} from "../../slices/unitApiSlice";
import ErrorBoundary from "../../components/ErrorBoundary";
import MemberImageCropper from "../../components/MemberImageCropper";

// Member Form Component
const MemberForm = ({ member, index, onChange, onRemove, isFirst, errors }) => {
  const handlePhoneChange = (e, phoneIndex = 0) => {
    let value = e.target.value;
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Format the phone number
    if (digits.length <= 10) {
      value = digits.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, (_, p1, p2, p3) => {
        if (p1 && p2 && p3) return `(${p1})${p2}-${p3}`;
        if (p1 && p2) return `(${p1})${p2}`;
        if (p1) return `(${p1}`;
        return "";
      });

      onChange(index, phoneIndex === 0 ? "phone1" : "phone2", value);
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FaUser className="me-2" />
            {isFirst ? "Primary Member" : `Additional Member ${index}`}
          </h4>
          {!isFirst && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <FaTrash className="me-1" /> Remove Member
            </Button>
          )}
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={member.firstName}
                onChange={(e) => onChange(index, "firstName", e.target.value)}
                required
                isInvalid={!!errors[`member${index}FirstName`]}
                name={`member${index}FirstName`}
                id={`member${index}FirstName`}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}FirstName`] || "First name is required"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={member.lastName}
                onChange={(e) => onChange(index, "lastName", e.target.value)}
                required
                isInvalid={!!errors[`member${index}LastName`]}
                name={`member${index}LastName`}
                id={`member${index}LastName`}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}LastName`] || "Last name is required"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={member.email}
                onChange={(e) => onChange(index, "email", e.target.value)}
                isInvalid={
                  !!errors[`member${index}Email`] ||
                  (member.email &&
                    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      member.email
                    ))
                }
                isValid={
                  member.email &&
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                    member.email
                  )
                }
                name={`member${index}Email`}
                id={`member${index}Email`}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}Email`] ||
                  "Please enter a valid email address"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Primary Phone</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="tel"
                  value={member.phoneNumber[0]?.number || ""}
                  onChange={(e) => handlePhoneChange(e)}
                  placeholder="(XXX) XXX-XXXX"
                  isInvalid={!!errors[`member${index}Phone1`]}
                  name={`member${index}Phone1`}
                  id={`member${index}Phone1`}
                  pattern="\(\d{3}\)(?: )?\d{3}-\d{4}"
                />
                <Form.Select
                  value={member.phoneNumber[0]?.type || "Cell"}
                  onChange={(e) =>
                    onChange(index, "phoneType1", e.target.value)
                  }
                  style={{ width: "auto" }}
                >
                  <option value="Cell">Cell</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </Form.Select>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}Phone1`] ||
                  "Please enter a valid phone number: (XXX)XXX-XXXX"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Member Since (Year)</Form.Label>
              <Form.Control
                type="number"
                value={member.memberSince}
                onChange={(e) => onChange(index, "memberSince", e.target.value)}
                min={1900}
                max={new Date().getFullYear()}
                isInvalid={!!errors[`member${index}MemberSince`]}
                name={`member${index}MemberSince`}
                id={`member${index}MemberSince`}
                pattern="\d{4}"
              />
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}MemberSince`] ||
                  `Year must be between 1900 and ${new Date().getFullYear()}`}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Secondary Phone</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="tel"
                  value={member.phoneNumber[1]?.number || ""}
                  onChange={(e) => handlePhoneChange(e, 1)}
                  placeholder="(XXX)XXX-XXXX"
                  isInvalid={!!errors[`member${index}Phone2`]}
                  name={`member${index}Phone2`}
                  id={`member${index}Phone2`}
                  pattern="\(\d{3}\)\d{3}-\d{4}"
                />
                <Form.Select
                  value={member.phoneNumber[1]?.type || "Home"}
                  onChange={(e) =>
                    onChange(index, "phoneType2", e.target.value)
                  }
                  style={{ width: "auto" }}
                >
                  <option value="Cell">Cell</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                </Form.Select>
              </div>
              <Form.Control.Feedback type="invalid">
                {errors[`member${index}Phone2`] ||
                  "Please enter a valid phone number: (XXX)XXX-XXXX"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Honorary Member"
                checked={member.honorary}
                onChange={(e) => onChange(index, "honorary", e.target.checked)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

MemberForm.propTypes = {
  member: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    honorary: PropTypes.bool,
    memberSince: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

// Address Form Component
const AddressForm = ({
  address,
  index,
  onChange,
  onRemove,
  isFirst,
  errors,
}) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <FaMapMarkerAlt className="me-2" />
            {isFirst ? "Primary Address" : `Additional Address ${index}`}
          </h4>
          {!isFirst && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onRemove(index)}
            >
              <FaTrash className="me-1" /> Remove Address
            </Button>
          )}
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Street Address</Form.Label>
          <Form.Control
            type="text"
            value={address.street}
            onChange={(e) => onChange(index, "street", e.target.value)}
            required
            isInvalid={!!errors[`address${index}Street`]}
            name={`address${index}Street`}
            id={`address${index}Street`}
          />
          <Form.Control.Feedback type="invalid">
            {errors[`address${index}Street`] || "Street address is required"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Street Address Line 2</Form.Label>
          <Form.Control
            type="text"
            value={address.street2 || ""}
            onChange={(e) => onChange(index, "street2", e.target.value)}
            name={`address${index}Street2`}
            id={`address${index}Street2`}
            placeholder="Apt, Suite, Unit, etc. (optional)"
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={address.city}
                onChange={(e) => onChange(index, "city", e.target.value)}
                required
                isInvalid={!!errors[`address${index}City`]}
                name={`address${index}City`}
                id={`address${index}City`}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`address${index}City`] || "City is required"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Select
                value={address.state}
                onChange={(e) => onChange(index, "state", e.target.value)}
                required
                isInvalid={!!errors[`address${index}State`]}
                name={`address${index}State`}
                id={`address${index}State`}
              >
                <option value="">Select a state</option>
                <option value="AL">Alabama (AL)</option>
                <option value="AK">Alaska (AK)</option>
                <option value="AZ">Arizona (AZ)</option>
                <option value="AR">Arkansas (AR)</option>
                <option value="CA">California (CA)</option>
                <option value="CO">Colorado (CO)</option>
                <option value="CT">Connecticut (CT)</option>
                <option value="DE">Delaware (DE)</option>
                <option value="DC">District Of Columbia (DC)</option>
                <option value="FL">Florida (FL)</option>
                <option value="GA">Georgia (GA)</option>
                <option value="HI">Hawaii (HI)</option>
                <option value="ID">Idaho (ID)</option>
                <option value="IL">Illinois (IL)</option>
                <option value="IN">Indiana (IN)</option>
                <option value="IA">Iowa (IA)</option>
                <option value="KS">Kansas (KS)</option>
                <option value="KY">Kentucky (KY)</option>
                <option value="LA">Louisiana (LA)</option>
                <option value="ME">Maine (ME)</option>
                <option value="MD">Maryland (MD)</option>
                <option value="MA">Massachusetts (MA)</option>
                <option value="MI">Michigan (MI)</option>
                <option value="MN">Minnesota (MN)</option>
                <option value="MS">Mississippi (MS)</option>
                <option value="MO">Missouri (MO)</option>
                <option value="MT">Montana (MT)</option>
                <option value="NE">Nebraska (NE)</option>
                <option value="NV">Nevada (NV)</option>
                <option value="NH">New Hampshire (NH)</option>
                <option value="NJ">New Jersey (NJ)</option>
                <option value="NM">New Mexico (NM)</option>
                <option value="NY">New York (NY)</option>
                <option value="NC">North Carolina (NC)</option>
                <option value="ND">North Dakota (ND)</option>
                <option value="OH">Ohio (OH)</option>
                <option value="OK">Oklahoma (OK)</option>
                <option value="OR">Oregon (OR)</option>
                <option value="PA">Pennsylvania (PA)</option>
                <option value="RI">Rhode Island (RI)</option>
                <option value="SC">South Carolina (SC)</option>
                <option value="SD">South Dakota (SD)</option>
                <option value="TN">Tennessee (TN)</option>
                <option value="TX">Texas (TX)</option>
                <option value="UT">Utah (UT)</option>
                <option value="VT">Vermont (VT)</option>
                <option value="VA">Virginia (VA)</option>
                <option value="WA">Washington (WA)</option>
                <option value="WV">West Virginia (WV)</option>
                <option value="WI">Wisconsin (WI)</option>
                <option value="WY">Wyoming (WY)</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors[`address${index}State`] || "Please select a state"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>ZIP Code</Form.Label>
              <Form.Control
                type="text"
                value={address.zip}
                onChange={(e) => onChange(index, "zip", e.target.value)}
                required
                isInvalid={!!errors[`address${index}Zip`]}
                pattern="^\d{5}(-\d{4})?$"
                placeholder="12345"
                name={`address${index}Zip`}
                id={`address${index}Zip`}
              />
              <Form.Control.Feedback type="invalid">
                {errors[`address${index}Zip`] || "Valid ZIP code required"}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

AddressForm.propTypes = {
  address: PropTypes.shape({
    street: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
    addressType: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

const MemberCreateScreen = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([
    {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: [
        { number: "", type: "Cell" },
        { number: "", type: "Home" },
      ],
      honorary: false,
      memberSince: "",
    },
  ]);
  const [addresses, setAddresses] = useState([
    {
      street: "",
      city: "",
      state: "",
      zip: "",
      addressType: "Primary",
    },
  ]);
  const [imageData, setImageData] = useState(null);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  const [createUnit, { isLoading: loadingCreate }] = useCreateUnitMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadUnitImageMutation();

  const validateForm = () => {
    const newErrors = {};

    // Validate members
    members.forEach((member, index) => {
      if (!member.firstName?.trim()) {
        newErrors[`member${index}FirstName`] = "First name is required";
      }

      if (!member.lastName?.trim()) {
        newErrors[`member${index}LastName`] = "Last name is required";
      }

      if (member.email?.trim() && 
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(member.email)
      ) {
        newErrors[`member${index}Email`] = "Invalid email format";
      }

      if (member.memberSince) {
        const year = parseInt(member.memberSince);
        if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
          newErrors[
            `member${index}MemberSince`
          ] = `Year must be between 1900 and ${new Date().getFullYear()}`;
        }
      }
    });

    // Validate addresses
    addresses.forEach((address, index) => {
      if (!address.street?.trim()) {
        newErrors[`address${index}Street`] = "Street is required";
      }

      if (!address.city?.trim()) {
        newErrors[`address${index}City`] = "City is required";
      }

      if (!address.state?.trim()) {
        newErrors[`address${index}State`] = "State is required";
      } else if (!/^[A-Z]{2}$/.test(address.state)) {
        newErrors[`address${index}State`] = "Must be 2 letters (e.g., NY)";
      }

      if (!address.zip?.trim()) {
        newErrors[`address${index}Zip`] = "ZIP code is required";
      } else if (!/^\d{5}$/.test(address.zip)) {
        newErrors[`address${index}Zip`] = "ZIP code must be 5 digits";
      }
    });

    return newErrors;
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members];
    if (field === "phone1") {
      if (!newMembers[index].phoneNumber[0]) {
        newMembers[index].phoneNumber[0] = { number: "", type: "Cell" };
      }
      newMembers[index].phoneNumber[0].number = value;
    } else if (field === "phone2") {
      if (!newMembers[index].phoneNumber[1]) {
        newMembers[index].phoneNumber[1] = { number: "", type: "Home" };
      }
      newMembers[index].phoneNumber[1].number = value;
    } else if (field === "phoneType1") {
      if (!newMembers[index].phoneNumber[0]) {
        newMembers[index].phoneNumber[0] = { number: "", type: value };
      } else {
        newMembers[index].phoneNumber[0].type = value;
      }
    } else if (field === "phoneType2") {
      if (!newMembers[index].phoneNumber[1]) {
        newMembers[index].phoneNumber[1] = { number: "", type: value };
      } else {
        newMembers[index].phoneNumber[1].type = value;
      }
    } else {
      newMembers[index] = { ...newMembers[index], [field]: value };
    }
    setMembers(newMembers);

    // Clear specific error when field changes
    if (
      errors[`member${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]
    ) {
      setErrors((prev) => ({
        ...prev,
        [`member${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]: "",
      }));
    }
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = { ...newAddresses[index], [field]: value };
    setAddresses(newAddresses);

    // Clear specific error when field changes
    if (
      errors[`address${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]
    ) {
      setErrors((prev) => ({
        ...prev,
        [`address${index}${field.charAt(0).toUpperCase() + field.slice(1)}`]:
          "",
      }));
    }

    // Real-time validation for state field
    if (field === "state" && value) {
      if (!/^[A-Z]{2}$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [`address${index}State`]: "Must be 2 letters (e.g., NY)",
        }));
      }
    }
  };

  const handleAddMember = () => {
    setMembers([
      ...members,
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: [
          { number: "", type: "Cell" },
          { number: "", type: "Home" },
        ],
        honorary: false,
        memberSince: "",
      },
    ]);
  };

  const handleAddAddress = () => {
    setAddresses([
      ...addresses,
      {
        street: "",
        city: "",
        state: "",
        zip: "",
        addressType: "Secondary",
      },
    ]);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleRemoveAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleCropComplete = (data) => {
    setImageData(data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Activate Bootstrap's form validation display
    setValidated(true);

    // Run validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        let unitData = {
          members: members.map((member) => ({
            ...member,
            phoneNumber:
              member.phoneNumber[0]?.number?.trim() ||
              member.phoneNumber[1]?.number?.trim()
                ? member.phoneNumber.filter((phone) => phone?.number?.trim())
                : [],
          })),
          addresses,
          image: "uploads/no_image.jpg",
          thumbnail: "uploads/no_image.jpg",
        };

        if (imageData?.file) {
          const formData = new FormData();
          formData.append("image", imageData.file);
          if (imageData.cropData) {
            formData.append("crop", JSON.stringify(imageData.cropData));
          }
          const uploadResult = await uploadImage(formData).unwrap();
          unitData.image = uploadResult.image;
          unitData.thumbnail = uploadResult.thumbnail;
        }

        await createUnit(unitData).unwrap();
        toast.success("Member unit created successfully");
        navigate("/admin/members/list");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to create member unit");
      }
    } else {
      setErrors(validationErrors);
      toast.error("Please correct the validation errors");

      // Find first error and focus it
      const firstErrorKey = Object.keys(validationErrors)[0];
      const firstErrorElement = document.querySelector(
        `[name="${firstErrorKey}"], [id="${firstErrorKey}"]`
      );
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        firstErrorElement.focus();
      }
    }
  };

  if (loadingCreate || loadingUpload) return <Loader />;

  return (
    <ErrorBoundary>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h1 className="mb-0">Create Member Unit</h1>
                  <Link
                    to="/admin/members/list"
                    className="btn btn-outline-secondary"
                  >
                    <FaArrowLeft className="me-1" /> Back to Members
                  </Link>
                </div>

                <Form onSubmit={submitHandler} noValidate validated={validated}>
                  <section className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3>Members</h3>
                      <Button
                        variant="outline-primary"
                        onClick={handleAddMember}
                      >
                        <FaPlus className="me-1" /> Add Member
                      </Button>
                    </div>
                    {members.map((member, index) => (
                      <MemberForm
                        key={index}
                        member={member}
                        index={index}
                        onChange={handleMemberChange}
                        onRemove={handleRemoveMember}
                        isFirst={index === 0}
                        errors={errors}
                      />
                    ))}
                  </section>

                  <section className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3>Addresses</h3>
                      <Button
                        variant="outline-primary"
                        onClick={handleAddAddress}
                      >
                        <FaPlus className="me-1" /> Add Address
                      </Button>
                    </div>
                    {addresses.map((address, index) => (
                      <AddressForm
                        key={index}
                        address={address}
                        index={index}
                        onChange={handleAddressChange}
                        onRemove={handleRemoveAddress}
                        isFirst={index === 0}
                        errors={errors}
                      />
                    ))}
                  </section>

                  <section className="mb-4">
                    <Card className="shadow-sm">
                      <Card.Body>
                        <h3>Profile Image</h3>
                        <Form.Group>
                          <Form.Label>
                            <FaImage className="me-2" />
                            Add Image (Optional)
                          </Form.Label>
                          <MemberImageCropper
                            onCropComplete={handleCropComplete}
                          />
                          <Form.Text className="text-muted">
                            Maximum size: 10MB. Supported formats: JPEG, PNG,
                            GIF, TIFF, BMP, HEIC/HEIF, and various RAW formats
                          </Form.Text>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </section>

                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      as={Link}
                      to="/admin/members/list"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                      <FaSave className="me-1" /> Create Member Unit
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  );
};

export default MemberCreateScreen;
