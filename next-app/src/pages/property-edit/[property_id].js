import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./property_edit.css";
import { flat_image_tab } from "@/components/post/PropertyData";
import AuthUser from "@/components/Authentication/AuthUser";
import ConfigurationComponent from "@/components/property/ConfigurationComponent";
import EditLandmarkData from "@/components/property/EditLandmarkData";
import StatusModal from "@/components/property/StatusModal";
import EditFloorDetails from "@/components/property/EditFloorDetails";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Index = () => {
    const router = useRouter();
    const { callApi } = AuthUser();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [activeTab, setActiveTab] = useState("");
    const [options, setOptions] = useState();

    const { property_id } = router.query;
    const [propertyData, setPropertyData] = useState();

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

    console.log(options);
    useEffect(() => {
        if (propertyData) {
            setInputValue({
                address: propertyData?.address || "",
                locality: propertyData?.address || "",
                property_name: propertyData?.property_name || "",
                carpet_area: propertyData?.carpet_area || "",
                super_area: propertyData?.super_area || "",
                property_furnish: propertyData?.property_furnish || "",
            });
        }
    }, [propertyData]);

    const [inputValue, setInputValue] = useState({
        address: propertyData?.address || "",
        locality: propertyData?.address || "",
        property_name: propertyData?.property_name || "",
        carpet_area: propertyData?.carpet_area || "",
        super_area: propertyData?.super_area || "",
        property_furnish: propertyData?.property_furnish || "",
    });

    console.log(propertyData?.address);

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

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                fd.append(key, JSON.stringify(value));
            } else {
                fd.append(key, value);
            }
        });
        fd.append("property_id", "1");

        try {
            const response = await callApi({
                url: "/update_property_data",
                method: "POST",
                data: fd,
            });
            console.log("API response:", response);
            closeModal();
        } catch (error) {
            console.error("Error updating property:", error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleFileChange = (e) => {
        console.log(e.target.files);
    };

    const handleDescriptionChange = (e) => {
        const newCaption = e.target.value;
        setInputValue((prevState) => ({
            ...prevState,
            [selectedItem]: {
                ...prevState[selectedItem],
                caption: newCaption,
            },
        }));
    };

    const handleRemoveFile = (index) => {
        console.log("Remove file at index:", index);
    };

    const items = [
        { id: 1, key: "property_budget", name: "Price" },
        { id: 2, key: "message_buyer", name: "Message to Buyer" },
        { id: 3, key: "address", name: "Address" },
        { id: 4, key: "locality", name: "Locality" },
        { id: 5, key: "project_name", name: "Project or Society Name" },
        { id: 6, key: "configuration", name: "Configuration" },
        { id: 7, key: "area", name: "Area" },
        { id: 8, key: "status", name: "Status" },
        { id: 9, key: "furnished", name: "Furnished" },
        { id: 10, key: "car_parking", name: "Car Parking" },
        { id: 11, key: "facing", name: "Facing" },
        { id: 12, key: "overlooking", name: "OverLooking" },
        { id: 13, key: "flooring", name: "Flooring" },
        { id: 14, key: "floor_details", name: "Floor Details" },
        { id: 15, key: "water_availability", name: "Water Availability" },
        { id: 16, key: "electricity_status", name: "Status of Electricity" },
        { id: 17, key: "property_approved", name: "Approved By" },
        // { id: 18, key: "ownership_type", name: "Type of Ownership" },
        { id: 19, key: "landmark", name: "Landmark" },
        { id: 20, key: "galleries", name: "Gallery" },
    ];

    const renderModalContent = () => {
        switch (selectedItem) {
            case "message_buyer":
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
                    >
                        {/* Render Bedroom Configuration */}
                        {propertyData?.bedroom?.map((bedroom, index) => (
                            <div key={bedroom.key}>
                                <h5>Bedroom {index + 1}</h5>
                                <label>Height</label>
                                <input
                                    type="text"
                                    value={bedroom.height || ""}
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [`bedroom${index + 1}_height`]:
                                                e.target.value,
                                        }))
                                    }
                                    placeholder="Height"
                                    className="modal-input"
                                />
                                <label>Width</label>
                                <input
                                    type="text"
                                    value={bedroom.width || ""}
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [`bedroom${index + 1}_width`]:
                                                e.target.value,
                                        }))
                                    }
                                    placeholder="Width"
                                    className="modal-input"
                                />
                            </div>
                        ))}

                        {/* Render Bathroom Configuration */}
                        {propertyData?.bathroom?.map((bathroom, index) => (
                            <div key={bathroom.key}>
                                <h5>Bathroom {index + 1}</h5>
                                <label>Height</label>
                                <input
                                    type="text"
                                    value={bathroom.height || ""}
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [`bathroom${index + 1}_height`]:
                                                e.target.value,
                                        }))
                                    }
                                    placeholder="Height"
                                    className="modal-input"
                                />
                                <label>Width</label>
                                <input
                                    type="text"
                                    value={bathroom.width || ""}
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [`bathroom${index + 1}_width`]:
                                                e.target.value,
                                        }))
                                    }
                                    placeholder="Width"
                                    className="modal-input"
                                />
                            </div>
                        ))}
                    </ConfigurationComponent>
                );

            case "status":
                return (
                    <StatusModal
                        value={inputValue[selectedItem] || ""}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                    />
                );
            case "furnished":
                return (
                    <>
                        <label>Select Furnishing Type:</label>
                        <select
                            value={
                                inputValue.property_furnish ||
                                propertyData?.property_furnish ||
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
                                    value={furnish.furnish_name}
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
                            value={
                                inputValue[selectedItem]?.parkingType ||
                                propertyData?.car_parking ||
                                ""
                            }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: {
                                        ...prevState[selectedItem],
                                        parkingType: e.target.value,
                                    },
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select Parking Type</option>
                            <option value="covered">Covered</option>
                            <option value="open">Open</option>
                            <option value="none">None</option>
                        </select>
                    </>
                );

            case "galleries":
                return (
                    <>
                        <div className="image-tab-content">
                            {flat_image_tab && flat_image_tab.length > 0 && (
                                <ul className="nav nav-underline nav-custom">
                                    {flat_image_tab.map((tab, index) => (
                                        <li className="nav-item" key={index}>
                                            <a
                                                className={`nav-link ${
                                                    activeTab === tab.key
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleTabChange(tab.key)
                                                }
                                            >
                                                {tab.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-field">
                            <div className="upload-area" id="uploadfile">
                                <input
                                    type="file"
                                    name="fileinput"
                                    id="fileinput"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                <i className="bi bi-upload"></i>
                                <p>
                                    Drag &amp; drop files here or{" "}
                                    <span className="text-site">click</span> to
                                    select files
                                </p>
                            </div>
                            <p className="text-help">
                                Accepted formats are .jpg, .gif, .bmp &amp;
                                .png. Maximum size allowed is 20 MB. Minimum
                                dimensions allowed are 600 x 400 pixels.
                            </p>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Description</label>
                            <textarea
                                rows="3"
                                className="form-control"
                                placeholder="Write something about this gallery..."
                                value={inputValue[selectedItem]?.caption || ""}
                                onChange={handleDescriptionChange}
                            />
                        </div>

                        <div className="upload-gallery">
                            {inputValue[selectedItem]?.images?.map(
                                (fileData, index) => (
                                    <div className="pic" key={index}>
                                        <img
                                            src={fileData.image_url}
                                            alt={`Uploaded Preview ${
                                                index + 1
                                            }`}
                                        />
                                        <p>{fileData.image_name}</p>
                                        <a
                                            href="#"
                                            className="btn-trash"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveFile(index);
                                            }}
                                        >
                                            <i className="icon-feather-trash"></i>
                                        </a>
                                    </div>
                                )
                            )}
                        </div>
                    </>
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
            case "facing":
                return (
                    <>
                        <label>Select Facing Area : </label>
                        <select
                            value={inputValue.facing_area || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    facing_area: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            {[
                                "East",
                                "North",
                                "North - East",
                                "North - West",
                                "South",
                                "South - East",
                                "South - West",
                                "West",
                            ].map((facingType) => (
                                <option key={facingType} value={facingType}>
                                    {facingType}
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
                const flooringOptions = [
                    "Mosaic",
                    "Vitrified",
                    "Wooden",
                    "Ceramic Tiles",
                    "Marble",
                    "Normal Tiles/Kotah Stone",
                    "Granite",
                    "Marbonite",
                ];

                return (
                    <>
                        <label>Select Flooring Types:</label>
                        <div className="checkbox-group">
                            {flooringOptions.map((type, index) => (
                                <label key={index}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            inputValue[selectedItem]?.[type] ||
                                            false
                                        }
                                        onChange={(e) =>
                                            setInputValue((prevState) => ({
                                                ...prevState,
                                                [selectedItem]: {
                                                    ...prevState[selectedItem],
                                                    [type]: e.target.checked,
                                                },
                                            }))
                                        }
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </>
                );

            case "water_availability":
                const waterAvailabilityOptions = [
                    "24 Hours Available",
                    "Partially Available",
                    "Not Available",
                ];

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
                            {waterAvailabilityOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "electricity_status":
                const electricityStatusOptions = [
                    "Full Power Backup",
                    "Partial Power Backup",
                    "No Power Backup",
                ];
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
                            {electricityStatusOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "property_approved":
                const propertyApprovedByOptions = [
                    "Kolkata Municipal Corporation",
                    "Kolkata Metropolitan Development Authority",
                    "New Town Kolkata Development Authority",
                    "Bidhannagar Municipal Corporation",
                    "West Bengal Industrial Development Corporation Limited",
                    "Developer",
                    "RWA/Co-operative Housing Society",
                    "Development Authority",
                    "City Municipal Corporation",
                ];
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
                            {propertyApprovedByOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </>
                );
                case "floor_details":
                    return (
                        <EditFloorDetails
                            totalFloors={propertyData?.total_floor || ""}
                            floorNumber={propertyData?.floor_nnumber || ""}
                            value={inputValue[selectedItem] || ""}
                            onChange={(newValue) =>
                                setInputValue((prev) => ({
                                    ...prev,
                                    [selectedItem]: newValue,
                                }))
                            }
                        />
                    );
                
            case "landmark":
                return (
                    <EditLandmarkData
                        value={inputValue[selectedItem] || ""}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                    />
                );
            default:
                return null;
        }
    };

    if (!propertyData) {
        return <div>No property data available</div>;
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
                size={selectedItem === "galleries" ? "lg" : ""}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit {selectedItem}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderModalContent()}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </MainLayout>
    );
};

export default Index;
