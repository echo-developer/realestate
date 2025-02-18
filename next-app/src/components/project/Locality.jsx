import { useEffect, useRef } from "react"
import { GoogleMap, LoadScript, useLoadScript } from "@react-google-maps/api"


const Locality = ({libraries, locality, setLocality}) => {
    const inputRef = useRef();
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: libraries || ["places"],
    })

    useEffect(() => {
        inputRef.current.value = locality
    }, [])

    useEffect(() => {
        if (!isLoaded || loadError) return;
    
        const options = {
            componentRestrictions: { country: "ind" },
            fields: ["address_components", "geometry", "formatted_address"],
        };
    
        const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, options);
        autocompleteInstance.addListener("place_changed", () => {
            handlePlaceChanged(autocompleteInstance);
        });
    
        // Move the autocomplete dropdown to the body
        setTimeout(() => {
            document.querySelectorAll(".pac-container").forEach((el) => {
                el.style.zIndex = "9999"; // Ensure it appears above everything
                el.style.position = "absolute"; // Ensure it's properly positioned
            });
        }, 500); // Delay to ensure Google injects the element
    
    }, [isLoaded, loadError]);


    const handlePlaceChanged = (placeInstance) => {
        const place = placeInstance?.getPlace();
        if(place?.formatted_address) {
            const localityStr = place?.formatted_address?.split(", ")?.[0];
            setLocality(localityStr)
        }
    }
  return (
    <>
    <label>Enter the value for locality:</label>
            <input
              type="text"
              className="modal-input"
              ref={inputRef}
            />
    </>
  )
}

export default Locality
