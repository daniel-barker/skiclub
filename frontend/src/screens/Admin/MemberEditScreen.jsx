import { useState, useEffect } from "react";
import MemberImageCropper from "../../components/MemberImageCropper";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image,
  Card,
} from "react-bootstrap";
import {
  FaPlus,
  FaUser,
  FaTrash,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaImage,
  FaSave,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import {
  useGetUnitByIdQuery,
  useUpdateUnitMutation,
  useUploadUnitImageMutation,
} from "../../slices/unitApiSlice";

const MemberEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [members, setMembers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);

  // Image handling
  const [imageData, setImageData] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [originalImage, setOriginalImage] = useState("");

  // API calls
  const { data: unit, isLoading, error } = useGetUnitByIdQuery(id);
  const [updateUnit, { isLoading: loadingUpdate }] = useUpdateUnitMutation();
  const [uploadImage, { isLoading: loadingUpload }] =
    useUploadUnitImageMutation();

  // Initialize form with data when unit loads
  useEffect(() => {
    if (unit) {
      // Create new objects to ensure they're mutable
      const initialMembers =
        unit.members?.map((member) => ({
          ...member,
          phoneNumber: member.phoneNumber?.map((phone) => ({ ...phone })) || [
            { number: "", type: "Home" },
          ],
          honorary: Boolean(member.honorary),
          memberSince: member.memberSince || "",
        })) || [];

      const initialAddresses =
        unit.addresses?.map((address) => ({
          ...address,
          street: address.street || "",
          city: address.city || "",
          state: address.state || "",
          zip: address.zip || "",
        })) || [];

      setMembers(initialMembers);
      setAddresses(initialAddresses);
      setBio(unit.bio || "");
      setOriginalImage(unit.image || "");
    }
  }, [unit]);

  // Member handlers
  const addMember = () => {
    setMembers([
      ...members,
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: [{ number: "", type: "Home" }],
        honorary: false,
        memberSince: "",
      },
    ]);
  };

  const removeMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const updateMember = (index, field, value) => {
    setMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      newMembers[index] = {
        ...newMembers[index],
        [field]: value,
      };
      return newMembers;
    });
  };

  // Address handlers
  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        addressType: "Secondary",
        street: "",
        city: "",
        state: "",
        zip: "",
      },
    ]);
  };

  const removeAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };

  const updateAddress = (index, field, value) => {
    setAddresses((prevAddresses) => {
      const newAddresses = [...prevAddresses];
      newAddresses[index] = {
        ...newAddresses[index],
        [field]: value,
      };
      return newAddresses;
    });
  };

  const removePhoneNumber = (memberIndex, phoneIndex) => {
    const newMembers = [...members];
    newMembers[memberIndex].phoneNumber.splice(phoneIndex, 1);
    setMembers(newMembers);
  };

  const updatePhoneNumber = (memberIndex, phoneIndex, field, value) => {
    setMembers((prevMembers) => {
      const newMembers = [...prevMembers];
      if (!newMembers[memberIndex].phoneNumber) {
        newMembers[memberIndex].phoneNumber = [];
      }
      while (newMembers[memberIndex].phoneNumber.length <= phoneIndex) {
        newMembers[memberIndex].phoneNumber.push({ number: "", type: "Home" });
      }
      newMembers[memberIndex].phoneNumber[phoneIndex] = {
        ...newMembers[memberIndex].phoneNumber[phoneIndex],
        [field]: value,
      };
      return newMembers;
    });
  };

  // Image handler
  const handleCropComplete = (data) => {
    if (data) {
      setImageData(data);
    }
  };

  const handlePhoneChange = (memberIndex, phoneIndex, value) => {
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

      updatePhoneNumber(memberIndex, phoneIndex, "number", value);
    }
  };

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

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Activate Bootstrap's form validation display
    setValidated(true);

    // Run validation
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        // Create unit data object
        const updatedUnit = {
          id,
          members: members.map((member) => ({
            ...member,
            phoneNumber: member.phoneNumber
              .filter((phone) => phone && phone.number && phone.number.trim())
              .map((phone) => ({
                number: phone.number,
                type: phone.type || "Home",
              })),
          })),
          addresses,
          bio,
        };

        // Handle image upload if needed
        if (!removeImage && imageData?.file) {
          const imageFormData = new FormData();
          imageFormData.append("image", imageData.file);
          if (imageData?.cropData) {
            imageFormData.append("crop", JSON.stringify(imageData.cropData));
          }

          const uploadResult = await uploadImage(imageFormData).unwrap();
          if (uploadResult) {
            updatedUnit.image = uploadResult.image;
            updatedUnit.thumbnail = uploadResult.thumbnail;
          }
        } else if (!removeImage && originalImage) {
          updatedUnit.image = originalImage;
        }

        // Update the unit
        const result = await updateUnit(updatedUnit).unwrap();
        if (!result?.error) {
          toast.success("Member unit updated successfully");
          navigate("/admin/members/list");
        }
      } catch (err) {
        toast.error(err?.data?.message || err?.error || "An error occurred");
        console.error("Update error:", err);
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Edit Member Unit</h1>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate("/admin/members/list")}
                >
                  <FaArrowLeft className="me-1" /> Back to Members
                </Button>
              </div>

              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                {/* Members Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Member(s)</h3>
                    <Button onClick={addMember}>
                      <FaPlus className="me-1" /> Add Member
                    </Button>
                  </div>

                  {members.map((member, index) => (
                    <Card key={index} className="mb-4 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="mb-0">
                            <FaUser className="me-2" />
                            {index === 0
                              ? "Primary Member"
                              : `Additional Member ${index}`}
                          </h4>
                          {index > 0 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeMember(index)}
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
                                value={member.firstName || ""}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "firstName",
                                    e.target.value
                                  )
                                }
                                required
                                isInvalid={!!errors[`member${index}FirstName`]}
                                name={`member${index}FirstName`}
                                id={`member${index}FirstName`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[`member${index}FirstName`] ||
                                  "First name is required"}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={member.lastName || ""}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "lastName",
                                    e.target.value
                                  )
                                }
                                required
                                isInvalid={!!errors[`member${index}LastName`]}
                                name={`member${index}LastName`}
                                id={`member${index}LastName`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[`member${index}LastName`] ||
                                  "Last name is required"}
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
                                value={member.email || ""}
                                onChange={(e) =>
                                  updateMember(index, "email", e.target.value)
                                }
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
                                  value={member.phoneNumber?.[0]?.number || ""}
                                  onChange={(e) =>
                                    handlePhoneChange(index, 0, e.target.value)
                                  }
                                  placeholder="(XXX) XXX-XXXX"
                                  isInvalid={!!errors[`member${index}Phone1`]}
                                  name={`member${index}Phone1`}
                                  id={`member${index}Phone1`}
                                  pattern="\(\d{3}\)(?: )?\d{3}-\d{4}"
                                />
                                <Form.Select
                                  value={
                                    member.phoneNumber?.[0]?.type || "Cell"
                                  }
                                  onChange={(e) =>
                                    updatePhoneNumber(
                                      index,
                                      0,
                                      "type",
                                      e.target.value
                                    )
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
                                value={member.memberSince || ""}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "memberSince",
                                    e.target.value
                                  )
                                }
                                min={1900}
                                max={new Date().getFullYear()}
                                isInvalid={
                                  !!errors[`member${index}MemberSince`]
                                }
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
                                  value={member.phoneNumber?.[1]?.number || ""}
                                  onChange={(e) =>
                                    handlePhoneChange(index, 1, e.target.value)
                                  }
                                  placeholder="(XXX)XXX-XXXX"
                                  isInvalid={!!errors[`member${index}Phone2`]}
                                  name={`member${index}Phone2`}
                                  id={`member${index}Phone2`}
                                  pattern="\(\d{3}\)(?: )?\d{3}-\d{4}"
                                />
                                <Form.Select
                                  value={
                                    member.phoneNumber?.[1]?.type || "Home"
                                  }
                                  onChange={(e) =>
                                    updatePhoneNumber(
                                      index,
                                      1,
                                      "type",
                                      e.target.value
                                    )
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
                                checked={member.honorary || false}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "honorary",
                                    e.target.checked
                                  )
                                }
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>

                {/* Addresses Section */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>Addresses</h3>
                    <Button onClick={addAddress}>
                      <FaPlus className="me-1" /> Add Address
                    </Button>
                  </div>

                  {addresses.map((address, index) => (
                    <Card key={index} className="mb-4 shadow-sm">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="mb-0">
                            <FaMapMarkerAlt className="me-2" />
                            {index === 0
                              ? "Primary Address"
                              : `Additional Address ${index}`}
                          </h4>
                          {index > 0 && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeAddress(index)}
                            >
                              <FaTrash className="me-1" /> Remove Address
                            </Button>
                          )}
                        </div>

                        <Form.Group className="mb-3">
                          <Form.Label>Street Address</Form.Label>
                          <Form.Control
                            type="text"
                            value={address.street || ""}
                            onChange={(e) =>
                              updateAddress(index, "street", e.target.value)
                            }
                            required
                            isInvalid={!!errors[`address${index}Street`]}
                            name={`address${index}Street`}
                            id={`address${index}Street`}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors[`address${index}Street`] ||
                              "Street address is required"}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Street Address Line 2</Form.Label>
                          <Form.Control
                            type="text"
                            value={address.street2 || ""}
                            onChange={(e) =>
                              updateAddress(index, "street2", e.target.value)
                            }
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
                                value={address.city || ""}
                                onChange={(e) =>
                                  updateAddress(index, "city", e.target.value)
                                }
                                required
                                isInvalid={!!errors[`address${index}City`]}
                                name={`address${index}City`}
                                id={`address${index}City`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[`address${index}City`] ||
                                  "City is required"}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-3">
                              <Form.Label>State</Form.Label>
                              <Form.Select
                                value={address.state || ""}
                                onChange={(e) =>
                                  updateAddress(index, "state", e.target.value)
                                }
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
                                <option value="DC">
                                  District Of Columbia (DC)
                                </option>
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
                                {errors[`address${index}State`] ||
                                  "Please select a state"}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group className="mb-3">
                              <Form.Label>ZIP</Form.Label>
                              <Form.Control
                                type="text"
                                value={address.zip || ""}
                                onChange={(e) =>
                                  updateAddress(index, "zip", e.target.value)
                                }
                                required
                                isInvalid={!!errors[`address${index}Zip`]}
                                pattern="^\d{5}$"
                                placeholder="12345"
                                name={`address${index}Zip`}
                                id={`address${index}Zip`}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors[`address${index}Zip`] ||
                                  "ZIP code must be 5 digits"}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>


                {/* Bio Section */}
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <h3>Bio</h3>
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={8}
                        placeholder="Enter short biography (optional)"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Profile Image Section */}
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <h3>Profile Image</h3>
                    {originalImage && (
                      <Row className="justify-content-center mb-4">
                        <Col md={6}>
                          <h5 className="mb-3">Current Image</h5>
                          <Image
                            src={`/${originalImage}`}
                            fluid
                            className="mb-3"
                          />
                          <Form.Group>
                            <Form.Check
                              type="checkbox"
                              label="Remove current image"
                              checked={removeImage}
                              onChange={(e) => setRemoveImage(e.target.checked)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}

                    {!removeImage && (
                      <Row className="justify-content-center">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>
                              <FaImage className="me-2" />
                              {originalImage
                                ? "Change Image"
                                : "Add Image"}{" "}
                              (Optional)
                            </Form.Label>
                            <MemberImageCropper
                              onCropComplete={handleCropComplete}
                            />
                            <Form.Text className="text-muted">
                              Maximum size: 10MB. Supported formats: JPEG, PNG,
                              GIF, TIFF, BMP, HEIC/HEIF, and various RAW formats
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>


                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/admin/members/list")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || loadingUpdate || loadingUpload}
                  >
                    <FaSave className="me-1" />
                    {loadingUpdate || loadingUpload
                      ? "Updating..."
                      : "Update Unit"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
      )}
    </>
  );
};

export default MemberEditScreen;
