import React, { useState } from "react";
import { Dropdown, Button } from "react-bootstrap";

const SizeDropdown = ({
  minSize,
  maxSize,
  setMinSize,
  setMaxSize,
  applySizes,
  resetSizes,
  translation = {},
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tempMinSize, setTempMinSize] = useState(minSize);
  const [tempMaxSize, setTempMaxSize] = useState(maxSize);
  const [error, setError] = useState(""); // Error message state

  const toggleDropdown = (isOpen) => setShowDropdown(isOpen);

  const handleApply = () => {
    if (parseInt(tempMinSize) > parseInt(tempMaxSize)) {
      setError(translation?.error || "Min size cannot be greater than max size");
      return;
    }
    setError(""); // Clear error
    setMinSize(tempMinSize);
    setMaxSize(tempMaxSize);
    applySizes(); // Call parent apply function
    setShowDropdown(false); // Close dropdown
  };

  const handleTempMinChange = (e) => {
    setTempMinSize(e.target.value);
    setError(""); // Clear error while typing
  };

  const handleTempMaxChange = (e) => {
    setTempMaxSize(e.target.value);
    setError(""); // Clear error while typing
  };

  const handleMinBlur = () => {
    let value = parseInt(tempMinSize) || 0;
    if (value > parseInt(tempMaxSize)) {
      setError(translation?.error || "Min size cannot be greater than max size");
    } else {
      setError(""); // Clear error
      setMinSize(value);
    }
    setTempMinSize(value);
  };

  const handleMaxBlur = () => {
    let value = parseInt(tempMaxSize) || 0;
    if (value < parseInt(tempMinSize)) {
      setError(translation?.error || "Max size cannot be smaller than min size");
    } else {
      setError(""); // Clear error
      setMaxSize(value);
    }
    setTempMaxSize(value);
  };

  const handleReset = () => {
    setTempMinSize(""); // Clear input fields
    setTempMaxSize("");
    setMinSize(null);
    setMaxSize(null);
    setError("");
    resetSizes(); // Call parent reset function
  };

  return (
    <Dropdown
      show={showDropdown}
      onToggle={toggleDropdown}
      className="select-dropdown d-grid mb-3"
    >
      <Dropdown.Toggle className="btn-form-control">
        {minSize || maxSize
          ? `${minSize || "0"} - ${maxSize || "∞"}`
          : translation?.size || "Select Size"}
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-3 shadow bg-white rounded">
        <div className="d-flex justify-content-between">
          <label>{translation?.min || "Minimum"}</label>
          <label>{translation?.max || "Maximum"}</label>
        </div>

        {/* Min & Max Input Fields */}
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control"
            placeholder={translation?.min || "Min"}
            value={tempMinSize}
            onChange={handleTempMinChange}
            onBlur={handleMinBlur}
            min={0}
          />
          <input
            type="number"
            className="form-control"
            placeholder={translation?.max || "Max"}
            value={tempMaxSize}
            onChange={handleTempMaxChange}
            onBlur={handleMaxBlur}
            min={0}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-danger mt-1">{error}</p>}

        {/* Reset & Done Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <Button variant="outline-secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Done
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SizeDropdown;
