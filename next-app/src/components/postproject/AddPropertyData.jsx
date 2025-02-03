import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { facingOptions } from "../post/PropertyData";

const AddPropertyData = ({ show, onClose, projectId, projectName, projectLocation }) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [towers, setTowers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];

  useEffect(() => {
    if (projectId && memberId) FetchProjectPropertyData(projectId);
  }, [projectId, memberId]);

  const FetchProjectPropertyData = async (projectId) => {
    try {
      const response = await callApi({
        api: `/get-project-properties`,
        method: "GET",
        data: { user_id: memberId, project_id: projectId },
      });

      if (response?.status === 1) {
        const initializedTowers = response.data?.towerdata?.map(tower => ({
          ...tower,
          flats: tower.flats?.map(flat => ({
            ...flat,
            bhk_configurations: flat.bhk_configurations?.map(bhk => ({
              ...bhk,
              property_facing: bhk.property_facing || "",
            })) || [],
          })) || [],
        })) || [];

        setTowers(initializedTowers.length ? initializedTowers : [createNewTower()]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const createNewTower = () => ({
    tower_name: "",
    lift_no: 1,
    stair_no: 1,
    fire_safety: 1,
    flats: [createNewFlat()],
  });

  const createNewFlat = () => ({
    flat_no: "",
    floor_no: "", // Adding floor_no for flat configuration
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
      tower.flats.forEach((flat, fIdx) => {
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
        });
      });
    });

    setValidationErrors(errors);
    setIsFormValid(isValid);
  };

  const handleTowerChange = (towerIndex, field, value) => {
    setTowers(prev => prev.map((tower, idx) =>
      idx === towerIndex ? { ...tower, [field]: value } : tower
    ));
  };

  const addFlat = (towerIndex) => {
    setTowers(prev => prev.map((tower, idx) =>
      idx === towerIndex ? { ...tower, flats: [...tower.flats, createNewFlat()] } : tower
    ));
  };

  const addBHKConfiguration = (towerIndex, flatIndex) => {
    setTowers(prev => prev.map((tower, tIdx) => {
      if (tIdx !== towerIndex) return tower;
      return {
        ...tower,
        flats: tower.flats.map((flat, fIdx) => {
          if (fIdx !== flatIndex) return flat;
          return {
            ...flat,
            bhk_configurations: [...flat.bhk_configurations, createNewBHK()]
          };
        })
      };
    }));
  };

  const handleFlatChange = (towerIndex, flatIndex, field, value) => {
    setTowers(prev => prev.map((tower, tIdx) => {
      if (tIdx !== towerIndex) return tower;
      return {
        ...tower,
        flats: tower.flats.map((flat, fIdx) =>
          fIdx === flatIndex ? { ...flat, [field]: value } : flat
        )
      };
    }));
  };

  const handleBHKChange = (towerIndex, flatIndex, bhkIndex, field, value) => {
    setTowers(prev => prev.map((tower, tIdx) => {
      if (tIdx !== towerIndex) return tower;
      return {
        ...tower,
        flats: tower.flats.map((flat, fIdx) => {
          if (fIdx !== flatIndex) return flat;
          return {
            ...flat,
            bhk_configurations: flat.bhk_configurations.map((bhk, bIdx) =>
              bIdx === bhkIndex ? { ...bhk, [field]: value } : bhk
            )
          };
        })
      };
    }));
  };

  const removeFlat = (towerIndex, flatIndex) => {
    setTowers(prev => prev.map((tower, tIdx) => {
      if (tIdx !== towerIndex) return tower;
      return {
        ...tower,
        flats: tower.flats.filter((_, fIdx) => fIdx !== flatIndex)
      };
    }));
  };

  const removeBHKConfiguration = (towerIndex, flatIndex, bhkIndex) => {
    setTowers(prev => prev.map((tower, tIdx) => {
      if (tIdx !== towerIndex) return tower;
      return {
        ...tower,
        flats: tower.flats.map((flat, fIdx) => {
          if (fIdx !== flatIndex) return flat;
          return {
            ...flat,
            bhk_configurations: flat.bhk_configurations.filter((_, bIdx) => bIdx !== bhkIndex)
          };
        })
      };
    }));
  };

  const handleSave = async () => {
    const payload = towers.map(tower => ({
      ...tower,
      projectName,
      projectLocation,
      flats: tower.flats.map(flat => ({
        ...flat,
        bhk_configurations: flat.bhk_configurations.map(bhk => ({
          ...bhk,
          carpet_area: Number(bhk.carpet_area),
          super_area: Number(bhk.super_area),
          property_price: Number(bhk.property_price),
        }))
      }))
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
        <Modal.Title>Property Configuration</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="mb-4 p-3 border rounded">
            {/* Tower Configuration */}
            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label>Tower Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={tower.tower_name}
                  onChange={(e) => handleTowerChange(towerIndex, "tower_name", e.target.value)}
                />
                {validationErrors[`tower_name_${towerIndex}`] && (
                  <div className="text-danger small">{validationErrors[`tower_name_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <label>Lift Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={tower.lift_no}
                  onChange={(e) => handleTowerChange(towerIndex, "lift_no", e.target.value)}
                />
                {validationErrors[`lift_no_${towerIndex}`] && (
                  <div className="text-danger small">{validationErrors[`lift_no_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <label>Stair Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={tower.stair_no}
                  onChange={(e) => handleTowerChange(towerIndex, "stair_no", e.target.value)}
                />
                {validationErrors[`stair_no_${towerIndex}`] && (
                  <div className="text-danger small">{validationErrors[`stair_no_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <label>Fire Safety</label>
                <input
                  type="number"
                  className="form-control"
                  value={tower.fire_safety}
                  onChange={(e) => handleTowerChange(towerIndex, "fire_safety", e.target.value)}
                />
                {validationErrors[`fire_safety_${towerIndex}`] && (
                  <div className="text-danger small">{validationErrors[`fire_safety_${towerIndex}`]}</div>
                )}
              </div>
            </div>

            {/* Flats Section */}
            <div className="mb-4">
              <h6>Flats Configuration</h6>
              {tower.flats.map((flat, flatIndex) => (
                <div key={flatIndex} className="border p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6>Flat {flatIndex + 1}</h6>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => removeFlat(towerIndex, flatIndex)}
                    >
                      Remove Floor
                    </Button>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label>Floor Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={flat.floor_no}
                        onChange={(e) => handleFlatChange(towerIndex, flatIndex, "floor_no", e.target.value)}
                      />
                      {validationErrors[`floor_no_${towerIndex}_${flatIndex}`] && (
                        <div className="text-danger small">{validationErrors[`floor_no_${towerIndex}_${flatIndex}`]}</div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <label>Flat Per Floor</label>
                      <input
                        type="text"
                        className="form-control"
                        value={flat.flat_no}
                        onChange={(e) => handleFlatChange(towerIndex, flatIndex, "flat_no", e.target.value)}
                      />
                      {validationErrors[`flat_no_${towerIndex}_${flatIndex}`] && (
                        <div className="text-danger small">{validationErrors[`flat_no_${towerIndex}_${flatIndex}`]}</div>
                      )}
                    </div>
                  </div>

                  {/* BHK Configurations */}
                  {flat.bhk_configurations.map((bhk, bhkIndex) => (
                    <div key={bhkIndex} className="row g-3 mb-3">
                      <div className="col-md-2">
                        <label>BHK Type</label>
                        <select
                          className="form-control"
                          value={bhk.bhk_type}
                          onChange={(e) => handleBHKChange(towerIndex, flatIndex, bhkIndex, "bhk_type", e.target.value)}
                        >
                          {bhkTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-2">
                        <label>Carpet Area</label>
                        <input
                          type="number"
                          className="form-control"
                          value={bhk.carpet_area}
                          onChange={(e) => handleBHKChange(towerIndex, flatIndex, bhkIndex, "carpet_area", e.target.value)}
                        />
                      </div>

                      <div className="col-md-2">
                        <label>Super Area</label>
                        <input
                          type="number"
                          className="form-control"
                          value={bhk.super_area}
                          onChange={(e) => handleBHKChange(towerIndex, flatIndex, bhkIndex, "super_area", e.target.value)}
                        />
                      </div>

                      <div className="col-md-2">
                        <label>Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={bhk.property_price}
                          onChange={(e) => handleBHKChange(towerIndex, flatIndex, bhkIndex, "property_price", e.target.value)}
                        />
                      </div>

                      <div className="col-md-2">
                        <label>Facing</label>
                        <select
                          className="form-control"
                          value={bhk.property_facing}
                          onChange={(e) => handleBHKChange(towerIndex, flatIndex, bhkIndex, "property_facing", e.target.value)}
                        >
                          {facingOptions.map((facing, index) => (
                            <option key={index} value={facing?.key}>{facing?.value}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-2">
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeBHKConfiguration(towerIndex, flatIndex, bhkIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => addBHKConfiguration(towerIndex, flatIndex)}
                  >
                    Add BHK Configuration
                  </Button>
                </div>
              ))}

              <Button 
                variant="success" 
                size="sm"
                onClick={() => addFlat(towerIndex)}
              >
                Add Floor Data
              </Button>
            </div>
          </div>
        ))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={!isFormValid}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
