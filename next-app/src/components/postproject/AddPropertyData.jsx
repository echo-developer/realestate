import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const AddPropertyData = ({ show, onClose }) => {
  const [towers, setTowers] = useState(
    Array(4)
      .fill()
      .map((_, index) => ({
        towerName: `Tower ${String.fromCharCode(65 + index)}`,
        lifts: 2,
        floors: 10,
        flatsPerFloor: 4,
        bhk_type_data: {
          "1BHK": [],
          "2BHK": [],
          "3BHK": [],
        },
      }))
  );

  const [currentTowerIndex, setCurrentTowerIndex] = useState(null);
  const [towerDetails, setTowerDetails] = useState(null);
  const [selectedBHK, setSelectedBHK] = useState("1BHK");

  const bhkTypes = ["1BHK", "2BHK", "3BHK"];
  const facingOptions = ["North", "South", "East", "West"];

  const handleTowerInputChange = (e, field) => {
    const value = e.target.value;
    setTowerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTowerSelection = (e) => {
    const index = Number(e.target.value);
    setCurrentTowerIndex(index);
    setTowerDetails(towers[index]);
    setSelectedBHK("1BHK"); // Reset BHK selection
  };

  const updateTowerDetails = () => {
    setTowers((prev) => {
      const updatedTowers = [...prev];
      updatedTowers[currentTowerIndex] = { ...towerDetails };
      return updatedTowers;
    });
    alert("Tower details updated successfully.");
  };

  const handleBHKInputChange = (e, field, index) => {
    const value = e.target.value;
    setTowers((prevTowers) => {
      const updatedTowers = [...prevTowers];
      updatedTowers[currentTowerIndex].bhk_type_data[selectedBHK][index][field] = value;
      return updatedTowers;
    });
  };

  const addBHKField = () => {
    setTowers((prevTowers) => {
      const updatedTowers = [...prevTowers];
      updatedTowers[currentTowerIndex].bhk_type_data[selectedBHK].push({
        carpet_area: "",
        super_area: "",
        property_price: "",
        property_facing: "",
      });
      return updatedTowers;
    });
  };

  const saveData = () => {
    console.log("Final Data:", towers);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modify Property Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Tower Selection */}
        <div className="mb-4">
          <h5>Select Tower</h5>
          <select
            className="form-control"
            onChange={handleTowerSelection}
            value={currentTowerIndex === null ? "" : currentTowerIndex}
          >
            <option value="" disabled>
              Select a Tower
            </option>
            {towers.map((tower, index) => (
              <option key={index} value={index}>
                {tower.towerName}
              </option>
            ))}
          </select>
        </div>

        {/* Tower Details Form */}
        {towerDetails && (
          <div>
            <h5>Modify Tower Details</h5>
            <div className="row mb-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tower Name"
                  value={towerDetails.towerName}
                  onChange={(e) => handleTowerInputChange(e, "towerName")}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Lifts"
                  value={towerDetails.lifts}
                  onChange={(e) => handleTowerInputChange(e, "lifts")}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Number of Floors"
                  value={towerDetails.floors}
                  onChange={(e) => handleTowerInputChange(e, "floors")}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Flats Per Floor"
                  value={towerDetails.flatsPerFloor}
                  onChange={(e) => handleTowerInputChange(e, "flatsPerFloor")}
                />
              </div>
            </div>
            <Button variant="primary" onClick={updateTowerDetails}>
              Update Tower
            </Button>
          </div>
        )}

        {/* BHK Form */}
        {towerDetails && (
          <div className="mt-4">
            <h5>BHK Details for Tower: {towerDetails.towerName}</h5>
            <div>
              {bhkTypes.map((bhk, idx) => (
                <Button
                  key={idx}
                  variant={selectedBHK === bhk ? "primary" : "outline-primary"}
                  onClick={() => setSelectedBHK(bhk)}
                  className="me-2"
                >
                  {bhk}
                </Button>
              ))}
            </div>
            <div className="mt-3">
              {towers[currentTowerIndex].bhk_type_data[selectedBHK].map((field, index) => (
                <div key={index} className="row mb-3">
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Carpet Area"
                      value={field.carpet_area}
                      onChange={(e) => handleBHKInputChange(e, "carpet_area", index)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Super Area"
                      value={field.super_area}
                      onChange={(e) => handleBHKInputChange(e, "super_area", index)}
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Price"
                      value={field.property_price}
                      onChange={(e) => handleBHKInputChange(e, "property_price", index)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-control"
                      value={field.property_facing}
                      onChange={(e) => handleBHKInputChange(e, "property_facing", index)}
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
              <Button variant="link" onClick={addBHKField}>
                Add More Rooms
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveData}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyData;
