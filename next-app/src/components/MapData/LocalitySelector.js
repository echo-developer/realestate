import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLoadScript } from "@react-google-maps/api";
import { GeoAlt } from 'react-bootstrap-icons';
import {
  Form,
  Button, 
} from "react-bootstrap";
const libraries = ["places"];

const LocalityOption = ({ setLocationData ,translation }) => {
  const searchParams = useSearchParams();
  const location_data = searchParams.get("location_data");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const inputRef = useRef(null);
  const [locality, setLocality] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location_data) {
      try {
        const decodedData = decodeURIComponent(location_data);
        const parsedData = JSON.parse(decodedData);
        setLocality(parsedData.locality || "");
        setLocationData(parsedData);
      } catch (error) {
        console.error("Error parsing location_data:", error);
      }
    }
  }, [location_data]);

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
    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";

    const localityData = [addressLine1, addressLine2]
      .filter(Boolean)
      .join(", ");

    const newLocation = { locality: localityData };

    setLocality(localityData);
    setLocationData(newLocation);
    setError("");
  };

  return (
    <Form.Group className="form-field with-icon-start">
      <GeoAlt color="gray" size={14} />
      <Form.Control
        ref={inputRef}
        className={`${error ? "is-invalid" : ""}`}
        placeholder={translation?.search_locality || "Search Locality"}
        name="locality"
        id="locality"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
      />
      {error && <small className="text-danger">{error}</small>}
    </Form.Group>
  );
};

export default LocalityOption;
