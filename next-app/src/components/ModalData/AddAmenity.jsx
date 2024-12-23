import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const CustomLoader = () => (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
        }}
    >
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

const AddAmenity = ({ show, onClose }) => {
    const [amenityData, setAmenityData] = useState([]);
    const [formData, setFormData] = useState({ property_amenity: [] });
    const [loading, setLoading] = useState(true);
    const { callApi } = AuthUser();

    useEffect(() => {
        fetchAmenityData();
    }, []);

    const fetchAmenityData = async () => {
        setLoading(true);
        try {
            const response = await callApi({
                api: `/get_property_amenity`,
                method: "GET",
                data: {
                    property_id: 1,
                },
            });
            console.log(response);
            if (response && response?.status === 1) {
                const selectedAmenities =
                    response?.amenity_id?.map((id) => parseInt(id, 10)) || [];
                setFormData({ property_amenity: selectedAmenities });
                setAmenityData(response?.amenity_options || []);
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Failed to fetch amenity data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAmenityChange = (amenityId, isChecked) => {
        setFormData((prev) => {
            const updatedAmenities = [...(prev.property_amenity || [])];
            if (isChecked) {
                updatedAmenities.push(amenityId);
            } else {
                const index = updatedAmenities.indexOf(amenityId);
                if (index > -1) {
                    updatedAmenities.splice(index, 1);
                }
            }
            return { ...prev, property_amenity: updatedAmenities };
        });
    };

    const handleSave = async () => {
        setLoading(true)
        let response;
        try {
            response = await callApi({
                api: `/update_property_amenity?id=${3}`,
                method: "POST",
                data: {
                    amenity_id: formData.property_amenity,
                },
            });
            if (response && response.status === 1) {
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        } finally {
            onClose();
            setLoading(false)
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Amenity Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <CustomLoader />
                ) : amenityData?.length > 0 ? (
                    amenityData.map((feature) => (
                        <div
                            key={`amenity_${feature.amenity_id}`}
                            className="form-check form-check-inline"
                        >
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id={`feature-${feature.amenity_id}`}
                                checked={formData.property_amenity?.includes(
                                    feature.amenity_id
                                )}
                                onChange={(e) =>
                                    handleAmenityChange(
                                        feature.amenity_id,
                                        e.target.checked
                                    )
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`feature-${feature.amenity_id}`}
                            >
                                {feature.amenity_name}
                            </label>
                        </div>
                    ))
                ) : (
                    <p>No amenities available.</p>
                )}
            </Modal.Body>
            {!loading && (
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={!formData.property_amenity?.length}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default AddAmenity;
