import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./property_edit.css";
import {
    flat_image_tab,
    parkingOptions,
    facingOptions,
    flooringOptions,
    waterAvailabilityOptions,
    electricityStatusOptions,
    propertyApprovedByOptions,
    ownershipTypeOptions,
} from "@/components/post/PropertyData";
import AuthUser from "@/components/Authentication/AuthUser";
import ConfigurationComponent from "@/components/property/ConfigurationComponent";
import EditLandmarkData from "@/components/property/EditLandmarkData";
import StatusModal from "@/components/property/StatusModal";
import EditFloorDetails from "@/components/property/EditFloorDetails";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import EditImageGallery from "@/components/property/EditImageGallery";

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
            });
        }
    }, [propertyData]);

    const openModal = (item) => {
        setSelectedItem(item.key);
        setInputValue((prevState) => ({
            ...prevState,
            [item.key]: propertyData[item.key] || "",
        }));
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

            // Handle success
            closeModal();
            FetchPropertyData(property_id);
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    const items = [
        { id: 1, key: "property_budget", name: "Price" },
        { id: 2, key: "buyer_message", name: "Message to Buyer" },
        { id: 3, key: "address", name: "Address" },
        { id: 4, key: "locality", name: "Locality" },
        { id: 5, key: "project_name", name: "Project or Society Name" },
        { id: 6, key: "configuration", name: "Configuration" },
        { id: 7, key: "area", name: "Area" },
        { id: 8, key: "possession_status", name: "Possession Status" },
        { id: 9, key: "property_furnish", name: "Furnished" },
        { id: 10, key: "car_parking", name: "Car Parking" },
        { id: 11, key: "facing_direction", name: "Facing" },
        { id: 12, key: "overlooking", name: "OverLooking" },
        { id: 13, key: "flooring", name: "Flooring" },
        { id: 14, key: "floor_details", name: "Floor Details" },
        { id: 15, key: "water_available", name: "Water Availability" },
        { id: 16, key: "electric_available", name: "Status of Electricity" },
        { id: 17, key: "property_approved", name: "Approved By" },
        { id: 18, key: "ownership_type", name: "Type of Ownership" },
        { id: 19, key: "landmarks", name: "Landmark" },
        { id: 20, key: "galleries", name: "Gallery" },
    ];

    const renderModalContent = () => {
        switch (selectedItem) {
            case "buyer_message":
            case "locality":
            case "project_name":
                return (
                    <>
                        <label>Enter the value for {selectedItem}:</label>
                        <input
                            type="text"
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prev) => ({
                                    ...prev,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            placeholder={`Edit ${selectedItem}`}
                            className="modal-input"
                        />
                    </>
                );
            case "property_budget":
                return (
                    <>
                        <label>Select Property Budget:</label>
                        <select
                            value={
                                inputValue.property_budget ||
                                propertyData?.budget_id ||
                                ""
                            }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    property_budget: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            {options?.all_budget?.map((budget) => (
                                <option
                                    key={budget.budget_id}
                                    value={budget.budget_id}
                                >
                                    ₹{budget.min_budget} - ₹{budget.max_budget}
                                </option>
                            ))}
                        </select>
                    </>
                );
            case "address":
                return (
                    <>
                        <label htmlFor="address-input">
                            Enter the address:
                        </label>
                        <textarea
                            id="address-input"
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prev) => ({
                                    ...prev,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            placeholder="Enter the address here"
                            className="modal-textarea"
                            rows={4}
                        />
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
                        value={inputValue[selectedItem] || ""}
                        propertyData={propertyData}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                    />
                );
            case "property_furnish":
                return (
                    <>
                        <label>Select Furnishing Type:</label>
                        <select
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
                            className="modal-input"
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
                        </select>
                    </>
                );

            case "car_parking":
                return (
                    <>
                        <label>Select Your Parking Availability:</label>
                        <select
                            value={inputValue.car_parking || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    car_parking: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select Parking Type</option>
                            {parkingOptions.map((parking) => (
                                <option key={parking.key} value={parking.key}>
                                    {parking.value}
                                </option>
                            ))}
                        </select>
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
                    />
                );
            case "area":
                return (
                    <>
                        <label>Enter the Carpet Area:</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={inputValue.carpet_area || ""}
                                onChange={(e) =>
                                    handleAreaChange(e, "carpet_area")
                                }
                                placeholder="Carpet Area"
                                className="modal-input"
                            />
                            <span className="input-group-addon">sqft</span>
                        </div>

                        <label>Enter the Super Area:</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={inputValue.super_area || ""}
                                onChange={(e) =>
                                    handleAreaChange(e, "super_area")
                                }
                                placeholder="Super Area"
                                className="modal-input"
                            />
                            <span className="input-group-addon">sqft</span>
                        </div>
                    </>
                );
            case "facing_direction":
                return (
                    <>
                        <label>Select Facing Area :</label>
                        <select
                            value={inputValue.facing_direction || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    facing_direction: e.target.value,
                                }))
                            }
                            className="modal-input"
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
                        </select>
                    </>
                );

            case "overlooking":
                const propertyFeatures = [
                    { feature: "Pool", availability: false },
                    { feature: "Garden/Park", availability: false },
                    { feature: "Main Road", availability: false },
                ];

                return (
                    <>
                        <label>Select Overlooking Features:</label>
                        <div className="checkbox-group">
                            {propertyFeatures.map((item, index) => (
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            inputValue[selectedItem]?.[
                                                item.feature
                                            ] || false
                                        }
                                        onChange={(e) =>
                                            setInputValue((prevState) => ({
                                                ...prevState,
                                                [selectedItem]: {
                                                    ...prevState[selectedItem],
                                                    [item.feature]:
                                                        e.target.checked,
                                                },
                                            }))
                                        }
                                    />
                                    {item.feature}
                                </label>
                            ))}
                        </div>
                    </>
                );

            case "flooring":
                return (
                    <>
                        <label>Select Flooring Types:</label>
                        <div className="checkbox-group">
                            {flooringOptions.map((flooring) => (
                                <label key={flooring.key}>
                                    <input
                                        type="checkbox"
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
                                    />
                                    {flooring.value}
                                </label>
                            ))}
                        </div>
                    </>
                );

            case "water_available":
                return (
                    <>
                        <label>Select Water Availability:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Water Availability
                            </option>
                            {waterAvailabilityOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "electric_available":
                return (
                    <>
                        <label>Select Electricity Status:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
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

            case "ownership_type":
                return (
                    <>
                        <label>Select Ownership Type:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
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

            case "property_approved":
                return (
                    <>
                        <label>Approved By:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Anyone
                            </option>
                            {propertyApprovedByOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
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

    return (
        <MainLayout>
            <div className="p-4">
                <h3>Edit & Preview Your Property Ad</h3>
                <p>
                    Modify your ad by clicking the appropriate Edit or Add link.
                    Changes may take up to 24 hours to appear online.
                </p>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    {/* <h2 style={{ marginLeft: "30px" }}>About</h2> */}
                    <div className="list-container">
                        <ul style={{ listStyleType: "none" }}>
                            {items.map((item, index) => (
                                <li key={index} className="list-item">
                                    {item.name}
                                    <span
                                        className="edit-option"
                                        onClick={() => openModal(item)}
                                    >
                                        Edit
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
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
        </MainLayout>
    );
};

export default Index;
