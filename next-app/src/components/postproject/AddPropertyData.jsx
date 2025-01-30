import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { facingOptions } from "../post/PropertyData";
import { v4 as uuidv4 } from "uuid";

const AddPropertyData = ({ show, onClose, projectId }) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [towers, setTowers] = useState([]);
  const [totalTowers, setTotalTowers] = useState();
  const [selectedBHKs, setSelectedBHKs] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];

  useEffect(() => {
    if (projectId && memberId) FetchProjectPropertyData(projectId);
  }, [projectId ,memberId]);

  const FetchProjectPropertyData = async (projectId) => {
    try {
      const response = await callApi({
        api: `/get-project-properties`,
        method: "GET",
        data: { user_id: memberId, project_id: projectId },
      });   
      if (response?.status === 1) {
        const fetchedTowers = response?.data?.towerdata || [];
        const initializedTowers = fetchedTowers.length
          ? fetchedTowers.map((tower) => ({
              ...tower,
              bhk_type_data: tower.bhk_type_data.map((bhk) => ({
                ...bhk,
                property_facing: bhk.property_facing || "",
              })),
            }))
          : [];

        if (initializedTowers.length === 0) {
          const defaultTower = {
            tower_name: "",
            lift_no: 1,
            floor_no: 1,
            flats_per_floor: 1,
            bhk_type_data: [
              {
                bhk_type: "1BHK",
                carpet_area: "",
                super_area: "",
                property_price: "",
                property_facing: "",
              },
            ],
          };
          initializedTowers.push(defaultTower);
        }

        setTowers(initializedTowers);
        setTotalTowers(response?.data?.totalTowers);
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
    setTowers((prev) => {
      if (towerIndex >= prev.length) {
        return [
          ...prev,
          {
            [field]: value,
            tower_name: "",
            lift_no: 1,
            floor_no: 1,
            flats_per_floor: 1,
            bhk_type_data: [],
          },
        ];
      } else {
        return prev.map((tower, idx) =>
          idx === towerIndex ? { ...tower, [field]: value } : tower
        );
      }
    });
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
              bhk_type: selectedBHKs[towerIndex] || "1BHK",
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
        {totalTowers > 0 ? (
          Array.from({ length: totalTowers }).map((_, towerIndex) => (
            <div key={towerIndex} className="mb-4 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>{`Tower ${towerIndex + 1} Configuration`}</h5>
              </div>

              {/* Tower Configuration */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <label>Tower Name</label>
                  <input
                    type="text"
                    key={"tower_name" + towerIndex}
                    className="form-control"
                    value={towers[towerIndex]?.tower_name || ""}
                    onChange={(e) =>
                      handleTowerChange(
                        towerIndex,
                        "tower_name",
                        e.target.value
                      )
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
                    value={towers[towerIndex]?.lift_no || ""}
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
                    value={towers[towerIndex]?.floor_no || ""}
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
                    value={towers[towerIndex]?.flats_per_floor || ""}
                    onChange={(e) =>
                      handleTowerChange(
                        towerIndex,
                        "flats_per_floor",
                        e.target.value
                      )
                    }
                  />
                  {validationErrors[`flats_${towerIndex}`] && (
                    <div className="text-danger small">
                      {validationErrors[`flats_${towerIndex}`]}
                    </div>
                  )}
                </div>
              </div>

              {/* BHK Configuration */}
              {towers[towerIndex]?.bhk_type_data?.length > 0 ? (
                towers[towerIndex]?.bhk_type_data.map((bhk, bhkIndex) => (
                  <div key={bhk.id} className="row g-3 mb-4">
                    <div className="col-md-2">
                      <label>BHK Type</label>
                      <select
                        className="form-control"
                        value={bhk.bhk_type}
                        onChange={(e) =>
                          handleBHKChange(
                            towerIndex,
                            bhkIndex,
                            "bhk_type",
                            e.target.value
                          )
                        }
                      >
                        {bhkTypes.map((bhkType) => (
                          <option key={bhkType} value={bhkType}>
                            {bhkType}
                          </option>
                        ))}
                      </select>
                      {validationErrors[
                        `bhk_type_${towerIndex}_${bhkIndex}`
                      ] && (
                        <div className="text-danger small">
                          {
                            validationErrors[
                              `bhk_type_${towerIndex}_${bhkIndex}`
                            ]
                          }
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <label>Carpet Area</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bhk.carpet_area || ""}
                        onChange={(e) =>
                          handleBHKChange(
                            towerIndex,
                            bhkIndex,
                            "carpet_area",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`carpet_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`carpet_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <label>Super Area</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bhk.super_area || ""}
                        onChange={(e) =>
                          handleBHKChange(
                            towerIndex,
                            bhkIndex,
                            "super_area",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`super_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`super_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <label>Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={bhk.property_price || ""}
                        onChange={(e) =>
                          handleBHKChange(
                            towerIndex,
                            bhkIndex,
                            "property_price",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[`price_${towerIndex}_${bhkIndex}`] && (
                        <div className="text-danger small">
                          {validationErrors[`price_${towerIndex}_${bhkIndex}`]}
                        </div>
                      )}
                    </div>

                    <div className="col-md-2">
                      <label>Facing</label>
                      <select
                        className="form-control"
                        value={bhk.property_facing}
                        onChange={(e) =>
                          handleBHKChange(
                            towerIndex,
                            bhkIndex,
                            "property_facing",
                            e.target.value
                          )
                        }
                      >
                        {facingOptions.map((facing) => (
                          <option key={facing.key} value={facing.key}>
                            {facing.value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-1 d-flex align-items-end">
                      <Button
                        variant="danger"
                        onClick={() =>
                          removeBHKConfiguration(towerIndex, bhkIndex)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted ">No BHK configurations available.</p>
              )}

              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={() => addBHKConfiguration(towerIndex)}
                >
                  Add BHK Configuration
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center">No tower configurations found.</p>
        )}

        <div className="d-flex justify-content-end">
          <Button
            variant="success"
            disabled={!isFormValid}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddPropertyData;
