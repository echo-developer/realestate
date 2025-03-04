import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";
import { useTransition } from "react";

const libraries = ["places"];

export default function LocalitySearch({locality,setLocalityData}) {
  const inputRef = useRef();
  const router = useRouter();
  const translation = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

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
    if (router?.isReady && router?.query?.location_data) {
      try {
        const stringifiedLocalityData = router.query.location_data;
        const localityData = JSON.parse(decodeURIComponent(stringifiedLocalityData));

        if (Array.isArray(localityData) && localityData.length > 0) {
          const data = localityData[0];
          updateLocalityState(data.locality);
        } else if (localityData?.locality) {
          updateLocalityState(localityData.locality);
        }
      } catch (error) {
        console.error("Error parsing locality data:", error);
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
    const localityData = [addressLine1, addressLine2].filter(Boolean).join(", ");

    updateLocalityState(localityData);
  };

  const updateLocalityState = (localityValue) => {
    if (inputRef.current) {
      inputRef.current.value = localityValue;
    }
    setLocalityData({ locality: localityValue });
  };

  return (

      <div className="submit-field">
        <input
          type="text"
          ref={inputRef}
          className="form-control"
          placeholder={translation?.search_locality || "Search Locality"}
          name="locality"
          id="locality"
        />
      </div>
  );
}
