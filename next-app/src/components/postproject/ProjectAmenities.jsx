import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";

export const CustomLoader = () => {
  const translation = useTranslation();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
      }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">
          {translation?.loading || "Loading...."}{" "}
        </span>
      </div>
    </div>
  );
};

const ProjectAmenities = ({ show, onClose, projectId }) => {
  const [amenityData, setAmenityData] = useState([]);
  const [formData, setFormData] = useState({ project_amenity: [] });
  const [loading, setLoading] = useState(true);
  const { callApi } = AuthUser();
  const translation = useTranslation();
  useEffect(() => {
    if (projectId) {
      fetchAmenityData(projectId);
    }
  }, [projectId]);

  const fetchAmenityData = async (projectId) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/get_property_amenity`,
        method: "GET",
        data: { project_id: projectId },
      });
      if (response && response.status === 1) {
        const selectedAmenities = response.project_amenity_ids || [];
        setFormData({ project_amenity: selectedAmenities });
        setAmenityData(response.amenity_options || []);
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Failed to fetch amenities.");
      }
    } catch (error) {
      console.error("Failed to fetch amenity data", error);
      toast.error("Error fetching amenity data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (amenityId, isChecked) => {
    setFormData((prev) => {
      const updatedAmenities = [...(prev.project_amenity || [])];
      if (isChecked) {
        if (!updatedAmenities.includes(amenityId)) {
          updatedAmenities.push(amenityId);
        }
      } else {
        const index = updatedAmenities.indexOf(amenityId);
        if (index > -1) {
          updatedAmenities.splice(index, 1);
        }
      }
      return { ...prev, project_amenity: updatedAmenities };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/update_amenity?project_id=${projectId}`,
        method: "POST",
        data: { amenity_id: formData.project_amenity },
      });
      if (response && response.status === 1) {
        toast.success("Amenities updated successfully!");
        // Fetch updated amenity data after successful update
        fetchAmenityData(projectId);
      } else {
        toast.error(response?.message || "Failed to update amenities");
      }
    } catch (error) {
      toast.error("Error updating amenities");
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {translation?.add_amenity_data || "Add Amenity Data"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <CustomLoader />
        ) : amenityData?.length > 0 ? (
          amenityData.map((feature) => (
            <div
              key={`amenity_${feature.amenity_id}`}
              className="form-check form-check-inline d-flex align-items-center"
            >
              <input
                className="form-check-input"
                type="checkbox"
                id={`feature-${feature.amenity_id}`}
                checked={formData.property_amenity?.includes(
                  feature.amenity_id
                )}
                onChange={(e) =>
                  handleAmenityChange(feature.amenity_id, e.target.checked)
                }
              />
              <label
                className="form-check-label d-flex align-items-center ms-2"
                htmlFor={`feature-${feature.amenity_id}`}
              >
                <img
                  src={feature?.image || "/assets/images/icons/default.png"}
                  alt={feature?.amenity_name || "Amenity"}
                  height="24"
                  width="24"
                  className="me-2"
                />
                {feature?.amenity_name ||
                  translation?.not_available ||
                  "Not available"}
              </label>
            </div>
          ))
        ) : (
          <p>
            {translation?.no_amentites_available || "No amenities available."}
          </p>
        )}
      </Modal.Body>

      {!loading && (
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            {translation?.cancel || "No amenities available."}
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!formData.project_amenity?.length}
          >
            {translation?.save || "Save"}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ProjectAmenities;
