import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { facingOptions } from "../post/PropertyData";
import CustomLoading from "../LoadingSpinner/CustomLoading";

const AddPropertyData = ({
  show,
  onClose,
  projectId,
  projectName,
  projectLocation,
}) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [towers, setTowers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];

  useEffect(() => {
    if (projectId && memberId) FetchProjectPropertyData(projectId);
  }, [projectId, memberId]);
  

  const FetchProjectPropertyData = async (projectId) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: "/get-project-properties",
        method: "GET",
        data: { user_id: memberId, project_id: projectId },
      });

      if (response?.status === 1) {
        const initializedTowers = response.data.map((tower) => ({
          ...tower,
          floor_data: tower.floor_data.map((flat) => ({
            ...flat,
            bhk_configurations: flat.bhk_configurations.map((bhk) => ({
              ...bhk,
              property_facing: bhk.property_facing || "",
            })),
          })),
        }));
  
        setTowers(initializedTowers.length ? initializedTowers : [createNewTower()]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTower = () => ({
    tower_name: "",
    lift_no: 1,
    stair_no: 1,
    fire_safety: 1,
    floor_data: [createNewFlat()],
  });

  const createNewFlat = () => ({
    flat_no: "",
    floor_no: "",
    bhk_configurations: [createNewBHK()],
  });

  const createNewBHK = () => ({
    bhk_type: "1BHK",
    carpet_area: "",
    super_area: "",
    property_price: "",
    property_facing: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    towers.forEach((tower, tIdx) => {
      // Tower validation
      if (!tower.tower_name?.trim()) {
        errors[`tower_name_${tIdx}`] = "Tower name required";
        isValid = false;
      }
      if (!tower.lift_no || tower.lift_no < 1) {
        errors[`lift_no_${tIdx}`] = "Lift number must be greater than 0";
        isValid = false;
      }
      if (!tower.stair_no || tower.stair_no < 1) {
        errors[`stair_no_${tIdx}`] = "Stair number must be greater than 0";
        isValid = false;
      }
      if (tower.fire_safety !== 1 && tower.fire_safety !== 0) {
        errors[`fire_safety_${tIdx}`] = "Invalid fire safety status";
        isValid = false;
      }

      // Flat validation
      tower.floor_data.forEach((flat, fIdx) => {
        if (!flat.flat_no) {
          errors[`flat_no_${tIdx}_${fIdx}`] = "Flat number required";
          isValid = false;
        }
        if (!flat.floor_no) {
          errors[`floor_no_${tIdx}_${fIdx}`] = "Floor number required";
          isValid = false;
        }

        // BHK validation
        flat.bhk_configurations.forEach((bhk, bIdx) => {
          if (!bhk.bhk_type) {
            errors[`bhk_type_${tIdx}_${fIdx}_${bIdx}`] = "BHK type required";
            isValid = false;
          }
          if (!bhk.carpet_area || bhk.carpet_area < 1) {
            errors[`carpet_${tIdx}_${fIdx}_${bIdx}`] = "Invalid carpet area";
            isValid = false;
          }
          if (!bhk.super_area || bhk.super_area < 1) {
            errors[`super_${tIdx}_${fIdx}_${bIdx}`] = "Invalid super area";
            isValid = false;
          }
          if (!bhk.property_price || bhk.property_price < 1) {
            errors[`price_${tIdx}_${fIdx}_${bIdx}`] = "Invalid price";
            isValid = false;
          }
          if (!bhk.property_facing) {
            errors[`facing_${tIdx}_${fIdx}_${bIdx}`] =
              "Property facing is required";
            isValid = false;
          }
        });
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

  const addFlat = (towerIndex) => {
    setTowers((prev) =>
      prev.map((tower, idx) =>
        idx === towerIndex
          ? { ...tower, floor_data: [...tower.floor_data, createNewFlat()] }
          : tower
      )
    );
  };

  const addBHKConfiguration = (towerIndex, flatIndex) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          floor_data: tower.floor_data.map((flat, fIdx) => {
            if (fIdx !== flatIndex) return flat;
            return {
              ...flat,
              bhk_configurations: [...flat.bhk_configurations, createNewBHK()],
            };
          }),
        };
      })
    );
  };

  const handleFlatChange = (towerIndex, flatIndex, field, value) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          floor_data: tower.floor_data.map((flat, fIdx) =>
            fIdx === flatIndex ? { ...flat, [field]: value } : flat
          ),
        };
      })
    );
  };

  const handleBHKChange = (towerIndex, flatIndex, bhkIndex, field, value) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          floor_data: tower.floor_data.map((flat, fIdx) => {
            if (fIdx !== flatIndex) return flat;
            return {
              ...flat,
              bhk_configurations: flat.bhk_configurations.map((bhk, bIdx) =>
                bIdx === bhkIndex ? { ...bhk, [field]: value } : bhk
              ),
            };
          }),
        };
      })
    );
  };

  const removeFlat = (towerIndex, flatIndex) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          floor_data: tower.floor_data.filter((_, fIdx) => fIdx !== flatIndex),
        };
      })
    );
  };

  const removeBHKConfiguration = (towerIndex, flatIndex, bhkIndex) => {
    setTowers((prev) =>
      prev.map((tower, tIdx) => {
        if (tIdx !== towerIndex) return tower;
        return {
          ...tower,
          floor_data: tower.floor_data.map((flat, fIdx) => {
            if (fIdx !== flatIndex) return flat;
            return {
              ...flat,
              bhk_configurations: flat.bhk_configurations.filter(
                (_, bIdx) => bIdx !== bhkIndex
              ),
            };
          }),
        };
      })
    );
  };

  const handleSave = async () => {
    const payload = towers.map((tower) => ({
      ...tower,
      projectName,
      projectLocation,
      floor_data: tower.floor_data.map((flat) => ({
        ...flat,
        bhk_configurations: flat.bhk_configurations.map((bhk) => ({
          ...bhk,
          carpet_area: Number(bhk.carpet_area),
          super_area: Number(bhk.super_area),
          property_price: Number(bhk.property_price),
        })),
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

  if (loading) {
    return <CustomLoading />;
  }

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Property Configuration</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="mb-4 p-1 border rounded">
            {/* Tower Configuration */}
            <div className="row g-1 mb-3">
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
                <label>Lift Number</label>
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
                <label>Stair Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={tower.stair_no}
                  onChange={(e) =>
                    handleTowerChange(towerIndex, "stair_no", e.target.value)
                  }
                />
                {validationErrors[`stair_no_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`stair_no_${towerIndex}`]}
                  </div>
                )}
              </div>
              <div className="col-md-3">
                <label>Fire Safety</label>
                <input
                  type="number"
                  className="form-control"
                  value={tower.fire_safety}
                  onChange={(e) =>
                    handleTowerChange(towerIndex, "fire_safety", e.target.value)
                  }
                />
                {validationErrors[`fire_safety_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`fire_safety_${towerIndex}`]}
                  </div>
                )}
              </div>
            </div>

            {/* Floor Section */}
            <div className="mb-4">
              <h6>Floor Configuration</h6>
              {tower.floor_data.map((flat, flatIndex) => (
                <div key={flatIndex} className="border p-1 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Floor {flatIndex + 1}</h6>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFlat(towerIndex, flatIndex)}
                    >
                      Remove Floor
                    </Button>
                  </div>

                  <div className="row g-1 mb-3">
                    <div className="col-md-3">
                      <label>Floor Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={flat.floor_no}
                        onChange={(e) =>
                          handleFlatChange(
                            towerIndex,
                            flatIndex,
                            "floor_no",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[
                        `floor_no_${towerIndex}_${flatIndex}`
                      ] && (
                        <div className="text-danger small">
                          {
                            validationErrors[
                              `floor_no_${towerIndex}_${flatIndex}`
                            ]
                          }
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <label>Flat Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={flat.flat_no}
                        onChange={(e) =>
                          handleFlatChange(
                            towerIndex,
                            flatIndex,
                            "flat_no",
                            e.target.value
                          )
                        }
                      />
                      {validationErrors[
                        `flat_no_${towerIndex}_${flatIndex}`
                      ] && (
                        <div className="text-danger small">
                          {
                            validationErrors[
                              `flat_no_${towerIndex}_${flatIndex}`
                            ]
                          }
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BHK Configurations */}
                  {flat.bhk_configurations.map((bhk, bhkIndex) => (
                    <div key={bhkIndex} className="border p-1 mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6>Flats {bhkIndex + 1}</h6>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            removeBHKConfiguration(
                              towerIndex,
                              flatIndex,
                              bhkIndex
                            )
                          }
                        >
                          Remove Flats
                        </Button>
                      </div>

                      <div className="row g-1 mb-3">
                        <div className="col-md-3">
                          <label>BHK Type</label>
                          <select
                            className="form-control"
                            value={bhk.bhk_type}
                            onChange={(e) =>
                              handleBHKChange(
                                towerIndex,
                                flatIndex,
                                bhkIndex,
                                "bhk_type",
                                e.target.value
                              )
                            }
                          >
                            {bhkTypes.map((type, idx) => (
                              <option key={idx} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                          {validationErrors[
                            `bhk_type_${towerIndex}_${flatIndex}_${bhkIndex}`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `bhk_type_${towerIndex}_${flatIndex}_${bhkIndex}`
                                ]
                              }
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label>Carpet Area</label>
                          <input
                            type="number"
                            className="form-control"
                            value={bhk.carpet_area}
                            onChange={(e) =>
                              handleBHKChange(
                                towerIndex,
                                flatIndex,
                                bhkIndex,
                                "carpet_area",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[
                            `carpet_${towerIndex}_${flatIndex}_${bhkIndex}`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `carpet_${towerIndex}_${flatIndex}_${bhkIndex}`
                                ]
                              }
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label>Super Area</label>
                          <input
                            type="number"
                            className="form-control"
                            value={bhk.super_area}
                            onChange={(e) =>
                              handleBHKChange(
                                towerIndex,
                                flatIndex,
                                bhkIndex,
                                "super_area",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[
                            `super_${towerIndex}_${flatIndex}_${bhkIndex}`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `super_${towerIndex}_${flatIndex}_${bhkIndex}`
                                ]
                              }
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label>Price</label>
                          <input
                            type="number"
                            className="form-control"
                            value={bhk.property_price}
                            onChange={(e) =>
                              handleBHKChange(
                                towerIndex,
                                flatIndex,
                                bhkIndex,
                                "property_price",
                                e.target.value
                              )
                            }
                          />
                          {validationErrors[
                            `price_${towerIndex}_${flatIndex}_${bhkIndex}`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `price_${towerIndex}_${flatIndex}_${bhkIndex}`
                                ]
                              }
                            </div>
                          )}
                        </div>

                        <div className="col-md-3">
                          <label>Facing</label>
                          <select
                            className="form-control"
                            value={bhk.property_facing}
                            onChange={(e) =>
                              handleBHKChange(
                                towerIndex,
                                flatIndex,
                                bhkIndex,
                                "property_facing",
                                e.target.value
                              )
                            }
                          >
                            {facingOptions.map((option, idx) => (
                              <option key={idx} value={option?.key}>
                                {option?.value}
                              </option>
                            ))}
                          </select>
                          {validationErrors[
                            `facing_${towerIndex}_${flatIndex}_${bhkIndex}`
                          ] && (
                            <div className="text-danger small">
                              {
                                validationErrors[
                                  `facing_${towerIndex}_${flatIndex}_${bhkIndex}`
                                ]
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addBHKConfiguration(towerIndex, flatIndex)}
                  >
                    Add BHK
                  </Button>
                </div>
              ))}
              <Button
                variant="success"
                size="sm"
                onClick={() => addFlat(towerIndex)}
              >
                Add Floor
              </Button>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isFormValid}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
