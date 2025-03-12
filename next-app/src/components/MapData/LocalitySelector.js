import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Use useSearchParams instead of useRouter
import { useLoadScript } from "@react-google-maps/api";
import useTranslation from "@/hooks/useTranslation";

const libraries = ["places"];

const LocalityOption = ({ setLocationData }) => {
  const searchParams = useSearchParams(); // Get query params
  const translation = useTranslation();
  const location_data = searchParams.get("location_data"); // Extract location_data
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const inputRef = useRef(null);
  const [locality, setLocality] = useState(""); // State to store input value
  const [error, setError] = useState("");

  // Extract location_data from URL and set input field value
  useEffect(() => {
    if (location_data) {
      try {
        const decodedData = decodeURIComponent(location_data);
        const parsedData = JSON.parse(decodedData);
        setLocality(parsedData.locality || ""); // Set locality in the input field
        setLocationData(parsedData); // Set location data in state
      } catch (error) {
        console.error("Error parsing location_data:", error);
      }
    }
  }, [location_data]); // Runs when query changes

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

    setLocality(localityData); // Update input field with new locality
    setLocationData(newLocation);
    setError("");
  };

  return (
    <div className="form-field">
      <input
        ref={inputRef}
        type="text"
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={translation?.search_locality || "Search Locality"}
        name="locality"
        id="locality"
        value={locality} // Set input value from state
        onChange={(e) => setLocality(e.target.value)} // Allow manual input
      />
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

export default LocalityOption;
