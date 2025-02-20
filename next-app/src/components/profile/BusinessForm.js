import React, { useState, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const libraries = ["places"];

const BusinessAddressForm = ({ addresses, setAddresses }) => {
  const { callApi } = AuthUser();
  const [cityData, setCityData] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const inputRefs = useRef([]);

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
        toast.error(response.message || "Data not retreive");
      }
    } catch (error) {}
  };

  console.log(cityData);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    addresses.forEach((_, index) => {
      if (!inputRefs.current[index]) return;

      const options = {
        componentRestrictions: { country: "IN" },
        fields: ["formatted_address", "geometry"],
      };

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRefs.current[index],
        options
      );

      autocomplete.addListener("place_changed", () =>
        handlePlaceChanged(autocomplete, index)
      );
    });
  }, [isLoaded, loadError, addresses]);

  const handlePlaceChanged = (autocomplete, index) => {
    const place = autocomplete.getPlace();
    if (!place || !place.geometry) {
      handleChange(index, "locality", "");
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
      prev.map((addr, i) =>
        i === index
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

  const handleChange = (index, field, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
  };

  const addMoreAddress = () => {
    setAddresses([
      ...addresses,
      {
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

  const removeAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  return (
    <>
      Service Area:
      <div>
        {addresses.map((address, index) => (
          <div className="row mb-3" key={index}>
            {/* City Dropdown */}
            <div className="col-md-5">
              <select
                name={`city_${index}`}
                className="form-control"
                value={address.city}
                onChange={(e) => handleChange(index, "city", e.target.value)}
              >
                <option value="">Select City</option>
                {cityData?.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Locality Input with Google Places Autocomplete */}
            <div className="col-md-5">
              <input
                type="text"
                name={`locality_${index}`}
                className="form-control"
                placeholder="Enter Locality"
                ref={(el) => (inputRefs.current[index] = el)}
                value={address.locality}
                onChange={(e) =>
                  handleChange(index, "locality", e.target.value)
                }
              />
            </div>

            {/* Remove Button (Hidden for the first address) */}
            {index > 0 && (
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeAddress(index)}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add More Button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={addMoreAddress}
        >
          Add More
        </button>
      </div>
    </>
  );
};

export default BusinessAddressForm;
