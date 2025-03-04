import { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  FloatingLabel,
} from "react-bootstrap";

const Locality = ({ libraries, locality, setLocality }) => {
  const translation = useTranslation();
  const inputRef = useRef();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries || ["places"],
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = locality || "";
    }
  }, [locality]);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      componentRestrictions: { country: "IN" },
      fields: ["address_components", "geometry", "formatted_address"],
    };

    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autocompleteInstance.addListener("place_changed", () => {
      handlePlaceChanged(autocompleteInstance);
    });

    // Ensure the dropdown appears properly
    setTimeout(() => {
      document.querySelectorAll(".pac-container").forEach((el) => {
        el.style.zIndex = "9999";
        el.style.position = "absolute";
      });
    }, 500);
  }, [isLoaded, loadError]);

  const handlePlaceChanged = (placeInstance) => {
    const place = placeInstance.getPlace();
    if (!place || !place.geometry) return;

    const formattedAddress = place.formatted_address;
    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";

    const localityData = [addressLine1, addressLine2].filter(Boolean).join(", ");

    // Update the locality state
    setLocality(localityData);

    // Update input value
    if (inputRef.current) {
      inputRef.current.value = localityData;
    }
  };

  const handleMenualInputChange = (e) => {
    const {value} = e?.target || {};
    setLocality(value || "");
  }

  return (
    <>
    <FloatingLabel controlId="" label={translation?.locality || "Locality:"}>
    <Form.Control 
      type="text" 
      className="form-control" 
      ref={inputRef} onChange={handleMenualInputChange}
      />
      </FloatingLabel>
    </>
  );
};

export default Locality;
