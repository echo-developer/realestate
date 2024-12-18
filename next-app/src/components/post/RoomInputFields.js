"use client"
import React from 'react';

const RoomInputFields = ({
  roomType,
  formData,
  handleFieldChange,
  handleUnitChange,
  increment,
  decrement,
  dropdownOptions,
}) => {
  return (
    <div className="col-lg-3 col-12">
      <div className="form-field">
        <label className="form-label">
          {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
        </label>
        <div className="cart-plus-minus mb-4">
          <input
            type="text"
            className="form-control"
            value={(formData[roomType] || []).length}
            readOnly
          />
          <div className="minus qtybutton" onClick={() => decrement(roomType)}>
            <i className="icon-line-awesome-minus"></i>
          </div>
          <div className="plus qtybutton" onClick={() => increment(roomType)}>
            <i className="icon-line-awesome-plus"></i>
          </div>
        </div>

        {/* Conditionally render height and width inputs based on the room count */}
        {(formData[roomType] || []).map((room, index) => (
          <div key={`${roomType}-${index}`} className="form-group">
            <label className="form-label">Height</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Height"
                value={room.height}
                onChange={(e) =>
                  handleFieldChange(roomType, index, "height", e.target.value)
                }
              />
              <select
                className="form-control"
                value={room.heightUnit}
                onChange={(e) =>
                  handleUnitChange(roomType, index, "heightUnit", e.target.value)
                }
              >
                {dropdownOptions.lengthUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <label className="form-label">Width</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Width"
                value={room.width}
                onChange={(e) =>
                  handleFieldChange(roomType, index, "width", e.target.value)
                }
              />
              <select
                className="form-control"
                value={room.widthUnit}
                onChange={(e) =>
                  handleUnitChange(roomType, index, "widthUnit", e.target.value)
                }
              >
                {dropdownOptions.lengthUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomInputFields;
