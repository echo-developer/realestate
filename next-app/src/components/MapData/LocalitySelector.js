import React, { useRef, useState, useEffect } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import useTranslation from "@/hooks/useTranslation";

const libraries = ["places"];

const LocalityOption = ({setLocationData }) => {
  const translation = useTranslation();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const inputRef = useRef(null);

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
    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";

    const localityData = [addressLine1, addressLine2]
      .filter(Boolean)
      .join(", ");

    const newLocation = {
      locality: localityData,
    };
    setLocationData(newLocation);
    setError("");
  };

  return (
    <div className="col-lg-6 col-12">
        <div className="form-field">
          <input
            ref={inputRef}
            type="text"
            className={`form-control ${error ? "is-invalid" : ""}`}
            placeholder={translation?.search_locality || "Search Locality"}
            name="locality"
            id="locality"
          />
          {error && <small className="text-danger">{error}</small>}
        </div>
    </div>
  );
};

export default LocalityOption;
