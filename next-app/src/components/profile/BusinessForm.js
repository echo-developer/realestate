import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

const BusinessAddressForm = ({ addresses, setAddresses }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    addresses.forEach((_, index) => {
      if (!inputRefs.current[index]) return;

      const options = {
        componentRestrictions: { country: "IN" },
        fields: ["formatted_address", "geometry"],
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRefs.current[index],
        options
      );

      autocomplete.addListener("place_changed", () =>
        handlePlaceChanged(autocomplete, index)
      );
    });
  }, [isLoaded, loadError, addresses]);

  const handlePlaceChanged = (autocomplete, index) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry) {
      handleChange(index, "locality", "");
      return;
    }

    const formattedAddress = place.formatted_address || "";
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";
    const town = addressParts[2] || "";

    const localityData = [addressLine1, addressLine2].filter(Boolean).join(", ");

    setAddresses((prev) =>
      prev.map((addr, i) =>
        i === index
          ? { ...addr, locality: localityData, latitude, longitude, addressLine1, addressLine2, town }
          : addr
      )
    );
  };

  const handleChange = (index, field, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
  }; 
 
  const addMoreAddress = () => {
    setAddresses([...addresses, { city: "", locality: "", addressLine1: "", addressLine2: "", town: "", latitude: null, longitude: null }]);
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
          <div className="col-md-4">
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

          {/* Locality Input with Google Places Autocomplete */}
          <div className="col-md-4">
            <input
              type="text"
              name={`locality_${index}`}
              className="form-control"
              placeholder="Enter Locality"
              ref={(el) => (inputRefs.current[index] = el)}
              value={address.locality}
              onChange={(e) => handleChange(index, "locality", e.target.value)}
            />
          </div>

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
