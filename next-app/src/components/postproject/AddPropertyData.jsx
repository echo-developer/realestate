import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";

const AddPropertyData = ({ show, onClose ,projectId }) => {
  const {callApi ,GetMemberId}=AuthUser();

  const [towers, setTowers] = useState(
    Array(4)
      .fill()
      .map((_, index) => ({
        tower_name: `Tower ${String.fromCharCode(65 + index)}`,
        lift_no: 2,
        floor_no: 10,
        flats_per_floor: 4,
        bhk_type_data: [
          {
            bhk_type: "1BHK",
            carpet_area: "",
            super_area: "",
            property_price: "",
            property_facing: "",
          },
        ],
      }))
  );

  const [selectedBHKs, setSelectedBHKs] = useState(
    towers.map(() => "1BHK")
  );

  const [validationErrors, setValidationErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const bhkTypes = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
  const facingOptions = ["North", "South", "East", "West"];

  // Validation logic
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    towers.forEach((tower, towerIndex) => {
      if (!tower.tower_name.trim()) {
        errors[`tower_name_${towerIndex}`] = "Tower name is required.";
        isValid = false;
      }
      if (tower.lift_no <= 0) {
        errors[`lift_no_${towerIndex}`] = "Number of lifts should be greater than 0.";
        isValid = false;
      }
      if (tower.floor_no <= 0) {
        errors[`floor_no_${towerIndex}`] = "Number of floors should be greater than 0.";
        isValid = false;
      }
      if (tower.flats_per_floor <= 0) {
        errors[`flats_per_floor_${towerIndex}`] = "Flats per floor should be greater than 0.";
        isValid = false;
      }

      tower.bhk_type_data.forEach((field, index) => {
        if (field.carpet_area <= 0) {
          errors[`carpet_area_${towerIndex}_${index}`] = "Carpet area should be greater than 0.";
          isValid = false;
        }
        if (field.super_area <= 0) {
          errors[`super_area_${towerIndex}_${index}`] = "Super area should be greater than 0.";
          isValid = false;
        }
        if (field.property_price <= 0) {
          errors[`property_price_${towerIndex}_${index}`] = "Property price should be greater than 0.";
          isValid = false;
        }
      });
    });

    setValidationErrors(errors);
    setIsFormValid(isValid);
  };
  // Handle changes in tower input fields
  const handleTowerInputChange = (e, towerIndex, field) => {
    const value = e.target.value;
    setTowers((prev) => {
      const updatedTowers = [...prev];
      updatedTowers[towerIndex][field] = value;
      return updatedTowers;
    });
    validateForm();
  };
  const handleBHKInputChange = (e, towerIndex, field, index) => {
    const value = e.target.value;
    setTowers((prevTowers) => {
      const updatedTowers = [...prevTowers];
      updatedTowers[towerIndex].bhk_type_data[index][field] = value;
      return updatedTowers;
    });
    validateForm();
  };

  const addBHKField = (towerIndex) => {
    setTowers((prevTowers) => {
      const updatedTowers = [...prevTowers];
      updatedTowers[towerIndex].bhk_type_data.push({
        bhk_type: selectedBHKs[towerIndex],
        carpet_area: "",
        super_area: "",
        property_price: "",
        property_facing: "",
      });
      return updatedTowers;
    });
    validateForm();
  };

  const removeBHKField = (towerIndex, index) => {
    setTowers((prevTowers) => {
      const updatedTowers = [...prevTowers];
      updatedTowers[towerIndex].bhk_type_data.splice(index, 1);
      return updatedTowers;
    });
    validateForm();
  };

const saveData = async () => {
  const memberId = GetMemberId();
 try {
    const response = await callApi({
      api: `/save-project-property`,
      method: 'POST',
      data: {
        tower_data: JSON.stringify(towers),
        project_id: projectId,
        user_id:memberId
      },
    });

    if (response && response.status === 1) {
      console.log('Data successfully uploaded!');
    }
  } catch (error) {
    console.error('Error while saving data:', error);
  }
  onClose();
};


  useEffect(() => {
    validateForm();
  }, [towers]);

  const handleBHKTypeChange = (bhkType, towerIndex) => {
    setSelectedBHKs((prevBHKs) => {
      const updatedBHKs = [...prevBHKs];
      updatedBHKs[towerIndex] = bhkType;
      return updatedBHKs;
    });
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modify Property Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Displaying All Towers */}
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="mt-4">
            <h5>Modify {tower.tower_name} Details</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tower Name"
                  value={tower.tower_name}
                  onChange={(e) => handleTowerInputChange(e, towerIndex, "tower_name")}
                />
                {validationErrors[`tower_name_${towerIndex}`] && (
                  <div className="text-danger">{validationErrors[`tower_name_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Lifts"
                  value={tower.lift_no}
                  onChange={(e) => handleTowerInputChange(e, towerIndex, "lift_no")}
                />
                {validationErrors[`lift_no_${towerIndex}`] && (
                  <div className="text-danger">{validationErrors[`lift_no_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Floors"
                  value={tower.floor_no}
                  onChange={(e) => handleTowerInputChange(e, towerIndex, "floor_no")}
                />
                {validationErrors[`floor_no_${towerIndex}`] && (
                  <div className="text-danger">{validationErrors[`floor_no_${towerIndex}`]}</div>
                )}
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Flats Per Floor"
                  value={tower.flats_per_floor}
                  onChange={(e) => handleTowerInputChange(e, towerIndex, "flats_per_floor")}
                />
                {validationErrors[`flats_per_floor_${towerIndex}`] && (
                  <div className="text-danger">{validationErrors[`flats_per_floor_${towerIndex}`]}</div>
                )}
              </div>
            </div>

            {/* BHK Details Form for this Tower */}
            <div className="mt-4">
              <h5>BHK Details for {tower.tower_name}</h5>
              <div>
                {bhkTypes.map((bhk, idx) => (
                  <Button
                    key={idx}
                    variant={selectedBHKs[towerIndex] === bhk ? "primary" : "outline-primary"}
                    onClick={() => handleBHKTypeChange(bhk, towerIndex)}
                    className="me-2"
                  >
                    {bhk}
                  </Button>
                ))}
              </div>
              <div className="mt-3">
                {tower.bhk_type_data.map((field, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Carpet Area"
                        value={field.carpet_area}
                        onChange={(e) => handleBHKInputChange(e, towerIndex, "carpet_area", index)}
                      />
                      {validationErrors[`carpet_area_${towerIndex}_${index}`] && (
                        <div className="text-danger">
                          {validationErrors[`carpet_area_${towerIndex}_${index}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Super Area"
                        value={field.super_area}
                        onChange={(e) => handleBHKInputChange(e, towerIndex, "super_area", index)}
                      />
                      {validationErrors[`super_area_${towerIndex}_${index}`] && (
                        <div className="text-danger">
                          {validationErrors[`super_area_${towerIndex}_${index}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        value={field.property_price}
                        onChange={(e) => handleBHKInputChange(e, towerIndex, "property_price", index)}
                      />
                      {validationErrors[`property_price_${towerIndex}_${index}`] && (
                        <div className="text-danger">
                          {validationErrors[`property_price_${towerIndex}_${index}`]}
                        </div>
                      )}
                    </div>
                    <div className="col-md-3">
                      <select
                        className="form-control"
                        value={field.property_facing}
                        onChange={(e) => handleBHKInputChange(e, towerIndex, "property_facing", index)}
                      >
                        <option value="">Facing</option>
                        {facingOptions.map((facing, idx) => (
                          <option key={idx} value={facing}>
                            {facing}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                <Button
                  variant="danger"
                  onClick={() => removeBHKField(towerIndex, 0)}
                  className="mt-3 me-2"
                >
                  Remove {selectedBHKs[towerIndex]} Fields
                </Button>
                <Button
                  variant="primary"
                  onClick={() => addBHKField(towerIndex)}
                  className="mt-3"
                >
                  Add More {selectedBHKs[towerIndex]} Fields
                </Button>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={saveData}
          disabled={!isFormValid}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
