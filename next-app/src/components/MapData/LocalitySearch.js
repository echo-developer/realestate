import React, { useEffect, useRef, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { Form, FloatingLabel } from "react-bootstrap";

const libraries = ["places"];

export default function LocalitySearch({ locality, setLocalityData }) {
  const inputRef = useRef();
  const router = useRouter();
  const translation = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [localityValue, setLocalityValue] = useState("");

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      componentRestrictions: { country: "IN" },
      fields: ["formatted_address", "geometry"],
    };

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteInstance.addListener("place_changed", () => {
      handlePlaceChanged(autocompleteInstance);
    });
  }, [isLoaded, loadError]);

  useEffect(() => {
    if (router?.isReady) {
      let locationText = "";

      if (router?.query?.location_data) {
        try {
          const parsedLocation = JSON.parse(
            decodeURIComponent(router.query.location_data)
          );
          locationText = parsedLocation?.locality || "";
        } catch (error) {
          console.error("Error parsing location_data:", error);
        }
      }

      if (!locationText && router?.query?.address) {
        try {
          locationText = JSON.parse(decodeURIComponent(router.query.address));
        } catch (error) {
          console.error("Error parsing address:", error);
        }
      }

      if (locationText) {
        updateLocalityState(locationText);
      }
    }
  }, [router?.query]);

  useEffect(() => {
    if (locality) {
      inputRef.current.value = locality.locality || "";
    }
  }, [locality]);

  const handlePlaceChanged = (autocompleteInstance) => {
    const place = autocompleteInstance.getPlace();
    if (!place || !place.geometry) return;

    const formattedAddress = place.formatted_address;
    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";
    const newLocality = [addressLine1, addressLine2].filter(Boolean).join(", ");

    updateLocalityState(newLocality);
  };

  const updateLocalityState = (localityText) => {
    if (inputRef.current) {
      inputRef.current.value = localityText;
    }
    setLocalityValue(localityText);
    setLocalityData({ locality: localityText });
  };

  return (
    <FloatingLabel controlId="floatingInput" label="Locality" className="mb-3">
      <Form.Control
        type="text"
        ref={inputRef}
        placeholder={translation?.search_locality || "Search Locality"}
        name="locality"
      />
    </FloatingLabel>
  );
}
