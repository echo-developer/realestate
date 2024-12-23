import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./property_edit.css";
import { flat_image_tab } from "@/components/post/PropertyData";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";

const previousValues = {
    property_budget: "1000",
    message_buyer: "Great property!",
    address: "123 Street, City",
    locality: "Downtown",
    project_name: "Project ABC",
    configuration: "3 BHK",
    carpet_area: "1500 sqft",
    super_area: "1500 sqft",
    status: "For Sale",
    furnished: "Furnished",
    car_parking: { covered: true, open: false, none: false },
    facing: "East",
    galleries: {
        images: [
            { key:"Image1", image_url: "/assets/images/user.jpg", image_name: "Image 1" },
            { key:"Image2", image_url: "/assets/images/user.jpg", image_name: "Image 2" },
        ],
        caption: "Beautiful gallery of property images.",
    },
};

const Index = () => {
    const {router}=useRouter();
    const { callApi } = AuthUser();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [activeTab, setActiveTab] = useState("");
    const [inputValue, setInputValue] = useState({
        carpet_area: previousValues.carpet_area || "",
        super_area: previousValues.super_area || "",
        furnished: previousValues.furnished || "",
    });

    const openModal = (item) => {
        setSelectedItem(item.key);
        setInputValue((prevState) => ({
            ...prevState,
            [item.key]: previousValues[item.key] || "",
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
            carpet_area: inputValue.carpet_area,
            super_area: inputValue.super_area,
            furnished: inputValue.furnished,
        };

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
                url: "/update_property_list",
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
        { id: 12, key: "galleries", name: "Gallery" },
    ];

    const renderModalContent = () => {
        switch (selectedItem) {
            case "price":
            case "message":
            case "address":
            case "locality":
            case "project":
            case "configuration":
            case "status":
            case "facing":
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
            case "furnished":
                return (
                    <>
                        <label>Select Furnishing Type:</label>
                        <select
                            value={inputValue.furnished || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    furnished: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            <option value="Furnished">Furnished</option>
                            <option value="Semi-Furnished">Semi-Furnished</option>
                            <option value="Unfurnished">Unfurnished</option>
                        </select>
                    </>
                );
            case "car_parking":
                return (
                    <>
                        <label>Select Your Parking Availability:</label>
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={
                                        inputValue[selectedItem]?.covered ||
                                        false
                                    }
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [selectedItem]: {
                                                ...prevState[selectedItem],
                                                covered: e.target.checked,
                                            },
                                        }))
                                    }
                                />
                                Covered
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={
                                        inputValue[selectedItem]?.open ||
                                        false
                                    }
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [selectedItem]: {
                                                ...prevState[selectedItem],
                                                open: e.target.checked,
                                            },
                                        }))
                                    }
                                />
                                Open
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={
                                        inputValue[selectedItem]?.none ||
                                        false
                                    }
                                    onChange={(e) =>
                                        setInputValue((prevState) => ({
                                            ...prevState,
                                            [selectedItem]: {
                                                ...prevState[selectedItem],
                                                none: e.target.checked,
                                            },
                                        }))
                                    }
                                />
                                None
                            </label>
                        </div>
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
                                    Drag &amp; drop files here or {" "}
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
            default:
                return null;
        }
    };

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
                    <h2 style={{ marginLeft: "30px" }}>About</h2>
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
