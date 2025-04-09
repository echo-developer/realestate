import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { facingOptions } from "../post/PropertyData";
import CustomLoading from "../LoadingSpinner/CustomLoading";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";

const AddPropertyData = ({
  show,
  onClose,
  projectId,
  projectName,
  projectLocation,
  totalTowers
}) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [towers, setTowers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(true);
const translation = useTranslation();
  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];

  useEffect(() => {
    if (projectId && memberId) FetchProjectPropertyData(projectId);
  }, [projectId, memberId]);

  useEffect(() => {
    if (totalTowers) {
      setTowers(Array.from({ length: totalTowers }, () => createNewTower()));
    }
  }, [totalTowers]);

  const FetchProjectPropertyData = async (projectId) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: "/get-project-properties",
        method: "GET",
        data: { user_id: memberId, project_id: projectId },
      });

      if (response?.status === 1 && response.data.length > 0) {
        // Initialize towers based on fetched data
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
        const filledTowers =
          initializedTowers.length < totalTowers
            ? [...initializedTowers, ...Array.from({ length: totalTowers - initializedTowers.length }, createNewTower)]
            : initializedTowers;

        setTowers(filledTowers);
      } else {
        // Initialize towers based on totalTowers if no data from API
        setTowers(Array.from({ length: totalTowers }, () => createNewTower()));
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBhkImgUpload = async (e, bhkIndex, floorIndex, towerIndex) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await callApi({
          api: '/upload/floor-plan',
          method: "UPLOAD",
          data: {
            floor_plan_image: file,
          }
        })

        if (res && res?.status === 1) {
          toast.success(res.message || "File uploaded successfully");
          const newBhkState = towers[towerIndex]?.floor_data?.[floorIndex]?.bhk_configurations?.[bhkIndex];
          newBhkState.floor_plan_image = res?.files || "",
            newBhkState.image_url = res?.image_url || "";

          const newState = towers.map((tower, i) => {
            if (towerIndex !== i) {
              return tower;
            } else {
              return {
                ...tower,
                floor_data: (tower.floor_data.map((floor, f_index) => {
                  if (f_index !== floorIndex) {
                    return floor;
                  } else {
                    return {
                      ...floor,
                      bhk_configurations: (floor.bhk_configurations.map((bhk, b_index) => {
                        if (b_index !== bhkIndex) {
                          return bhk;
                        } else {
                          return newBhkState;
                        }
                      }))
                    }
                  }
                }))
              }
            }
          })
          setTowers(newState);

        }
      } catch (error) {
        toast.error(error.message || "Failed to upload image");
      }
    }
  }

  const handleBhkImgDelete = async (imageName, bhkIndex, floorIndex, towerIndex) => {
    try {
      const res = await callApi({
        api: '/delete/floor-plan-image',
        method: "UPLOAD",
        data: {
          floor_plan_image: imageName
        }
      })

      if (res && res?.status === 1) {
        toast.success(res?.message || "File deleted successfully");
        const newBhkState = towers[towerIndex]?.floor_data?.[floorIndex]?.bhk_configurations?.[bhkIndex];
        newBhkState.floor_plan_image = "",
          newBhkState.image_url = "";

        const newState = towers.map((tower, i) => {
          if (towerIndex !== i) {
            return tower;
          } else {
            return {
              ...tower,
              floor_data: (tower.floor_data.map((floor, f_index) => {
                if (f_index !== floorIndex) {
                  return floor;
                } else {
                  return {
                    ...floor,
                    bhk_configurations: (floor.bhk_configurations.map((bhk, b_index) => {
                      if (b_index !== bhkIndex) {
                        return bhk;
                      } else {
                        return newBhkState;
                      }
                    }))
                  }
                }
              }))
            }
          }
        })
        setTowers(newState);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete image")
    }
  }


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
      if (!tower.fire_safety || tower.fire_safety < 1) {
        errors[`fire_safety_${tIdx}`] = "Fire Safety number must be greater than 0";
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
    const payload = towers.map((tower, i) => ({
      ...tower,
      slug: `tower${i + 1}`,
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
      const res = await callApi({
        api: "/save-project-property",
        method: "POST",
        data: {
          user_id: memberId,
          project_id: projectId,
          tower_data: JSON.stringify(payload),
        },
      });
      if (res && res.status === 1) {
        toast.success(res.message || "Data Update Successfully")
        onClose();
      } else {
        toast.error(res.message || "Data Update failed")
      }
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
        <Modal.Title>{translation?.property_configuration || "Property Configuration"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="mb-4 p-3 border">
            {/* Tower Configuration */}
            <div className="row gx-2">
              <div className="col-md-3 col-sm-6 col-12 mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    value={tower.tower_name}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "tower_name", e.target.value)
                    }
                    placeholder=""
                  />
                  <label>{translation?.tower_name || "Tower Name"}
                  </label>
                </div>
                {validationErrors[`tower_name_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`tower_name_${towerIndex}`]}
                  </div>
                )}
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    value={tower.lift_no}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "lift_no", e.target.value)
                    }
                    placeholder=""
                  />
                  <label>{translation?.lift_number || "Lift Number"}
                  </label>
                </div>
                {validationErrors[`lift_no_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`lift_no_${towerIndex}`]}
                  </div>
                )}
              </div>
              <div className="col-md-3 col-6 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    value={tower.stair_no}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "stair_no", e.target.value)
                    }
                    placeholder=""
                  />
                  <label>{translation?.stair_number || "Stair Number"}
                  </label>
                </div>
                {validationErrors[`stair_no_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`stair_no_${towerIndex}`]}
                  </div>
                )}
              </div>
              <div className="col-md-3 col-sm-6 col-12 mb-3">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    value={tower.fire_safety}
                    onChange={(e) =>
                      handleTowerChange(towerIndex, "fire_safety", e.target.value)
                    }
                    placeholder=""
                  />
                  <label>{translation?.fire_safety || "Fire Safety"}
                  </label>
                </div>
                {validationErrors[`fire_safety_${towerIndex}`] && (
                  <div className="text-danger small">
                    {validationErrors[`fire_safety_${towerIndex}`]}
                  </div>
                )}
              </div>
            </div>

            {/* Floor Section */}
            <div className="mb-0">
              <h6>{translation?.floor_configuration || "Floor Configuration"}
              </h6>
              {tower.floor_data.map((flat, flatIndex) => (
                <fieldset key={flatIndex} className="border p-3 mb-3 position-relative">
                  <legend>
                  {translation?.unit || "Unit"}
                  {flatIndex + 1}
                  </legend>
                  <Button
                    variant="danger btn-delete"
                    size="sm"
                    onClick={() => removeFlat(towerIndex, flatIndex)}
                    title="Remove Floor"
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                  <div className="row gx-2">
                    <div className="col-md-4 col-sm-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
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
                          placeholder=""
                        />
                        <label>{translation?.floor_number || "Floor Number"}
                        </label>
                      </div>
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
                    <div className="col-md-4 col-sm-6 mb-3">
                      <div className="form-floating">
                        <input
                          type="number"
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
                          placeholder=""
                        />
                        <label>{translation?.flat_number || "Flat Number"}
                        </label>
                      </div>
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
                    <fieldset key={bhkIndex} className="border p-3 mb-3 position-relative">
                      <legend>{translation?.flat || "Flat"}{bhkIndex + 1}</legend>
                      <Button
                        variant="danger btn-delete"
                        size="sm"
                        onClick={() =>
                          removeBHKConfiguration(
                            towerIndex,
                            flatIndex,
                            bhkIndex
                          )
                        }
                        title="Remove Flats"
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                      <div className="row gx-2">
                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
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
                            <label>{translation?.bhk_type || "BHK Type"}
                            </label>
                          </div>
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

                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
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
                              placeholder=""
                            />
                            <label>{translation?.carpet_area || "Carpet Area"}
                            </label>
                          </div>
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

                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
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
                              placeholder=""
                            />
                            <label>{translation?.super_area || "Super Area"}
                            </label>
                          </div>
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

                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
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
                              placeholder=""
                            />
                            <label>{translation?.price || "Price"}
                            </label>
                          </div>
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

                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
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
                            <label>{translation?.facing || "Facing"}
                            </label>
                          </div>
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

                        <div className="col-md-4 col-sm-6 mb-3">
                          <div className="form-floating">
                            {bhk.floor_plan_image ? (
                              <>
                                <div className="position-relative">
                                  <img
                                    src={bhk.image_url}
                                    alt="Floor Plan"
                                    className="img-fluid rounded border"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                  <button
                                    className="delete-btn btn btn-light btn-sm position-absolute top-0 end-0 m-1 p-1 border rounded-circle shadow"
                                    onClick={() => handleBhkImgDelete(bhk.floor_plan_image, bhkIndex, flatIndex, towerIndex)}
                                  >
                                    ❌
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) => handleBhkImgUpload(e, bhkIndex, flatIndex, towerIndex)}
                                />
                                <label>{translation?.upload_floor_image || "Upload Floor Image"}
                                </label>
                              </>
                            )}
                          </div>
                        </div>



                      </div>
                    </fieldset>
                  ))}

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addBHKConfiguration(towerIndex, flatIndex)}
                  >
                    {translation?.add_bhk || "Add BHK"}

                  </Button>
                </fieldset>
              ))}
              <Button
                variant="success"
                size="sm"
                onClick={() => addFlat(towerIndex)}
              >
               {translation?.add_floor || "Add Floor"}

              </Button>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
        {translation?.close || "Close"}

        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isFormValid}>
        {translation?.save || "Save"}

        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
