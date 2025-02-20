import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique keys
import AuthUser from "../Authentication/AuthUser";

const libraries = ["places"];

const BusinessAddressForm = ({ addresses, setAddresses }) => {
  const { callApi } = AuthUser();
  const [cityData, setCityData] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

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
      if (!inputRefs.current[address.id]) return;

      const options = {
        componentRestrictions: { country: "IN" },
        fields: ["formatted_address", "geometry"],
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRefs.current[address.id],
        options
      );

      autocomplete.addListener("place_changed", () =>
        handlePlaceChanged(autocomplete, address.id)
      );
    });
  }, [isLoaded, loadError, addresses]);

  const handlePlaceChanged = (autocomplete, id) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry) {
      handleChange(id, "locality", "");
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
        addr.id === id
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

  const handleChange = (id, field, value) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, [field]: value } : addr))
    );
  };

  const addMoreAddress = () => {
    setAddresses([
      ...addresses,
      {
        id: uuidv4(),
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

  const removeAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <>
      <div>
        {addresses.map((address) => (
          <div className="d-flex align-items-center gap-2 mb-3" key={address.id}>
            {/* City Dropdown */}
            <select
              name={`city_${address.id}`}
              className="form-control"
              value={address.city}
              onChange={(e) => handleChange(address.id, "city", e.target.value)}
              style={{ color: address.city ? "#000" : "#6c757d", width: "30%" }}
            >
              <option value="" disabled>
                Select City
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
              name={`locality_${address.id}`}
              className="form-control"
              placeholder="Enter Locality"
              ref={(el) => (inputRefs.current[address.id] = el)}
              value={address.locality}
              onChange={(e) => handleChange(address.id, "locality", e.target.value)}
              style={{ width: "50%" }}
            />

            {/* Remove Button (Hidden for the first address) */}
            {addresses.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeAddress(address.id)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Add More Button */}
        <button type="button" className="btn btn-primary" onClick={addMoreAddress}>
          Add More
        </button>
      </div>
    </>
  );
};

export default BusinessAddressForm;
