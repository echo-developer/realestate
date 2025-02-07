import React, { useRef, useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";

const LocalitySearchedData = ({ libraries, setLocationData }) => {
  const router = useRouter();
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
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      componentRestrictions: { country: "ind" },
      fields: ["address_components", "geometry", "formatted_address"],
    };

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteInstance.addListener("place_changed", () =>
      handlePlaceChanged(autocompleteInstance)
    );

    setAutocomplete(autocompleteInstance);
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (autocompleteInstance) => {
    const place = autocompleteInstance.getPlace();

    if (!place || !place.geometry) {
      setError("Please select a valid landmark.");
      return;
    }

    const formattedAddress = place.formatted_address;
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const newLocation = {
      locality: formattedAddress,
      latitude,
      longitude,
    };

    // Ensure that prevData is always an array
    setLocationData((prevData) => {
      return newLocation
    });

    setMapCenter({ lat: latitude, lng: longitude });
    setError("");
  };

  useEffect(() => {
    if (router.query.location_data) {
      const locationData = JSON.parse(decodeURIComponent(router.query.location_data));
      if (Array.isArray(locationData) && locationData.length > 0) {
        const data = locationData[0];

        setMapCenter({
          lat: data?.latitude,
          lng: data?.longitude,
        });

        if (inputRef.current && data?.locality) {
          inputRef.current.value = data.locality;

          if (autocomplete) {
            const place = {
              formatted_address: data.locality,
              geometry: {
                location: {
                  lat: () => data.latitude,
                  lng: () => data.longitude,
                },
              },
            };

            // Now manually call handlePlaceChanged to simulate the selection
            handlePlaceChanged({
              getPlace: () => place,
            });
          }
        }

        setLocationData(data);
      }
    }
  }, [router.query.location_data, autocomplete, setLocationData]);

  return (
    <div className="col-lg-4 col-12">
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

export default LocalitySearchedData;
