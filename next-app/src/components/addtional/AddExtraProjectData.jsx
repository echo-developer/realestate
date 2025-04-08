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
import { CustomLoader } from "../postproject/ProjectAmenities";
import useTranslation from "@/hooks/useTranslation";
const AddExtraProjectData = ({ show, handleClose, propId }) => {
  const { callApi } = AuthUser();
  const [propertyData, setPropertyData] = useState({
    instruction: "",
    overlooking: [],
    flooring_style: [],
    water_available: "",
    electric_availability: "",
    type_of_ownership: "",
    approved_by: "",
    landmarks: {},
    project_id: propId,
  });


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchPrevProjectData();
  }, []);

  const FetchPrevProjectData = async () => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/additional_project_details`,
        method: "GET",
        data: {
          project_id: propId,
        },
      });
      if (response?.status === 1) {
        const data = response.data;
        setPropertyData((prev) => ({
          ...prev,
          ...Object.keys(prev).reduce((acc, key) => {
            acc[key] =
              data[key] !== null && data[key] !== undefined
                ? data[key]
                : prev[key];
            return acc;
          }, {}),
        }));

      } else {
        toast.error(response?.message || "Failed to fetch Project details");
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setLoading(false);
    }
  };
  const translation = useTranslation();
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
        api: `/add_extra_project_details`,
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
        <Modal.Title>{translation?.add_new_property || "Add New Property"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (<CustomLoader />)}
        {!loading && (<Tab.Container defaultActiveKey="main">
          <Nav variant="underline border-bottom mb-3">
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
                <Form.Group>
                  <div className="form-floating mb-3">
                    <Form.Control
                      as="textarea"
                      name="instruction"
                      value={propertyData.instruction}
                      onChange={handleChange}
                      placeholder="Enter buyer message"
                      rows={4}
                      style={{ minHeight: '75px' }}
                    />
                    <Form.Label>{translation?.buyer_message || "Buyer Message"}</Form.Label>
                  </div>
                </Form.Group>
                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label className="form-label d-block">{translation?.overlooking || "Overlooking"}</Form.Label>
                    {propertyFeatures.map((feature) => (
                      <Form.Check
                        key={feature.key}
                        type="checkbox"
                        label={feature.value}
                        id={feature.key}
                        name={feature.key}
                        checked={propertyData.overlooking.includes(feature.key)}
                        onChange={handleChange}
                        className="form-check-inline"
                      />
                    ))}
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label className="form-label d-block">{translation?.flooring_style || "Flooring Style"}</Form.Label>
                      {flooringOptions.map((feature) => (
                        <Form.Check
                          key={feature.key}
                          type="checkbox"
                          label={feature.value}
                          id={feature.key}
                          name={feature.key}
                          checked={propertyData.flooring_style.includes(
                            feature.key
                          )}
                          onChange={handleChange}
                          className="form-check-inline"
                        />
                      ))}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-3">
                  <Col>
                    <Form.Group>
                      <div className="form-floating mb-3">
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
                      </div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <div className="form-floating mb-3">
                        <Form.Select
                          name="electric_availability"
                          value={propertyData.electric_availability}
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
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-3">
                  <Col>
                    <Form.Group>
                      <div className="form-floating mb-3">
                        <Form.Select
                          name="type_of_ownership"
                          value={propertyData.type_of_ownership}
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
                      </div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <div className="form-floating mb-3">
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
                      </div>
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
        </Tab.Container>)}
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
