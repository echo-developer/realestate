import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./property_edit.css";
import withAuth from "@/utils/withAuth";
import {
    flat_image_tab,
    parkingOptions,
    facingOptions,
    flooringOptions,      
    waterAvailabilityOptions,
    electricityStatusOptions,
    propertyApprovedByOptions,
    ownershipTypeOptions,
    propertyFeatures,
} from "@/components/post/PropertyData";
import AuthUser from "@/components/Authentication/AuthUser";
import ConfigurationComponent from "@/components/property/ConfigurationComponent";
import EditLandmarkData from "@/components/property/EditLandmarkData";
import StatusModal from "@/components/property/StatusModal";
import EditFloorDetails from "@/components/property/EditFloorDetails";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import EditImageGallery from "@/components/property/EditImageGallery";
import Locality from "@/components/project/Locality";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    Form,
    Row,
    Col,
    ListGroup,
    ProgressBar,
    FloatingLabel,
  
  } from "react-bootstrap";

const Index = () => {
    const router = useRouter();
    const { callApi } = AuthUser();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [activeTab, setActiveTab] = useState("");
    const [tabData, setTabData] = useState({});
    const [options, setOptions] = useState();

    const { property_id } = router.query;
    const [propertyData, setPropertyData] = useState();

    const [inputValue, setInputValue] = useState({
        buyer_message: "",
        address: "",
        locality: "",
        property_name: "",
        carpet_area: "",
        super_area: "",
        property_furnish: "",
        car_parking: "",
        possession_status: "",
        facing_direction: "",
        water_available: "",
        electric_available: "",
        ownership_type: "",
    });
    const [possessionList, setPossessionList] = useState([]);
    const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);

    useEffect(() => {
        if (property_id) FetchPropertyData(property_id);
    }, [property_id]);

    const FetchPropertyData = async (property_id) => {
        let response;
        try {
            response = await callApi({
                api: `/edit_property`,
                method: "GET",
                data: {
                    property_id: property_id,
                },
            });
            if (response && response.status === 1) {
                setPropertyData(response.data);
                setOptions(response.options);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        if (propertyData) {
            setInputValue({
                buyer_message: propertyData?.buyer_message || "",
                address: propertyData?.address || "",
                locality: propertyData?.locality || "",
                property_name: propertyData?.property_name || "",
                carpet_area: propertyData?.carpet_area || "",
                super_area: propertyData?.super_area || "",
                property_furnish: propertyData?.property_furnish || "",
                car_parking: propertyData?.car_parking || "",
                possession_status: propertyData?.possession_status || "",
                facing_direction: propertyData?.facing_direction || "",
                water_available: propertyData?.water_available || "",
                electric_available: propertyData?.electric_available || "",
                ownership_type: propertyData?.ownership_type || "",
                expected_price: propertyData?.expected_price || "",
                possession_status: {hello: "hello", text: "text"}
            });
        }
    }, [propertyData]);

    const openModal = (item) => {
        if(item?.key === "possession_status") {
            const getList = async () => {
                setDynamicFieldLoading(true);
                try {
                    const args = {
                        api: "/get_property_status",
                        method: "GET"
                    }
                
                    const res = await callApi(args);
                    if(res && res?.status === 1) {
                        setPossessionList(res?.data);
                    }
                } catch (error) {
                    console.log(error?.message || "Something went wrong")
                } finally {
                    setDynamicFieldLoading(false);
                }
            }
            getList();
        }
        setSelectedItem(item.key);
        const state = {...propertyData}
        
        if(item?.key === "possession_status") {
            setInputValue((prevState) => ({
                ...prevState,
                possession_status: {
                    possession_status: propertyData?.possession_status,
                    possesion_year: propertyData?.possesion_year,
                    possesion_month: propertyData?.possesion_month,
                    construct_year: propertyData?.construct_year
                }
            }));
        } else {
            setInputValue((prevState) => ({
                ...prevState,
                [item.key]: propertyData[item.key] || "",
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

        if (inputValue.carpet_area) {
            formData.carpet_area = inputValue.carpet_area;
        }

        if (inputValue.super_area) {
            formData.super_area = inputValue.super_area;
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

        // Add property_id to the FormData
        fd.append("property_id", property_id);

        try {
            const response = await callApi({
                api: "/update_property",
                method: "POST",
                data: fd,
            });

            if(response && response?.status === 1) {
                const name = items?.find(item => item?.key === selectedItem)?.name;
                const msg = name ? `${name} updated successfully` : response?.message || `Property updated successfully`;
                toast.success(msg)
            } else {
                const name = items?.find(item => item?.key === selectedItem)?.name;
                const msg = name ? `${name} update failed` : response?.message || `Property update failed`;
                toast.error(msg)
            }

            // Handle success
            closeModal();
            FetchPropertyData(property_id);
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    const items = [
        { id: 1, key: "expected_price", name: "Price" },
        { id: 2, key: "buyer_message", name: "Message to Buyer" },
        { id: 3, key: "address", name: "Address" },
        { id: 4, key: "locality", name: "Locality" },
        { id: 5, key: "project_name", name: "Project or Society Name" },
        { id: 6, key: "configuration", name: "Configuration" },
        { id: 7, key: "area", name: "Area" },
        { id: 8, key: "possession_status", name: "Possession Status" },
        { id: 9, key: "property_furnish", name: "Furnished" },
        { id: 10, key: "parking_availability", name: "Parking" },
        { id: 11, key: "facing_direction", name: "Facing" },
        { id: 12, key: "overlooking", name: "OverLooking" },
        { id: 13, key: "flooring", name: "Flooring" },
        { id: 14, key: "floor_details", name: "Floor Details" },
        { id: 15, key: "water_available", name: "Water Availability" },
        { id: 16, key: "electric_available", name: "Status of Electricity" },
        // { id: 17, key: "property_approved", name: "Approved By" },
        { id: 18, key: "ownership_type", name: "Type of Ownership" },
        { id: 19, key: "landmarks", name: "Landmark" },
        { id: 20, key: "galleries", name: "Gallery" },
    ];


    const setLocality = (locality) => {
        setInputValue(prev => {
            return {
                ...prev,
                locality: locality
            }
        })
    }

    const renderModalContent = () => {
        switch (selectedItem) {
            case "buyer_message":
            case "project_name":
                return (
                    <>
                    <FloatingLabel controlId="" label={`Enter the value for ${selectedItem}`}>
                        <Form.Control 
                        type="text" 
                        value={inputValue[selectedItem] || ""}
                        placeholder={`Edit ${selectedItem}`}
                        onChange={(e) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: e.target.value,
                            }))
                        }
                        />
                    </FloatingLabel>                        
                    </>
                );
            case "locality":
                return (
                    <Locality locality={inputValue?.locality || ""} setLocality={setLocality} />
                )
            case "expected_price":
                return (
                    <>
                    <FloatingLabel controlId="" label="Select Property Budget:">
                        <Form.Control 
                        type="number" 
                        placeholder="Enter property budget"
                        value={inputValue?.expected_price}
                        onChange={(e) => {
                            setInputValue(prev => {
                                return {
                                    ...prev,
                                    expected_price: e?.target?.value
                                }
                            })
                        }}
                        />
                    </FloatingLabel>                    
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
                        style={{ height: '100px' }}
                        />
                    </FloatingLabel>                    
                    </>
                );
            case "configuration":
                return (
                    <ConfigurationComponent
                        propertyType="Apartment"
                        value={inputValue[selectedItem] || ""}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                        propertyData={propertyData}
                    />
                );

            case "possession_status":
                return (
                    <StatusModal
                    odal
                        value={inputValue[selectedItem] || ""}
                        propertyData={propertyData}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                        list={possessionList}
                    />
                );
            case "property_furnish":
                return (
                    <>
                    <FloatingLabel controlId="floatingSelect" label="Select Furnishing Type:">
                        <Form.Select
                            value={
                                inputValue.property_furnish ||
                                propertyData?.property_furnish?.furnish_id ||
                                ""
                            }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    property_furnish: e.target.value,
                                }))
                            }
                        >
                        <option value="">Select...</option>
                        {options?.all_furnish?.map((furnish) => (
                            <option
                                key={furnish.furnish_id}
                                value={furnish.furnish_id}
                            >
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
                        <FloatingLabel controlId="floatingSelect" label="Select Your Parking Availability">          
                            <Form.Select
                            value={inputValue.parking_availability || ""}
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
                        flatImageTab={flat_image_tab}
                        inputValue={inputValue}
                        selectedItem={activeTab}
                        propertyData={propertyData}
                        propertyId={property_id}
                        setPropertyData={setPropertyData}
                    />
                );
            case "area":
                return (
                    <>
                        <div className="input-group mb-4">
                            <FloatingLabel controlId="" label="Enter the Carpet Area:">
                                <Form.Control
                                    type="number"
                                    value={inputValue.carpet_area || ""}
                                    onChange={(e) =>
                                        handleAreaChange(e, "carpet_area")
                                    }
                                    placeholder="Carpet Area"
                                />
                            </FloatingLabel>                            
                            <span className="input-group-text">sqft</span>
                        </div>
                        
                        <div className="input-group">
                            <FloatingLabel controlId="" label="Enter the Super Area:">
                            <Form.Control
                                type="number"
                                value={inputValue.super_area || ""}
                                onChange={(e) =>
                                    handleAreaChange(e, "super_area")
                                }
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
                        <FloatingLabel controlId="floatingSelect" label="Select Facing Area:">          
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
                            {facingOptions.map((facingType) => (
                                <option
                                    key={facingType.key}
                                    value={facingType.key}
                                >
                                    {facingType.value}
                                </option>
                            ))}
                            </Form.Select>
                        </FloatingLabel>
                    </>
                );

            case "overlooking":
                return (
                    <>
                    <Form.Group>
                        <Form.Label className="form-label d-block">Select Overlooking Features:</Form.Label>
                        <div className="checkbox-group">
                            {propertyFeatures.map((item) => (
                                <Form.Check
                                    type="checkbox"
                                    label={item.key}
                                    id={item?.key}
                                    className="form-check-inline"
                                    checked={
                                        inputValue[selectedItem]?.includes(
                                            item.key
                                        ) || false
                                    }
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [selectedItem]: e.target.checked
                                                ? [
                                                        ...(prevState[
                                                            selectedItem
                                                        ] || []),
                                                        item.key,
                                                    ]
                                                : (
                                                        prevState[
                                                            selectedItem
                                                        ] || []
                                                    ).filter(
                                                        (key) =>
                                                            key !== item.key
                                                    ),
                                        }))
                                    }
                                />                                                                
                            ))}
                        </div>
                    </Form.Group>
                    </>
                );

            case "flooring":
                return (
                    <>
                        <Form.Group>
                            <Form.Label className="form-label d-block">Select Flooring Types:</Form.Label>
                            <div className="checkbox-group">
                                {flooringOptions.map((flooring) => (                                    
                                    <Form.Check
                                        type="checkbox"
                                        label={flooring.value}
                                        id={flooring.key}
                                        checked={
                                            inputValue[selectedItem]?.includes(
                                                flooring.key
                                            ) || false
                                        }
                                        onChange={(e) => {
                                            setInputValue((prevState) => {
                                                const selectedKeys =
                                                    prevState[selectedItem] ||
                                                    [];

                                                if (e.target.checked) {
                                                    // Add the key to the list of selected flooring types
                                                    return {
                                                        ...prevState,
                                                        [selectedItem]: [
                                                            ...selectedKeys,
                                                            flooring.key,
                                                        ],
                                                    };
                                                } else {
                                                    // Remove the key from the list of selected flooring types
                                                    return {
                                                        ...prevState,
                                                        [selectedItem]:
                                                            selectedKeys.filter(
                                                                (key) =>
                                                                    key !==
                                                                    flooring.key
                                                            ),
                                                    };
                                                }
                                            });
                                        }}
                                        className="form-check-inline"
                                    />                                                                            
                                ))}
                            </div>
                        </Form.Group>
                    </>
                );

            case "water_available":
                return (
                    <>
                        <FloatingLabel controlId="floatingSelect" label="Select Water Availability:">
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

            case "electric_available":
                return (
                    <>
                    <FloatingLabel controlId="floatingSelect" label="Select Electricity Status:">
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
                                Select Electricity Status
                            </option>
                            {electricityStatusOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                    </>
                );

            case "ownership_type":
                return (
                    <>
                    <FloatingLabel controlId="floatingSelect" label="Select Ownership Type:">
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
                                Select Ownership Type
                            </option>
                            {ownershipTypeOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                    </>
                );

            case "property_approved":
                return (
                    <>
                    <FloatingLabel controlId="floatingSelect" label="Approved By:">
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
                                Select Anyone
                            </option>
                            {propertyApprovedByOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </Form.Select>
                    </FloatingLabel>
                    </>
                );
            case "floor_details":
                return (
                    <EditFloorDetails
                        propertyData={propertyData}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                    />
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
                        propertyData={propertyData}
                    />
                );
            default:
                return null;
        }
    };

    if (!propertyData) {
        return <div hidden>No property data available</div>;
    }

    const completionPercentage = 41;
  const missingFields = [
    { name: "Facing", percentage: 2 },
    { name: "Property Images", percentage: 20 },
    { name: "Landmark", percentage: 3 },
    { name: "Description", percentage: 3 },
    { name: "Price Includes", percentage: 2 },
  ];

    return (
        <DashboardLayout>
            <div className="col-lg col-12">
            <div className="p-4">
                <h3>Edit & Preview Your Property Ad</h3>
                <p>
                    Modify your ad by clicking the appropriate Edit or Add link.
                    Changes may take up to 24 hours to appear online.
                </p>
            

            <Row>
                <Col className="col-lg-8">
                    <div className="list-container">
                        <ListGroup className="p-0" style={{ listStyleType: "none" }}>
                            {items.map((item, index) => (                                
                                <ListGroup.Item key={index}>
                                    <h5 className="mb-0">{item.name}</h5>                                                                        
                                    <span className="edit-option" title="Edit" onClick={() => openModal(item)}>
                                    <i class="bi bi-pencil-square"></i>
                                    </span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Col>
                <Col className="col-lg-4 col-12">
                    <div className="card">
                        <div className="card-header">
                        <h4>Completion Status</h4>
                        </div>
                        <div className="card-body">
                        <ProgressBar striped variant="success" animated now={40} className="mb-3" style={{ height: '6px' }} />
                        <p className="text-muted text-italic">Get 5 times more response! Just add the following</p>
                        <ListGroup>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Price</span>
                            <span className="text-primary">10%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Facing</span>
                            <span className="text-primary">15%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Possession Status</span>
                            <span className="text-primary">5%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Furnished</span>
                            <span className="text-primary">20%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Flooring</span>
                            <span className="text-primary">10%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Tower & Unit Details</span>
                            <span className="text-primary">18%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Type of Ownership</span>
                            <span className="text-primary">3%</span>
                            </ListGroup.Item>
                            <ListGroup.Item
                            className="d-flex justify-content-between"
                            ><span><i class="bi bi-info-circle"></i> Gallery</span>
                            <span className="text-primary">7%</span>
                            </ListGroup.Item>
                        </ListGroup>
                        </div>
                    </div>
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
                    <Modal.Title>Edit {selectedItem}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderModalContent()}</Modal.Body>
                {selectedItem !== "galleries" ? (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleSave}>
                            Save
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
