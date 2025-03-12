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

  const toggleDropdown = (isOpen) => setShowDropdown(isOpen);

  const handleApply = () => {
    applySizes(); // Call parent apply function
    setShowDropdown(false); // Close dropdown
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
            value={minSize}
            onChange={(e) => setMinSize(e.target.value)}
          />
          <input
            type="number"
            className="form-control"
            placeholder={translation?.max || "Max"}
            value={maxSize}
            onChange={(e) => setMaxSize(e.target.value)}
          />
        </div>

        {/* Reset & Done Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <Button variant="outline-secondary" onClick={resetSizes}>
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
