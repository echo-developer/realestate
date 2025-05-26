import React, { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";
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
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { CustomLoader } from "../postproject/ProjectAmenities";
import PropertyLandmarkComponent from "../property/EditLandmarkData";

const AddExtraProjectData = ({ show, handleClose, propertyId }) => {
  const translation = useTranslation();
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
        api: `/additional_property_details`,
        method: "GET",
        data: { property_id: propertyId },
      });
  
      if (response?.status === 1) {
        const data = response.data;
        // Ensure null values are replaced with defaults
        setPropertyData({
          buyer_message: data?.buyer_message || "",
          overlooking: Array.isArray(data?.overlooking) ? data.overlooking : [],
          flooring_style: Array.isArray(data?.flooring_style) ? data.flooring_style : [],
          water_available: data?.water_available || "",
          electric_available: data?.electric_available || "",
          ownership_type: data?.ownership_type || "",
          approved_by: "",
          landmarks: data?.landmarks || {},
          property_id: propertyId || "",
        });

  
        // Dynamically update all available response keys
        setPropertyData((prev) => ({
          ...prev,
          ...Object.keys(prev).reduce((acc, key) => {
            acc[key] = data[key] !== null && data[key] !== undefined ? data[key] : prev[key];
            return acc;
          }, {}),
        }));
  
      } 
    } catch (error) {
      console.error("API call failed:", error);
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
        <Modal.Title>{translation?.add_new_property || "Add New Property"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (<CustomLoader />) : (
          <>
          <Tab.Container defaultActiveKey="main">
          <Nav variant="underline mb-3">
            <Nav.Item>
              <Nav.Link eventKey="main">{translation?.main_details || "Main Details"}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="landmark">{translation?.landmark || "Landmark"}</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="main">
              <Form>
                <Form.Group className="form-floating mb-3">                  
                  <Form.Control
                    as="textarea"
                    name="buyer_message"
                    value={propertyData.buyer_message}
                    onChange={handleChange}
                    placeholder="Enter buyer message"
                    style={{minHeight: '75px'}}
                  />
                  <Form.Label>{translation?.buyer_message || "Buyer Message"}</Form.Label>
                </Form.Group>               
                <Form.Group className="mb-3">
                  <Form.Label className="form-label d-block fw-medium">{translation?.overlooking || "Overlooking"}</Form.Label>
                  <Row className="gx-3">
                  {propertyFeatures.map((feature) => (
                    <Col xs={12} sm={6}>
                      <Form.Check
                        //inline
                        key={feature.key}
                        type="checkbox"
                        label={feature.value}
                        id={feature.key}
                        name={feature.key}
                        checked={propertyData.overlooking.includes(feature.key)}
                        onChange={handleChange}                      
                      />
                    </Col>
                  ))}
                  </Row>
                </Form.Group>
                             
                <Form.Group className="mb-4">
                  <Form.Label className="form-label d-block fw-medium">{translation?.flooring_style || "Flooring Style"}</Form.Label>
                  <Row className="gx-3">
                  {flooringOptions.map((feature) => (
                    <Col xs={12} sm={6}>
                      <Form.Check
                        //inline
                        key={feature.key}
                        id={`flooring-${feature.key}`}
                        type="checkbox"
                        label={feature.value}
                        name={feature.key}
                        checked={propertyData.flooring_style.includes(
                          feature.key
                        )}
                        onChange={handleChange}
                      />
                    </Col>
                  ))}
                  </Row>
                </Form.Group>
                
                <Row className="gx-3">
                  <Col xs={12} sm={6}>
                    <Form.Group className="form-floating mb-3">                      
                      <Form.Select
                        name="water_available"
                        value={propertyData.water_available}
                        onChange={handleChange}
                      >
                        <option value="">{translation?.select || "Select"}</option>
                        {waterAvailabilityOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Label>{translation?.water_available || "Water Available"}</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="form-floating mb-3">                      
                      <Form.Select
                        name="electric_available"
                        value={propertyData.electric_available}
                        onChange={handleChange}
                      >
                        <option value="">{translation?.select || "Select"}</option>
                        {electricityStatusOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Label>{translation?.electric || "Electric"}</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-3">
                  <Col xs={12} sm={6}>
                    <Form.Group className="form-floating mb-3">                      
                      <Form.Select
                        name="ownership_type"
                        value={propertyData.ownership_type}
                        onChange={handleChange}
                      >
                        <option value="">{translation?.select || "Select"}</option>
                        {ownershipTypeOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Label>{translation?.type_of_ownership || "Type of Ownership"}</Form.Label>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group className="form-floating">                      
                      <Form.Select
                        name="approved_by"
                        value={propertyData.approved_by}
                        onChange={handleChange}
                      >
                        <option value="">{translation?.select || "Select"}</option>
                        {propertyApprovedByOptions.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.value}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Label>{translation?.approved_by || "Approved By"}</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="landmark">
              <PropertyLandmarkComponent
                value={{ landmarks: propertyData.landmarks }}
                onChange={handleLandmarkChange}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
        {translation?.close || "Close"}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : `${translation?.save_property || "Save Property"}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddExtraProjectData;
