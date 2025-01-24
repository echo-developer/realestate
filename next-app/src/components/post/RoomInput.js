import React, { useState, useEffect } from "react";

const RoomInput = ({
  keyName,
  room,
  index,
  errors,
  handleFieldChange,
}) => {
  const [localErrors, setLocalErrors] = useState({ height: "", width: "" });

  useEffect(() => {
    setLocalErrors({ height: "", width: "" });
  }, [room]);

  const validateField = (field, value) => {
    if (value.trim() === "") {
      return `${field} cannot be empty.`;
    } else if (isNaN(value) || Number(value) <= 0) {
      return `${field} must be a valid number greater than 0.`;
    }
    return "";
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    const heightError = validateField("Height", value);
    setLocalErrors((prevErrors) => ({
      ...prevErrors,
      height: heightError,
    }));
    handleFieldChange(keyName, index, "height", value);

    if (value && !room.width) {
      setLocalErrors((prevErrors) => ({
        ...prevErrors,
        width: "Width is required when Height is provided.",
      }));
    }
  };

  const handleWidthChange = (e) => {
    const value = e.target.value;
    const widthError = validateField("Width", value);
    setLocalErrors((prevErrors) => ({
      ...prevErrors,
      width: widthError,
    }));
    handleFieldChange(keyName, index, "width", value);
    if (room.height && value) {
      setLocalErrors((prevErrors) => ({
        ...prevErrors,
        width: "",
      }));
    }
  };

  return (
    <div key={`${keyName}-${index}`} className="row mb-3">
      <div className="col-12">
        <strong>{`${keyName}${index + 1}`}</strong>
      </div>

      <div className="col-sm-6">
        <label className="form-label">Height</label>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${localErrors.height ? "is-invalid" : ""}`}
            placeholder="Enter Height"
            value={room.height}
            onChange={handleHeightChange}
          />
          {localErrors.height && (
            <div className="error-text text-danger">
              {localErrors.height}
            </div>
          )}
        </div>
      </div>

      <div className="col-sm-6">
        <label className="form-label">Width</label>
        <div className="input-group">
          <input
            type="text"
            className={`form-control ${localErrors.width ? "is-invalid" : ""}`}
            placeholder="Enter Width"
            value={room.width}
            onChange={handleWidthChange}
          />
          {localErrors.width && (
            <div className="error-text text-danger">
              {localErrors.width}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomInput;
