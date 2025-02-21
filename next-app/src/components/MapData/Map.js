import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ libraries, formData, setFormData, errors, setErrors }) => {
  const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      libraries: libraries || ["places"],
  });
  const inputRef = useRef(null);
  
  useEffect(() => {
      if (!isLoaded || loadError) return;

      const options = {
          componentRestrictions: { country: "ind" },
          fields: ["address_components", "geometry", "formatted_address"],
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          options
      );
      autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (autocomplete) => {
      const place = autocomplete.getPlace();
      if (!place || !place.geometry) {
          setFormData((prevData) => ({ ...prevData, locality: "" }));
          setErrors((prevErrors) => ({
              ...prevErrors,
              locality: "Please select a valid landmark.",
          }));
          return;
      }

      const formattedAddress = place?.formatted_address;
      const latitude = place?.geometry?.location.lat();
      const longitude = place?.geometry?.location.lng();
      const addressParts = formattedAddress.split(",").map((part) => part.trim());
      const localityData = [addressParts[0], addressParts[1]].filter(Boolean).join(", ");

      setFormData((prevData) => ({
          ...prevData,
          locality: localityData,
          latitude: latitude,
          longitude: longitude,
      }));

      setErrors((prevErrors) => ({ ...prevErrors, locality: "" }));
  };

  const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      if (name === "locality" && value.trim() === "") {
          setErrors((prevErrors) => ({
              ...prevErrors,
              locality: "Location field cannot be empty.",
          }));
      } else {
          setErrors((prevErrors) => ({ ...prevErrors, locality: "" }));
      }
  };

  return (
      <div className="col-lg-6 col-12">
          <label className="form-label">Locality</label>
          <div className="col-md-12">
              <div className="submit-field">
                  <input
                      ref={inputRef}
                      type="text"
                      className={`form-control ${errors.locality ? "is-invalid" : ""}`}
                      placeholder="Enter Locality"
                      name="locality"
                      id="locality"
                      value={formData.locality || ""}
                      onChange={handleChange}
                  />
                  {errors.locality && <p className="text-danger small">{errors.locality}</p>}
              </div>
          </div>
      </div>
  );
};

export default MapComponent;

