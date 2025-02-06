import React, { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

const LocalitySelector = ({ formData, setFormData }) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      types: ["sublocality", "political"],
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
      setError("Please select a valid locality.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      locality: place.formatted_address,
    }));
    setError("");
  };

  return (
    <div>
      <label>Locality</label>
      <input
        ref={inputRef}
        type="text"
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder="Select a locality"
        name="locality"
        value={formData.locality || ""}
        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
      />
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

export default LocalitySelector;
