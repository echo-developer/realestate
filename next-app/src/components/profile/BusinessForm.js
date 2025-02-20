import React, { useState } from "react";

const BusinessAddressForm = ({addresses ,setAddresses}) => {


  const handleChange = (index, field, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
  };

  const addMoreAddress = () => {
    setAddresses([...addresses, { city: "", locality: "" }]);
  };

  const removeAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };


  return (
    <div>
      {addresses.map((address, index) => (
        <div className="row mb-3" key={index}>
          {/* City Dropdown */}
          <div className="col-md-5">
            <select
              name={`city_${index}`}
              className="form-control"
              value={address.city}
              onChange={(e) => handleChange(index, "city", e.target.value)}
            >
              <option value="">Select City</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>

          {/* Locality Input */}
          <div className="col-md-5">
            <input
              type="text"
              name={`locality_${index}`}
              className="form-control"
              placeholder="Locality"
              value={address.locality}
              onChange={(e) => handleChange(index, "locality", e.target.value)}
            />
          </div>
          {/* <Map/> */}

          {/* Remove Button (Hidden for the first address) */}
          {index > 0 && (
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeAddress(index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add More Button */}
      <button type="button" className="btn btn-primary" onClick={addMoreAddress}>
        Add More
      </button>
    </div>
  );
};

export default BusinessAddressForm;
