import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  Tab,
  Nav,
} from "react-bootstrap";
import {
  waterAvailabilityOptions,
  electricityStatusOptions,
  ownershipTypeOptions,
  propertyApprovedByOptions,
  propertyFeatures,
  flooringOptions,
} from "../post/PropertyData";
import LandmarkComponent from "../project/EditLandmarkData";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const AddExtraProjectData = ({ show, handleClose, propertyId }) => {
  const { callApi } = AuthUser();
  const [propertyData, setPropertyData] = useState({
    buyer_message: "",
    overlooking: [],
    flooring_style: [],
    water_available: "",
    electric_available: "",
    ownership_type: "",
    approved_by: "",
    landmarks: {},
    property_id: propertyId,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchPrevProjectData();
  }, [propertyId]);

  const FetchPrevProjectData = async () => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/additional_property_details `,
        method: "GET",
        data: {
          property_id: propertyId,
        },
      });

      if (response && response.status === 1) {
        const data = response.data;

        // Ensure null values are replaced with defaults
        setPropertyData({
          buyer_message: data?.buyer_message || "",
          overlooking: data?.overlooking ? data?.overlooking.split(",") : [],
          flooring_style: data?.flooring_style
            ? data.flooring_style.split(",")
            : [],
          water_available: data?.water_available || "",
          electric_available: data?.electric_available || "",
          ownership_type: data?.ownership_type || "",
          approved_by: "",
          landmarks: data?.landmarks || {},
          project_id: propId,
        });

        toast.success("Property details fetched successfully!");
      } else {
        toast.error(response.message || "Failed to fetch property details");
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast.error("Something went wrong while fetching property details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setPropertyData((prevData) => {
        let updatedOverlooking = [...prevData.overlooking];
        let updatedFlooring = [...prevData.flooring_style];

        if (checked) {
          if (propertyFeatures.some((feature) => feature.key === name)) {
            updatedOverlooking.push(name);
          } else if (flooringOptions.some((feature) => feature.key === name)) {
            updatedFlooring.push(name);
          }
        } else {
          updatedOverlooking = updatedOverlooking.filter((key) => key !== name);
          updatedFlooring = updatedFlooring.filter((key) => key !== name);
        }

        return {
          ...prevData,
          overlooking: updatedOverlooking,
          flooring_style: updatedFlooring,
        };
      });
    } else {
      setPropertyData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleLandmarkChange = (updatedLandmarks) => {
    setPropertyData((prevData) => ({
      ...prevData,
      landmarks: updatedLandmarks,
    }));
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(propertyData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    setLoading(true);
    try {
      const response = await callApi({
        api: `/add_extra_property_details`,
        method: "POST",
        data: fd,
      });

      if (response && response.status === 1) {
        toast.success(response.message || "New Property Added Successfully");
      } else {
        toast.error(response.message || "New Property Addition failed");
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Property</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="main">
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="main">Main Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="landmark">Landmark</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="main">
              <Form>
                <Form.Group>
                  <Form.Label>Buyer Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="buyer_message"
                    value={propertyData.buyer_message}
                    onChange={handleChange}
                    placeholder="Enter buyer message"
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>Overlooking</Form.Label>
                    {propertyFeatures.map((feature) => (
                      <Form.Check
                        key={feature.key}
                        type="checkbox"
                        label={feature.value}
                        name={feature.key}
                        checked={propertyData.overlooking.includes(feature.key)}
                        onChange={handleChange}
                      />
                    ))}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>flooring Style</Form.Label>
                    {flooringOptions.map((feature) => (
                      <Form.Check
                        key={feature.key}
                        type="checkbox"
                        label={feature.value}
                        name={feature.key}
                        checked={propertyData.flooring_style.includes(
                          feature.key
                        )}
                        onChange={handleChange}
                      />
                    ))}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Water Available</Form.Label>
                      <Form.Select
                        name="water_available"
                        value={propertyData.water_available}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {waterAvailabilityOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Electric</Form.Label>
                      <Form.Select
                        name="electric_available"
                        value={propertyData.electric_available}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {electricityStatusOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>ownership_type</Form.Label>
                      <Form.Select
                        name="ownership_type"
                        value={propertyData.ownership_type}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {ownershipTypeOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Approved By</Form.Label>
                      <Form.Select
                        name="approved_by"
                        value={propertyData.approved_by}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        {propertyApprovedByOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="landmark">
              <LandmarkComponent
                value={{ landmarks: propertyData.landmarks }}
                onChange={handleLandmarkChange}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Save Property"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddExtraProjectData;
