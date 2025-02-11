import React, { useEffect, useRef } from "react";
import { GoogleMap, LoadScript, useLoadScript } from "@react-google-maps/api";
import { useRouter } from "next/router";



export default function LocalitySearch({ libraries, setLocalityData }) {
  const inputRef = useRef();
  const router = useRouter();
  const {isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries || ["places"],
  })

  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  
  const center = {
    lat: 37.7749, // Latitude
    lng: -122.4194, // Longitude (San Francisco)
  };

  useEffect(() => {
    if(!isLoaded || loadError) {
      return;
    }
    const options = {
      componentRestrictions: { country: "ind" },
      fields: ["address_components", "geometry", "formatted_address"],
    }

    const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, options);
    autocompleteInstance.addListener("place_changed", () => {
      handlePlaceChanged(autocompleteInstance);
    })
     
  }, [isLoaded, loadError])


  useEffect(() => {
    if(router?.isReady) {
      if(router?.query?.location_data) {
        const stringifiedLocalityData = router?.query?.location_data;
        if(stringifiedLocalityData) {
          const localityData = JSON.parse(decodeURIComponent(stringifiedLocalityData));
          if(Array.isArray(localityData) && localityData?.length > 0) {
            const data = localityData[0];
            if(inputRef.current && data?.locality) {
              inputRef.current.value = data.locality;
            }

            const locality = {
              locality: data.locality,
              latitude: data.latitude,
              longitude: data.longitude,
            }

            setLocalityData(locality)
          } else {
            if(localityData?.locality) {
              if(inputRef.current && localityData?.locality) {
                inputRef.current.value = localityData.locality;
              }
  
              const locality = {
                locality: localityData.locality,
                latitude: localityData.latitude,
                longitude: localityData.longitude,
              }
  
              setLocalityData(locality)
            }
          }
        }

      }
    }
  }, [router?.query])

  const handlePlaceChanged = (placeInstance) => {
    const place = placeInstance?.getPlace();

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

    setLocalityData(newLocation)
  } 



  return (
    <div className="col-lg-4 col-12">
  <div className="submit-field">
    <input
      type="text"
      ref={inputRef}
      className="form-control"
      placeholder="Search Locality"
      name="locality"
      id="locality"
    />
  </div>
</div>

  );
}
