import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";

const libraries = ["places"];

const BusinessAddressForm = ({ addresses, setAddresses }) => {
  const { callApi } = AuthUser();
  const [cityData, setCityData] = useState([]);
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });
const translation = useTranslation();
  const inputRefs = useRef({});

  useEffect(() => {
    FetchAllCity();
  }, []);

  const FetchAllCity = async () => {
    try {
      const response = await callApi({
        api: `/get_property_cities`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setCityData(response.data);
      } else {
        toast.error(response.message || "Data not retrieved");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    if (!isLoaded || loadError) return;

    addresses.forEach((address) => {
      if (!inputRefs.current[address.key]) return;

      const options = {
        componentRestrictions: { country: "IN" },
        fields: ["formatted_address", "geometry"],
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRefs.current[address.key],
        options
      );

      autocomplete.addListener("place_changed", () =>
        handlePlaceChanged(autocomplete, address.key)
      );
    });
  }, [isLoaded, loadError, addresses]);

  const handlePlaceChanged = (autocomplete, key) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry) {
      handleChange(key, "locality", "");
      return;
    }

    const formattedAddress = place.formatted_address || "";
    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    const addressParts = formattedAddress.split(",").map((part) => part.trim());

    const addressLine1 = addressParts[0] || "";
    const addressLine2 = addressParts[1] || "";
    const town = addressParts[2] || "";

    const localityData = [addressLine1, addressLine2]
      .filter(Boolean)
      .join(", ");

    setAddresses((prev) =>
      prev.map((addr) =>
        addr.key === key
          ? {
              ...addr,
              locality: localityData,
              latitude,
              longitude,
              addressLine1,
              addressLine2,
              town,
            }
          : addr
      )
    );
  };

  const handleChange = (key, field, value) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.key === key ? { ...addr, [field]: value } : addr))
    );
  };

  const generateNewKey = () => {
    return `service_${addresses.length + 1}`; // Generates keys like service_1, service_2, ...
  };

  const addMoreAddress = () => {
    setAddresses([
      ...addresses,
      {
        key: generateNewKey(), // Dynamically generate key
        city: "",
        locality: "",
        addressLine1: "",
        addressLine2: "",
        town: "",
        latitude: null,
        longitude: null,
      },
    ]);
  };

  const removeAddress = (key) => {
    setAddresses(addresses.filter((addr) => addr.key !== key));
  };

  return (
    <div>
      {addresses.map((address) => (
        <div className="d-flex align-items-center gap-2 mb-3" key={address.key}>
          {/* City Dropdown */}
          <select
            name={`city_${address.key}`}
            className="form-control"
            value={address.city}
            onChange={(e) => handleChange(address.key, "city", e.target.value)}
            style={{ color: address.city ? "#000" : "#6c757d", width: "30%" }}
          >
            <option value="" disabled>
            {translation?.select_city || "Select City"}
            </option>
            {cityData?.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.name}
              </option>
            ))}
          </select>

          {/* Locality Input with Google Places Autocomplete */}
          <input
            type="text"
            name={`locality_${address.key}`}
            className="form-control"
            placeholder={translation?.enter_locality || "Enter Locality"}
            ref={(el) => (inputRefs.current[address.key] = el)}
            value={address.locality}
            onChange={(e) => handleChange(address.key, "locality", e.target.value)}
            style={{ width: "50%" }}
          />

          {/* Remove Button (Hidden for the first address) */}
          {addresses.length > 1 && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removeAddress(address.key)}
            >
              {translation?.remove || "Remove"}
            </button>
          )}
        </div>
      ))}

      {/* Add More Button */}
      <button type="button" className="btn btn-primary" onClick={addMoreAddress}>
      {translation?.add_more || "Add More"}
      </button>
    </div>
  );
};

export default BusinessAddressForm;
