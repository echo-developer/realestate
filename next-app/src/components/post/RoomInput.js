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
    <>
      <div key={`${keyName}-${index}`} className="col-6 mb-3">
        <div className="row gx-3 align-items-end">
          <div className="col-12">
            <h6 className="text-capitalize fw-semibold">{`${keyName} ${index + 1}`}</h6>
          </div>
          <div className="col-sm">
            <label className="form-label">Height</label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${localErrors.height ? "is-invalid" : ""}`}
                placeholder="Enter Height"
                value={room.height}
                onChange={handleHeightChange}
              />
            </div>
            {localErrors.height && (
              <div className="error-text text-danger small">
              </div>
            )}        
          </div>
          <div className="col-sm-auto" style={{minHeight:'30px'}}><i className="bi bi-x-lg"></i></div>
          <div className="col-sm">
            <label className="form-label">Width</label>
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${localErrors.width ? "is-invalid" : ""}`}
                placeholder="Enter Width"
                value={room.width}
                onChange={handleWidthChange}
              />
            </div>
            {localErrors.width && (
              <div className="error-text text-danger small">
              </div>
            )}        
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomInput;
