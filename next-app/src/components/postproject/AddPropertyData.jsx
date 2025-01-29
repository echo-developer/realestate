import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";

const AddPropertyData = ({ show, onClose, projectId }) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [towers, setTowers] = useState([]);
  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [totalTowers, setTotalTowers] = useState(null);

  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
  const facingOptions = ["North", "South", "East", "West"];

  useEffect(() => {
    if (projectId) FetchProjectPropertyData(projectId);
  }, [projectId]);

  const FetchProjectPropertyData = async (projectId) => {
    try {
      const response = await callApi({
        api: `/get-project-properties`,
        method: "GET",
        data: { user_id: memberId || "2", project_id: projectId },
      });

      if (response?.status === 1) {
        setTotalTowers(response.data.totalTowers);  // Setting totalTowers from the API response
        const initializedTowers = response.data.towerdata.map((tower) => ({
          ...tower,
          bhk_type_data: tower.bhk_type_data.map((bhk) => ({
            ...bhk,
            property_facing: bhk.property_facing || "",
          })),
        }));

        setTowers(initializedTowers);
        setSelectedBHKs(
          initializedTowers.map((t) => t.bhk_type_data[0]?.bhk_type || "1BHK")
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    towers.forEach((tower, tIdx) => {
      if (!tower.tower_name?.trim()) {
        errors[`tower_name_${tIdx}`] = "Tower name required";
        isValid = false;
      }
      if (!tower.lift_no || tower.lift_no < 1) {
        errors[`lift_no_${tIdx}`] = "Invalid lift number";
        isValid = false;
      }
      if (!tower.floor_no || tower.floor_no < 1) {
        errors[`floor_no_${tIdx}`] = "Invalid floor number";
        isValid = false;
      }
      if (!tower.flats_per_floor || tower.flats_per_floor < 1) {
        errors[`flats_${tIdx}`] = "Invalid flats per floor";
        isValid = false;
      }

      tower.bhk_type_data.forEach((bhk, bIdx) => {
        if (!bhk.bhk_type) {
          errors[`bhk_type_${tIdx}_${bIdx}`] = "BHK type required";
          isValid = false;
        }
        if (!bhk.carpet_area || bhk.carpet_area < 1) {
          errors[`carpet_${tIdx}_${bIdx}`] = "Invalid carpet area";
          isValid = false;
        }
        if (!bhk.super_area || bhk.super_area < 1) {
          errors[`super_${tIdx}_${bIdx}`] = "Invalid super area";
          isValid = false;
        }
        if (!bhk.property_price || bhk.property_price < 1) {
          errors[`price_${tIdx}_${bIdx}`] = "Invalid price";
          isValid = false;
        }
      });
    });

    setValidationErrors(errors);
    setIsFormValid(isValid);
  };

  const handleTowerChange = (towerIndex, field, value) => {
    setTowers((prev) =>
      prev.map((tower, idx) =>
        idx === towerIndex ? { ...tower, [field]: value } : tower
      )
    );
  };

  const handleBHKChange = (towerIndex, bhkIndex, field, value) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          bhk_type_data: tower.bhk_type_data.map((bhk, bIdx) =>
            bIdx === bhkIndex ? { ...bhk, [field]: value } : bhk
          ),
        };
      })
    );
  };

  const addBHKConfiguration = (towerIndex) => {
    setTowers((prev) =>
      prev.map((tower, idx) => {
        if (idx !== towerIndex) return tower;
        return {
          ...tower,
          bhk_type_data: [
            ...tower.bhk_type_data,
            {
              bhk_type: selectedBHKs[towerIndex],
              carpet_area: "",
              super_area: "",
              property_price: "",
              property_facing: "",
            },
          ],
        };
      })
    );
  };

  const removeBHKConfiguration = (towerIndex, bhkIndex) => {
    setTowers((prev) =>
      prev.map((tower, idx) => {
        if (idx !== towerIndex) return tower;
        return {
          ...tower,
          bhk_type_data: tower.bhk_type_data.filter((_, i) => i !== bhkIndex),
        };
      })
    );
  };

  const handleSave = async () => {
    const payload = towers.map((tower) => ({
      ...tower,
      lift_no: Number(tower.lift_no),
      floor_no: Number(tower.floor_no),
      flats_per_floor: Number(tower.flats_per_floor),
      bhk_type_data: tower.bhk_type_data.map((bhk) => ({
        ...bhk,
        carpet_area: Number(bhk.carpet_area),
        super_area: Number(bhk.super_area),
        property_price: Number(bhk.property_price),
      })),
    }));

    try {
      await callApi({
        api: "/save-project-property",
        method: "POST",
        data: {
          user_id: memberId,
          project_id: projectId,
          tower_data: JSON.stringify(payload),
        },
      });
      onClose();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  useEffect(() => validateForm(), [towers]);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Property Configuration</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {towers.length > 0 ? (
          towers.map((tower, towerIndex) => (
            <div key={towerIndex} className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{tower.tower_name} Configuration</h5>
              </div>

              {/* Tower Configuration */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label>Tower Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tower.tower_name}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "tower_name", e.target.value)
                    }
                  />
                  {validationErrors[`tower_name_${towerIndex}`] && (
                    <div className="text-danger small">
                      {validationErrors[`tower_name_${towerIndex}`]}
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <label>Lifts</label>
                  <input
                    type="number"
                    className="form-control"
                    value={tower.lift_no}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "lift_no", e.target.value)
                    }
                  />
                  {validationErrors[`lift_no_${towerIndex}`] && (
                    <div className="text-danger small">
                      {validationErrors[`lift_no_${towerIndex}`]}
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <label>Floors</label>
                  <input
                    type="number"
                    className="form-control"
                    value={tower.floor_no}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "floor_no", e.target.value)
                    }
                  />
                  {validationErrors[`floor_no_${towerIndex}`] && (
                    <div className="text-danger small">
                      {validationErrors[`floor_no_${towerIndex}`]}
                    </div>
                  )}
                </div>

                <div className="col-md-3">
                  <label>Flats/Floor</label>
                  <input
                    type="number"
                    className="form-control"
                    value={tower.flats_per_floor}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "flats_per_floor", e.target.value)
                    }
                  />
                  {validationErrors[`flats_${towerIndex}`] && (
                    <div className="text-danger small">
                      {validationErrors[`flats_${towerIndex}`]}
                    </div>
                  )}
                </div>
              </div>

              {/* BHK Configurations */}
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Unit Types</h6>
                  <div>
                    {bhkTypes.map((bhk) => (
                      <Button
                        key={bhk}
                        variant={selectedBHKs[towerIndex] === bhk ? "primary" : "outline-secondary"}
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          setSelectedBHKs((prev) =>
                            prev.map((val, idx) => (idx === towerIndex ? bhk : val))
                          )
                        }
                      >
                        {bhk}
                      </Button>
                    ))}
                  </div>
                </div>

                {tower.bhk_type_data.map((bhk, bhkIndex) => (
                  <div key={bhkIndex} className="row g-3 mb-3">
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Carpet Area"
                        value={bhk.carpet_area}
                        onChange={(e) =>
                          handleBHKChange(towerIndex, bhkIndex, "carpet_area", e.target.value)
                        }
                      />
                      {validationErrors[`carpet_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`carpet_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Super Area"
                        value={bhk.super_area}
                        onChange={(e) =>
                          handleBHKChange(towerIndex, bhkIndex, "super_area", e.target.value)
                        }
                      />
                      {validationErrors[`super_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`super_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        value={bhk.property_price}
                        onChange={(e) =>
                          handleBHKChange(towerIndex, bhkIndex, "property_price", e.target.value)
                        }
                      />
                      {validationErrors[`price_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`price_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <select
                        className="form-control"
                        value={bhk.property_facing}
                        onChange={(e) =>
                          handleBHKChange(towerIndex, bhkIndex, "property_facing", e.target.value)
                        }
                      >
                        <option value="">Facing</option>
                        {facingOptions.map((facing) => (
                          <option key={facing} value={facing}>
                            {facing}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-1">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeBHKConfiguration(towerIndex, bhkIndex)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => addBHKConfiguration(towerIndex)}
                >
                  Add {selectedBHKs[towerIndex]} Configuration
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No towers available.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isFormValid}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
