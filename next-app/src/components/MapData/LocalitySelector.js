import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const LocalityOption = ({ libraries, locationData, setLocationData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries || ["places"],
  });

  const inputRef = useRef(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 25.276987,
    lng: 55.296249,
  });

  const [error, setError] = useState("");

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

    autocomplete.addListener("place_changed", () =>
      handlePlaceChanged(autocomplete)
    );
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();

    if (!place || !place.geometry) {
      setError("Please select a valid landmark.");
      return;
    }

    const formattedAddress = place.formatted_address;
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    // Update the locationData array
    const newLocation = {
      locality: formattedAddress,
      latitude,
      longitude,
    };

    setLocationData((prevData) => [...prevData, newLocation]);

    setMapCenter({ lat: latitude, lng: longitude });
    setError("");
  };

  const mapContainerStyle = {
    height: "300px",
    width: "100%",
  };

  return (
    <div className="col-lg-6 col-12">
        <div className="submit-field">
          <input
            ref={inputRef}
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Search Locality"
            name="locality"
            id="locality"
          />
          {error && <small className="text-danger">{error}</small>}
        </div>
    </div>
  );
};

export default LocalityOption;
