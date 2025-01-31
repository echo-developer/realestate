import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const MapComponent = ({ libraries, formData, setFormData }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries || ["places"],
  });
  const inputRef = useRef(null);
  const mapRef = useRef(null);

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
    autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (autocomplete) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry) {
      setFormData((prevData) => ({ ...prevData, locality: "" }));
      setError("Please select a valid landmark.");
      return;
    }

    const formattedAddress = place?.formatted_address;
    const latitude = place?.geometry?.location.lat();
    const longitude = place?.geometry?.location.lng();

    setFormData((prevData) => ({
      ...prevData,
      locality: formattedAddress,
      latitude: latitude,
      longitude: longitude,
    }));

    setMapCenter({ latitude: latitude, longitude: longitude });
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "locality" && value.trim() === "") {
      setError("Location field cannot be empty.");
    } else {
      setError("");
    }
  };

  const mapContainerStyle = {
    height: "300px",
    width: "100%",
  };

  return (
    <div className="col-lg-6 col-12">
      <label>Landmark</label>
      <div className="col-md-12">
        <div className="submit-field">
          <input
            ref={inputRef}
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder="Enter landmark"
            name="locality"
            id="locality"
            value={formData.locality}
            onChange={handleChange}
            required
          />
          {error && <small className="text-danger">{error}</small>}
        </div>
        <div className="submit-field">
          {/* Google Map */}
          {isLoaded ? (
            ""
            // Uncomment this if you want to show the map
            // <GoogleMap
            //   mapContainerStyle={mapContainerStyle}
            //   center={mapCenter}
            //   zoom={12}
            //   ref={mapRef}
            // >
            //   <Marker position={mapCenter} />
            // </GoogleMap>
          ) : (
            <p hidden>Loading Map...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
