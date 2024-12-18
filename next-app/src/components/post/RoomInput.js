import React from "react";

const RoomInput = ({
  keyName,
  room,
  index,
  errors,
  handleFieldChange,
}) => (
  <div key={`${keyName}-${index}`} className="row mb-3">
    <div className="col-12">
      <strong>{`${keyName}_${index + 1}`}</strong>
    </div>

    <div className="col-sm-6">
      <label className="form-label">Height</label>
      <div className="input-group">
        <span>sqft</span>
        <input
          type="text"
          className="form-control"
          placeholder="Enter Height"
          value={room.height}
          onChange={(e) =>
            handleFieldChange(keyName, index, "height", e.target.value)
          }
        />
        {errors[keyName] && errors[keyName][index]?.height && (
          <div className="error-text text-danger">
            {errors[keyName][index]?.height}
          </div>
        )}
      </div>
    </div>

    <div className="col-sm-6">
      <label className="form-label">Width</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Width"
          value={room.width}
          onChange={(e) =>
            handleFieldChange(keyName, index, "width", e.target.value)
          }
        />
        {errors[keyName] && errors[keyName][index]?.width && (
          <div className="error-text text-danger">
            {errors[keyName][index]?.width}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RoomInput;
