import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./property_edit.css";

const Index = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [inputValue, setInputValue] = useState({});

    const openModal = (item) => {
        setSelectedItem(item.key);
        setInputValue((prevState) => ({
            ...prevState,
            [item.key]: item.key === "car_parking" ? { covered: false, open: false, none: false } : "",
        }));
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem("");
    };

    const handleSave = () => {
        console.log(`${selectedItem}:`, inputValue[selectedItem]);
        closeModal();
    };

    const items = [
        {id: 1, key: 'price', name: 'Price'},
        {id: 2, key: 'message', name: 'Message to Buyer'},
        {id: 3, key: 'address', name: 'Address'},
        {id: 4, key: 'locality', name: 'Locality'},
        {id: 5, key: 'project', name: 'Project or Society Name'},
        {id: 6, key: 'configuration', name: 'Configuration'},
        {id: 7, key: 'area', name: 'Area'},
        {id: 8, key: 'status', name: 'Status'},
        {id: 9, key: 'furnished', name: 'Furnished'},
        {id: 10, key: 'car_parking', name: 'Car Parking'},
        {id: 11, key: 'facing', name: 'Facing'},
    ];

    const renderModalContent = () => {
        switch (selectedItem) {
            case "price":
            case "message":
            case "address":
            case "locality":
            case "project":
            case "configuration":
            case "area":
            case "status":
            case "furnished":
            case "facing":
                return (
                    <>
                        <label>Enter the value for {selectedItem}:</label>
                        <input
                            type="text"
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) => setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: e.target.value,
                            }))}
                            placeholder={`Edit ${selectedItem}`}
                            className="modal-input"
                        />
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
                                    checked={inputValue[selectedItem]?.covered || false}
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
                                    checked={inputValue[selectedItem]?.open || false}
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
                                    checked={inputValue[selectedItem]?.none || false}
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
                    <h2 style={{ marginLeft: "30px" }}>Abouts</h2>
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
                <div className="col-lg-4"></div>
            </div>

            {/* Modal for editing */}
            <Modal show={modalIsOpen} onHide={closeModal} size="xxl" centered>
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
