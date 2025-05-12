import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { GeoAlt } from "react-bootstrap-icons";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import { DropdownButton, Dropdown } from 'react-bootstrap'


const containerStyle = {
  width: "100%",
  height: "100vh"
};


const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true
};



export default function ListingMapView({ 
  loading,
  propertyList,
   }) {
  const translation = useTranslation();
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0
  })

useEffect(() => {
  if (propertyList?.length > 0) {
    const firstProperty = propertyList[0];
    let lat = parseFloat(firstProperty?.address_lat);
    let lng = parseFloat(firstProperty?.address_lan);

    if (isNaN(lat) || isNaN(lng)) {
      const secondProperty = propertyList[1];
      if (secondProperty) {
        lat = parseFloat(secondProperty?.address_lat);
        lng = parseFloat(secondProperty?.address_lan);
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      const thirdProperty = propertyList[2];
      if (thirdProperty) {
        lat = parseFloat(thirdProperty?.address_lat);
        lng = parseFloat(thirdProperty?.address_lan);
      }
    }

    if (!isNaN(lat) && !isNaN(lng)) {
      setCenter({
        lat: lat,
        lng: lng,
      });
    }
  }
}, [propertyList]);


  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  })
  const { defaultCity, formatPrice } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  return (
    <>
    
    <div className="row">
        <div className="col-lg p-4" style={{ background: "#f8f9fa", height: "100vh", overflowY: "auto" }}>
          <div className="list-display">
            {loading ? (
              <>
                <ShimmerContentBlock
                  title
                  text
                  cta
                  thumbnailWidth={350}
                  thumbnailHeight={50}
                />
                <ShimmerContentBlock
                  title
                  text
                  cta
                  thumbnailWidth={350}
                  thumbnailHeight={50}
                />
              </>
            ) : !loading && propertyList?.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50vh",
                  textAlign: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                <p>{translation?.no_result_found || "No result found"}</p>
              </div>
            ) : (
              propertyList?.map((property, i) => (
                <div key={property.property_id} className={`card card-ads ${selectedMarker?.property_id == property?.property_id ? 'border border-primary bg-primary bg-opacity-10' : ''}`}
                  onMouseEnter={() => {
                    setHoveredProperty(property)
                  }}
                  onMouseLeave={() => {
                    setHoveredProperty(null)
                  }}
                >
                  <div className="row g-0">
                    <div className="col-lg-3 col-sm-3">
                      <CardImageSlider
                        data={property}
                        showSq={true}
                        icons={true}
                        showFavIcon={false}
                      // addRemoveFav={() =>
                      //   SaveFavouriteProperty(property.property_id)
                      // }
                      />
                    </div>
                    <div className="col-lg-9 col-sm-9 position-relative">
                      <div className="card-body">
                        <h4 className="mb-1">
                          <Link href={`/property-details/${property.slug}`}>
                            {property.property_name}
                          </Link>
                        </h4>
                        <h5 className="mb-0">
                          {formatPrice(property?.exp_price) || "Price not Available"}
                        </h5>
                        <p className="mb-1">
                        </p>
                        <ul className="list-info mb-2">
                          <li>
                            <i
                              className="icon-img-bed"
                              title="Bedrooms:"
                            ></i>
                            <span>
                              {property?.bedrooms ? property.bedrooms : <span className="text-muted">Not Available</span>}
                            </span>
                            {property?.bedrooms && " Beds"}
                          </li>
                          <li>
                            <i
                              className="icon-img-tub"
                              title="Bathrooms:"
                            ></i>
                            <span>
                              {property?.bathroom ? property.bathroom : <span className="text-muted">Not Available</span>}
                            </span>
                            {property?.bathroom && " Bath"}
                          </li>
                          <li>
                            {property?.area_in_sqft && (
                              <i
                                className="icon-img-ratio"
                                title="Carpet Area:"
                              ></i>
                            )}
                            <span>
                              {property?.area_in_sqft ? `${property?.area_in_sqft} sqft` : "Not Available"}{" "}
                            </span>
                            {property?.carpet_area && " Carpet Area"}
                          </li>
                          {property?.possession_status && (
                            <li>
                              <i
                                className="icon-img-check"
                                title="Possession Status"
                              ></i>
                              <span>{property.possession_status}</span>
                            </li>
                          )}

                        </ul>
                        <p>
                          <span className="text-primary">
                            <GeoAlt color="currentColor" size={14} />
                          </span>{" "}
                          {property.address || "Not Available"}
                        </p>
                      </div>
                      <div className="card-footer d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                          <img
                            className="rounded-circle"
                            src={`${property?.user_image ||
                              "/assets/images/user.jpg"
                              }`}
                            alt="Company"
                            height={36}
                            width={36}
                          />
                          <div className="ps-2">
                            <h6 className="mb-0">
                              {property?.user_name || "User"}
                            </h6>
                            <p className="small text-muted">
                              {property?.user_type === "A"
                                ? "Agent"
                                : property?.user_type === "/"
                                  ? "Builder"
                                  : property?.user_type === "O"
                                    ? "Owner"
                                    : "Not Available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="col-lg p-0">
          <div style={{ height: '900px', width: '100%' }}>
            {isLoaded ? (<>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                options={mapOptions}
              >
                {propertyList?.map((property) => {
                  return (
                    <Marker
                      key={property.id}
                      position={{
                        lat: parseFloat(property.address_lat),
                        lng: parseFloat(property.address_lan)
                      }}
                      icon={
                        hoveredProperty == property.property_id
                          ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          : undefined
                      }
                      animation={
                        hoveredProperty == property.property_id && window?.google
                          ? window.google.maps.Animation.BOUNCE
                          : undefined
                      }
                      onClick={() => setSelectedMarker(property)}
                    />
                  )
                })}
                {/* {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(selectedMarker?.address_lat),
                      lng: parseFloat(selectedMarker?.address_lan)
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div style={{ maxWidth: "200px" }}>
                      <img
                        src={
                          selectedMarker.galleries?.[0]?.images?.[0]?.image_url ||
                          "/assets/images/property/default-property-1.jpg"
                        }
                        alt="Property"
                        style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <h6 style={{ margin: "8px 0 4px" }}>{selectedMarker.property_name}</h6>
                      <p style={{ fontSize: "12px", margin: 0 }}>{selectedMarker.address}</p>
                    </div>
                  </InfoWindow>
                )} */}
                {hoveredProperty && !selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(hoveredProperty.address_lat),
                      lng: parseFloat(hoveredProperty.address_lan)
                    }}
                    onCloseClick={() => setHoveredMarkerId(null)}
                  >
                    <div style={{ maxWidth: '200px' }}>
                      <img
                        src={
                          hoveredProperty.galleries?.[0]?.images?.[0]?.image_url ||
                          '/assets/images/property/default-property-1.jpg'
                        }
                        alt="Property"
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <h6 style={{ margin: '8px 0 4px' }}>{hoveredProperty.property_name}</h6>
                      <p style={{ fontSize: '12px', margin: 0 }}>{hoveredProperty.address}</p>
                    </div>
                  </InfoWindow>
                )}

                {selectedMarker && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(selectedMarker.address_lat),
                      lng: parseFloat(selectedMarker.address_lan)
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div style={{ maxWidth: '200px' }}>
                      <img
                        src={
                          selectedMarker.galleries?.[0]?.images?.[0]?.image_url ||
                          '/assets/images/property/default-property-1.jpg'
                        }
                        alt="Property"
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <h6 style={{ margin: '8px 0 4px' }}>{selectedMarker.property_name}</h6>
                      <p style={{ fontSize: '12px', margin: 0 }}>{selectedMarker.address}</p>
                    </div>
                  </InfoWindow>
                )}


              </GoogleMap>
            </>) : (<>
              <div>Loading...</div>
            </>)}
          </div>
        </div>
      </div>
    </>
  )
}