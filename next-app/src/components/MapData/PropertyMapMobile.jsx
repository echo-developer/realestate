import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { GeoAlt } from "react-bootstrap-icons";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import { Container, Row, Col, Button, Form, Offcanvas, Card } from "react-bootstrap";
// import './map.css';

const containerStyle = {
    width: "100%",
    height: "100%"
};


const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true
};



export default function PropertyMapMobileView({
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


    const [showFullList, setShowFullList] = useState(false);



    return (
        <>
            {/* Full Screen Map Wrapper */}
            <div className="position-relative" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
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
                        {hoveredProperty && !selectedMarker && (
                            <InfoWindow
                                position={{
                                    lat: parseFloat(hoveredProperty.address_lat),
                                    lng: parseFloat(hoveredProperty.address_lan)
                                }}
                                onCloseClick={() => setHoveredProperty(null)}
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

            {/* Bottom Preview Panel */}
            {!showFullList && (
                <div
                    className="position-fixed bottom-0 start-0 end-0 bg-white shadow-lg rounded-top"
                    style={{ zIndex: 1030, padding: '1rem', height: '180px' }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="fw-bold mb-0">Properties for sale in UAE</h6>
                        <Button variant="light" size="sm" onClick={() => setShowFullList(true)}>
                            <i className="bi bi-chevron-up" />
                        </Button>
                    </div>

                    {/* First property preview */}
                    <div className="property-card-wrapper mb-2">
                        <Card className="shadow-sm border-0 rounded-3">
                            <Card.Body className="p-2 d-flex align-items-start">
                                <div style={{ width: '100px', height: '75px', borderRadius: '6px', overflow: 'hidden' }}>
                                    <CardImageSlider
                                        data={propertyList[0]}
                                        showSq={true}
                                        icons={true}
                                        showFavIcon={false}
                                        showImgCount={false}
                                    />
                                </div>
                                <div className="ms-2 flex-grow-1">
                                    <div className="text-primary fw-semibold small">
                                        {formatPrice(propertyList[0]?.exp_price) || ""}
                                    </div>
                                    <div className="small fw-semibold text-truncate" style={{ maxWidth: '100%' }}>
                                        {propertyList[0]?.property_name}
                                    </div>
                                    <div className="text-muted small d-flex justify-content-between mt-1" style={{ maxWidth: '100%' }}>
                                        <small><i className="icon-img-bed"></i> {propertyList[0]?.bedrooms || ''}</small>
                                        <small><i className="icon-img-tub"></i> {propertyList[0]?.bathroom || ''}</small>
                                        <small><i className="icon-img-ratio"></i> {propertyList[0]?.carpet_area || ''}</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                </div>
            )}

            {/* Full Offcanvas Property List */}
            <Offcanvas
                show={showFullList}
                onHide={() => setShowFullList(false)}
                placement="bottom"
                className="h-75"
                scroll={true}
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title></Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {propertyList?.map((property, i) => {
                        return (
                            <Card className="mb-3 shadow-sm border-0 rounded-3" key={i} onClick={() => {
                                setHoveredProperty(property);
                                setShowFullList(false);
                            }}>
                                <Card.Body className="p-2 d-flex align-items-start">
                                    <div style={{ width: '100px', height: '75px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                        <CardImageSlider
                                            data={property}
                                            showSq={true}
                                            icons={true}
                                            showFavIcon={false}
                                            showImgCount={false}
                                        />
                                    </div>

                                    <div className="ms-2 flex-grow-1">
                                        <div className="text-primary fw-semibold small mb-1">
                                            {formatPrice(property?.exp_price) || ""}
                                        </div>
                                        <div className="small fw-semibold text-truncate" style={{ maxWidth: '100%' }}>
                                            {property?.property_name}
                                        </div>
                                        <div className="d-flex justify-content-between mt-1 text-muted small" style={{ maxWidth: '100%' }}>
                                            {property?.bedrooms && (
                                                <small><i className="icon-img-bed"></i> {property.bedrooms}</small>
                                            )}
                                            {property?.bathroom && (
                                                <small><i className="icon-img-tub"></i> {property.bathroom}</small>
                                            )}
                                            {property?.carpet_area && (
                                                <small><i className="icon-img-ratio"></i> {property.carpet_area}</small>
                                            )}
                                        </div>

                                    </div>
                                </Card.Body>
                            </Card>


                        )
                    })}
                </Offcanvas.Body>
            </Offcanvas>
        </>

    );

    return (
        <>

            <Row className="gx-2">
                <Col lg={6} xs={12} className="mapViewScroll">
                    <div className="grid-display scroll">
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
                            <Row>
                                {propertyList?.map((property, i) => (
                                    <Col className="col-sm-6">
                                        <div key={property.property_id} className={`card card-ads ${selectedMarker?.property_id == property?.property_id ? 'border border-primary bg-primary bg-opacity-10' : ''}`}
                                            onMouseEnter={() => {
                                                setHoveredProperty(property)
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredProperty(null)
                                            }}
                                        >


                                            <CardImageSlider
                                                data={property}
                                                showSq={true}
                                                icons={true}
                                                showFavIcon={false}
                                            // addRemoveFav={() =>
                                            //   SaveFavouriteProperty(property.property_id)
                                            // }
                                            />

                                            <div className="card-body position-relative">
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
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </Col>
                <Col lg={6} xs={12}>
                    <div className="googleMap">
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
                </Col>
            </Row>
        </>
    )
}