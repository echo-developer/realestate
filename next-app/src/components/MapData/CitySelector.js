import React, { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const CitySelector = ({ formData, setFormData }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      types: ["(cities)"],
      componentRestrictions: { country: "ind" },
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
      setError("Please select a valid city.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      city: place.formatted_address,
    }));
    setError("");
  };

  return (
    <div>
      <label>City</label>
      <input
        ref={inputRef}
        type="text"
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder="Select a city"
        name="city"
        value={formData.city || ""}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
      />
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

export default CitySelector;
