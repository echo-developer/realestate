import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "../property-edit/property_edit.css";
import DashboardLayout from "@/components/layout/DashboardLayout";
import useTranslation from "@/hooks/useTranslation";
import {
  Project_image,
  parkingOptions,
  facingOptions,
  flooringOptions,
  waterAvailabilityOptions,
  electricityStatusOptions,
  propertyApprovedByOptions,
  ownershipTypeOptions,
  projectFeatures,
} from "@/components/post/PropertyData";
import {
  Form,
  Row,
  Col,
  ListGroup,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";
import AuthUser from "@/components/Authentication/AuthUser";
import ConfigurationComponent from "@/components/property/ConfigurationComponent";
import EditLandmarkData from "@/components/project/EditLandmarkData";
import StatusModal from "@/components/project/StatusModal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import EditImageGallery from "@/components/project/EditImageGalary";
import Locality from "@/components/project/Locality";
import withAuth from "@/utils/withAuth";
import ProjectCompletionStatus from "@/components/addtional/ProjectCompletionStatus";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Index = () => {
  const router = useRouter();
  const { callApi } = AuthUser();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [tabData, setTabData] = useState({});
  const [options, setOptions] = useState();
  const translation = useTranslation();
  const { project_id } = router.query;
  const [projectData, setProjectData] = useState();

  const [inputValue, setInputValue] = useState({
    expected_price: "",
    buyer_message: "",
    address: "",
    locality: "",
    project_name: "",
    occupied_area: "",
    total_area: "",
    project_furnish: "",
    parking_availability: "",
    possession_status: "",
    facing_direction: "",
    water_available: "",
    electric_availability: "",
    type_of_ownership: "",
    total_towers: 0,
    total_units: 0,
    flooring: [],
  });
  const [possessionList, setPossessionList] = useState([]);
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);

  useEffect(() => {
    if (project_id) FetchProjectData(project_id);
  }, [project_id]);

  const FetchProjectData = async (project_id) => {
    let response;
    try {
      response = await callApi({
        api: `/edit-project`,
        method: "GET",
        data: {
          project_id: project_id,
        },
      });
      if (response && response.status === 1) {
        setProjectData({
          ...response.data,
          facing_direction: response?.data?.project_facing,
        });
        setOptions(response.options);
        const updatedValues = {
          expected_price: response?.data?.expected_price || "",
          buyer_message: response?.data?.instruction || "",
          address: response?.data?.address || "",
          locality: response?.data?.locality || "",
          project_name: response?.data?.project_name || "",
          occupied_area: response?.data?.occupied_area || "",
          total_area: response?.data?.total_area || "",
          project_furnish: response?.data?.project_furnish || "",
          parking_availability: response?.data?.parking_availability || "",
          possession_status: response?.data?.possession_status || "1",
          facing_direction: response?.data?.project_facing || "",
          water_available: response?.data?.water_availability || "",
          electric_availability: response?.data?.electric_availability || "",
          type_of_ownership: response?.data?.type_of_ownership || "",
          total_towers: response?.data?.total_towers,
          total_units: response?.data?.total_units,
        };

        setInputValue((prev) => {
          return {
            ...prev,
            ...updatedValues,
          };
        });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const doughnutData = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [10, 30],
        backgroundColor: ["#E8527C", "#189634"],
        hoverBackgroundColor: ["#a1395c", "#13762c"],
      },
    ],
  };

  const openModal = (item) => {
    if (item?.key === "possession_status") {
      const getList = async () => {
        setDynamicFieldLoading(true);
        try {
          const args = {
            api: "/get_property_status",
            method: "GET",
          };

          const res = await callApi(args);
          if (res && res?.status === 1) {
            setPossessionList(res?.data);
            setInputValue((prev) => {
              return {
                ...prev,
                // possession_status: projectData?.possession_status || 1
              };
            });
          }
        } catch (error) {
          console.log(error?.message || "Something went wrong");
        } finally {
          setDynamicFieldLoading(false);
        }
      };
      getList();
      setSelectedItem(item?.key);
      setModalIsOpen(true);
      return;
    }
    if (item?.key === "facing_direction") {
      setSelectedItem(item?.key);
      setInputValue((prevState) => {
        return {
          ...prevState,
          facing_direction: projectData["project_facing"] || "",
        };
      });
    }

    if (item?.key === "flooring_style") {
      setSelectedItem(item.key);
      setInputValue((prevState) => ({
        ...prevState,
        flooring_style: projectData?.flooring_style || [],
        hello: "bob",
      }));
    }
    if (item?.key === "water_available") {
      setSelectedItem(item.key);
      setInputValue((prevState) => ({
        ...prevState,
        water_available: projectData?.water_availability || "",
      }));
    }
    if (item?.key === "water_available") {
      setSelectedItem(item?.key);
      setInputValue((prev) => {
        return {
          ...prev,
          [item?.key]: projectData?.water_availability || "",
        };
      });
    } else {
      setSelectedItem(item.key);
      setInputValue((prevState) => ({
        ...prevState,
        [item.key]: projectData[item.key] || "",
        possesion_month: projectData?.possesion_month || "",
        possesion_year: projectData?.possesion_year || "",
        construct_year: projectData?.construct_year || "",
      }));
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedItem("");
    setActiveTab("");
  };

  const handleAreaChange = (e, field) => {
    setInputValue((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const fd = new FormData();
    const formData = {
      [selectedItem]: inputValue[selectedItem],
    };

    if (inputValue.occupied_area) {
      formData.occupied_area = inputValue.occupied_area;
    }
    if (inputValue?.total_towers) {
      formData.total_towers = inputValue?.total_towers;
    }
    if (inputValue?.total_units) {
      formData.total_units = inputValue?.total_units;
    }

    if (inputValue.total_area) {
      formData.total_area = inputValue.total_area;
    }
    // Ensure galleries include the tabData
    if (selectedItem === "galleries" && tabData) {
      const updatedGalleries = {
        ...(inputValue.galleries || {}), // Existing gallery data
        tabData, // Append tabData
      };
      formData.galleries = updatedGalleries;
    }

    // Append the formData to FormData object
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    // Add project_id to the FormData
    fd.append("project_id", project_id);

    try {
      const response = await callApi({
        api: "/update_project",
        method: "POST",
        data: fd,
      });
      if (response && response?.status === 1) {
        const name = items?.find((item) => item?.key === selectedItem)?.name;
        const msg = name
          ? `${name} updated successfully`
          : response?.message || `Project updated successfully`;
        toast.success(msg);
        closeModal();
        FetchProjectData(project_id);
      } else {
        const name = items?.find((item) => item?.key === selectedItem)?.name;
        const msg = name
          ? `${name} update failed`
          : response?.message || `Project update failed`;
        toast.error(msg);
      }
      // Handle success
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const items = [
    { id: 1, key: "expected_price", name: "Price" },
    { id: 2, key: "instruction", name: "Instruction" },
    { id: 3, key: "address", name: "Address" },
    { id: 4, key: "locality", name: "Locality" },
    { id: 5, key: "project_name", name: "Project or Society Name" },
    // { id: 6, key: "configuration", name: "Configuration" },
    { id: 7, key: "area", name: "Area" },
    { id: 8, key: "possession_status", name: "Possession Status" },
    { id: 9, key: "project_furnish", name: "Furnished" },
    { id: 10, key: "parking_availability", name: "Parking" },
    { id: 11, key: "facing_direction", name: "Facing" },
    { id: 12, key: "overlooking", name: "OverLooking" },
    { id: 13, key: "flooring_style", name: "Flooring" },
    { id: 14, key: "tower_details", name: "Tower & Unit Details" },
    { id: 15, key: "water_available", name: "Water Availability" },
    { id: 16, key: "electric_availability", name: "Status of Electricity" },
    // { id: 17, key: "project_approved", name: "Approved By" },
    { id: 18, key: "type_of_ownership", name: "Type of Ownership" },
    { id: 19, key: "landmarks", name: "Landmark" },
    { id: 20, key: "galleries", name: "Gallery" },
  ];
  const setLocality = (locality) => {
    setInputValue((prev) => {
      return {
        ...prev,
        locality: locality,
      };
    });
  };

  const groupItems = {
    basic: items.filter((item) =>
      [
        "expected_price",
        "instruction",
        "locality",
        "address",
        "project_name",
      ].includes(item.key)
    ),
    features: items.filter((item) =>
      [
        "area",
        "possession_status",
        "project_furnish",
        "facing_direction",
        "overlooking",
        "flooring_style",
        "parking_availability",
        "tower_details",
      ].includes(item.key)
    ),
    additional: items.filter((item) =>
      [
        "water_available",
        "electric_availability",
        "type_of_ownership",
        "landmarks",
        "galleries",
      ].includes(item.key)
    ),
  };

  const renderModalContent = () => {
    switch (selectedItem) {
      case "instruction":
      case "project_name":
        return (
          <>
            <FloatingLabel
              controlId=""
              label={`Enter the value for ${selectedItem}`}
            >
              <Form.Control
                type="text"
                value={inputValue[selectedItem] || ""}
                onChange={(e) =>
                  setInputValue((prev) => ({
                    ...prev,
                    [selectedItem]: e.target.value,
                  }))
                }
                placeholder={`Edit ${selectedItem}`}
              />
            </FloatingLabel>
          </>
        );
      case "expected_price":
        return (
          <>
            <FloatingLabel controlId="" label="Select Property Budget:">
              <Form.Control
                type="number"
                placeholder="Enter property budget"
                value={inputValue?.expected_price}
                onChange={(e) =>
                  setInputValue((prevState) => ({
                    ...prevState,
                    expected_price: e.target.value,
                  }))
                }
              />
            </FloatingLabel>
          </>
        );
      case "locality":
        return (
          <>
            <Locality
              locality={inputValue?.locality || ""}
              setLocality={setLocality}
            />
            <Locality
              locality={inputValue?.locality || ""}
              setLocality={setLocality}
            />
            <Locality
              locality={inputValue?.locality || ""}
              setLocality={setLocality}
            />
          </>
        );
      case "address":
        return (
          <>
            <FloatingLabel controlId="address-input" label="Enter the address:">
              <Form.Control
                as="textarea"
                id="address-input"
                placeholder="Enter the address here"
                rows={4}
                value={inputValue[selectedItem] || ""}
                onChange={(e) =>
                  setInputValue((prev) => ({
                    ...prev,
                    [selectedItem]: e.target.value,
                  }))
                }
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          </>
        );
      case "configuration":
        return (
          <ConfigurationComponent
            projectType="Apartment"
            value={inputValue[selectedItem] || ""}
            onChange={(newValue) =>
              setInputValue((prev) => ({
                ...prev,
                [selectedItem]: newValue,
              }))
            }
            projectData={projectData}
          />
        );

      case "possession_status":
        return (
          <StatusModal
            value={inputValue[selectedItem] || ""}
            propertyData={projectData}
            onChange={(newValue) =>
              setInputValue((prev) => ({
                ...prev,
                [selectedItem]: newValue,
              }))
            }
            list={possessionList}
          />
          // <h2>possession status</h2>
        );
      case "project_furnish":
        return (
          <>
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Furnishing Type:"
            >
              <Form.Select
                value={
                  inputValue.project_furnish ||
                  projectData?.project_furnish?.furnish_id ||
                  ""
                }
                onChange={(e) =>
                  setInputValue((prevState) => ({
                    ...prevState,
                    project_furnish: e.target.value,
                  }))
                }
              >
                <option value="">Select...</option>
                {options?.all_furnish?.map((furnish) => (
                  <option key={furnish.furnish_id} value={furnish.furnish_id}>
                    {furnish.furnish_name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </>
        );

      case "parking_availability":
        return (
          <>
            m
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Your Parking Availability"
            >
              <Form.Select
                value={
                  parkingOptions.some(
                    (parking) =>
                      parking.key === inputValue?.parking_availability
                  )
                    ? inputValue?.parking_availability
                    : "na"
                }
                onChange={(e) =>
                  setInputValue((prevState) => ({
                    ...prevState,
                    parking_availability: e.target.value,
                  }))
                }
              >
                <option value="">Select Parking Type</option>
                {parkingOptions.map((parking) => (
                  <option key={parking.key} value={parking.key}>
                    {parking.value}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </>
        );

      case "galleries":
        return (
          <EditImageGallery
            flatImageTab={Project_image}
            inputValue={inputValue}
            selectedItem={activeTab}
            projectData={projectData}
            projectId={project_id}
            setProjectData={setProjectData}
          />
        );
      case "area":
        return (
          <>
            <div className="input-group mb-4">
              <FloatingLabel controlId="" label="Enter the Occupied Area:">
                <Form.Control
                  type="number"
                  value={inputValue.occupied_area || ""}
                  onChange={(e) => handleAreaChange(e, "occupied_area")}
                  placeholder="Carpet Area"
                />
              </FloatingLabel>
              <span className="input-group-text">sqft</span>
            </div>

            <div className="input-group">
              <FloatingLabel controlId="" label="Enter the Total Area:">
                <Form.Control
                  type="number"
                  value={inputValue.total_area || ""}
                  onChange={(e) => handleAreaChange(e, "total_area")}
                  placeholder="Super Area"
                />
              </FloatingLabel>
              <span className="input-group-text">sqft</span>
            </div>
          </>
        );
      case "facing_direction":
        return (
          <>
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Facing Area:"
            >
              <Form.Select
                value={inputValue.facing_direction || ""}
                onChange={(e) =>
                  setInputValue((prevState) => ({
                    ...prevState,
                    facing_direction: e.target.value,
                  }))
                }
              >
                <option value="">Select...</option>
                {facingOptions.map((facingType) => {
                  return (
                    <option key={facingType.key} value={facingType.key}>
                      {facingType.value}
                    </option>
                  );
                })}
              </Form.Select>
            </FloatingLabel>
          </>
        );

      case "overlooking":
        return (
          <>
            <Form.Group>
              <Form.Label className="form-label d-block">
                Select Overlooking Features:
              </Form.Label>

              {projectFeatures?.map((item) => (
                <Form.Check
                  type="checkbox"
                  label={item?.value}
                  id={item?.value}
                  name={item?.value}
                  checked={
                    inputValue?.[selectedItem]?.includes(item?.key) || false
                  }
                  onChange={(e) =>
                    setInputValue((prevState) => ({
                      ...prevState,
                      [selectedItem]: e.target.checked
                        ? [...(prevState?.[selectedItem] || []), item?.key]
                        : (prevState?.[selectedItem] || []).filter(
                            (key) => key !== item?.key
                          ),
                    }))
                  }
                  className="form-check-inline"
                />
              ))}
            </Form.Group>
          </>
        );

      case "flooring_style":
        return (
          <>
            <Form.Group>
              <Form.Label className="form-label d-block">
                Select Flooring Types:
              </Form.Label>
              {flooringOptions?.map((flooring) => (
                <Form.Check
                  key={flooring.key}
                  type="checkbox"
                  label={flooring.value}
                  id={flooring.key}
                  name={flooring.key}
                  checked={
                    inputValue?.[selectedItem]?.includes(flooring?.key) || false
                  }
                  onChange={(e) =>
                    setInputValue((prevState) => ({
                      ...prevState,
                      [selectedItem]: e.target.checked
                        ? [...(prevState?.[selectedItem] || []), flooring?.key]
                        : (prevState?.[selectedItem] || []).filter(
                            (key) => key !== flooring?.key
                          ),
                    }))
                  }
                  className="form-check-inline"
                />
              ))}
            </Form.Group>
          </>
        );

      case "water_available":
        return (
          <>
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Water Availability:"
            >
              <Form.Select
                value={inputValue[selectedItem] || ""}
                onChange={(e) =>
                  setInputValue((prevState) => ({
                    ...prevState,
                    [selectedItem]: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  Select Water Availability
                </option>
                {waterAvailabilityOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </>
        );

      case "electric_availability":
        return (
          <>
            <label className="form-label d-block">
              Select Electricity Status:
            </label>
            <select
              value={inputValue[selectedItem] || ""}
              onChange={(e) =>
                setInputValue((prevState) => ({
                  ...prevState,
                  [selectedItem]: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="" disabled>
                Select Electricity Status
              </option>
              {electricityStatusOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
          </>
        );

      case "type_of_ownership":
        return (
          <>
            <label className="form-label d-block">Select Ownership Type:</label>
            <select
              value={inputValue[selectedItem] || ""}
              onChange={(e) =>
                setInputValue((prevState) => ({
                  ...prevState,
                  [selectedItem]: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="" disabled>
                Select Ownership Type
              </option>
              {ownershipTypeOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
          </>
        );

      case "project_approved":
        return (
          <>
            <label className="form-label d-block">Approved By:</label>
            <select
              value={inputValue[selectedItem] || ""}
              onChange={(e) =>
                setInputValue((prevState) => ({
                  ...prevState,
                  [selectedItem]: e.target.value,
                }))
              }
              className="form-select"
            >
              <option value="" disabled>
                Select Anyone
              </option>
              {propertyApprovedByOptions?.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.value}
                </option>
              ))}
            </select>
          </>
        );
      case "tower_details":
        return (
          <>
            <FloatingLabel
              controlId="floatingSelect"
              label="Total Towers:"
              className="mb-3"
            >
              <Form.Select>
                <option value="">Select Total Units</option>
                {[...Array(15)].map((_, i) => (
                  <option key={`tower_${i + 1}`} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel controlId="floatingInput" label="Total Units:">
              <Form.Control
                placeholder="total units"
                type="number"
                value={inputValue?.total_units}
                onChange={(e) =>
                  setInputValue((prev) => {
                    return {
                      ...prev,
                      total_units: e?.target?.value,
                    };
                  })
                }
              />
            </FloatingLabel>
          </>
        );

      case "landmarks":
        return (
          <EditLandmarkData
            value={inputValue[selectedItem] || ""}
            onChange={(newValue) =>
              setInputValue((prev) => ({
                ...prev,
                [selectedItem]: newValue,
              }))
            }
            projectData={projectData}
          />
        );
      default:
        return null;
    }
  };

  if (!projectData) {
    return (
      <div hidden>
        {translation?.no_project_data_available || "No project data available"}
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="col-lg col-12">
        <div className="p-4">
          <h3>Edit & Preview Your Project Ad</h3>
          <p>
            Modify your ad by clicking the appropriate Edit or Add link. Changes
            may take up to 24 hours to appear online.
          </p>

          <Row className="row">
            <Col className="col-lg-8 col-12">
              <div className="list-container">
                {/* Basic Details */}
                <h5 className="text-uppercase">Basic Details</h5>
                <ListGroup
                  className="mb-3 p-0"
                  style={{ listStyleType: "none" }}
                >
                  {groupItems.basic.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <h5 className="mb-0">{item.name}</h5>
                      <span
                        className="edit-option"
                        title="Edit"
                        onClick={() => openModal(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {/* Property Features */}
                <h5 className="text-uppercase">Project Features</h5>
                <ListGroup
                  className="mb-3 p-0"
                  style={{ listStyleType: "none" }}
                >
                  {groupItems.features.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <h5 className="mb-0">{item.name}</h5>
                      <span
                        className="edit-option"
                        title="Edit"
                        onClick={() => openModal(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {/* Additional Information */}
                <h5 className="text-uppercase">Additional Features</h5>
                <ListGroup className="p-0" style={{ listStyleType: "none" }}>
                  {groupItems.additional.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <h5 className="mb-0">{item.name}</h5>
                      <span
                        className="edit-option"
                        title="Edit"
                        onClick={() => openModal(item)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
             <Col className="col-lg-4 col-12">
              <ProjectCompletionStatus projectData={projectData}/>
             </Col>
          </Row>
        </div>
      </div>

      {/* Modal for editing */}
      <Modal
        show={modalIsOpen}
        onHide={closeModal}
        size={
          selectedItem === "galleries" || selectedItem === "landmarks"
            ? "lg"
            : ""
        }
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.edit || "Edit"}
            {selectedItem}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderModalContent()}</Modal.Body>
        {selectedItem !== "galleries" ? (
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              {translation?.cancel || "Cancel"}
            </Button>

            <Button variant="primary" onClick={handleSave}>
              {translation?.save || "Save"}
            </Button>
          </Modal.Footer>
        ) : (
          ""
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Index);
