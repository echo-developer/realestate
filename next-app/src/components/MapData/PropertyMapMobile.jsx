import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { ChevronUp, GeoAlt } from "react-bootstrap-icons";
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
                    style={{ zIndex: 1030, padding: '1rem', height: '220px' }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0">Properties for sale in UAE</h5>
                        <Button variant="light" size="sm" onClick={() => setShowFullList(true)}>
                            <ChevronUp size={18} />
                        </Button>
                    </div>

                    {/* First property preview */}
                    <div className="property-card-wrapper mb-2">
                        <Card className="card-ads h-100 shadow-sm border-0 rounded-3">
                            <Row className="gx-0">
                                <Col xs='auto'>
                                    <div class="card-image" style={{ width: '120px', height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <CardImageSlider
                                            data={propertyList[0]}
                                            showSq={true}
                                            icons={true}
                                            showFavIcon={false}
                                            showImgCount={false}
                                        />
                                    </div>
                                </Col>
                                <Col xs>
                                    <Card.Body className="py-2">                                                                   
                                        <h5 className="small fw-semibold text-truncate">
                                            {propertyList[0]?.property_name}
                                        </h5>
                                        <h5>
                                            {formatPrice(propertyList[0]?.exp_price) || ""}
                                        </h5>
                                        <p className="small mb-2">
                                            <span className="text-primary">
                                                <GeoAlt color="currentColor" size={14} />
                                            </span>{" "}
                                            {propertyList[0].address || "Not Available"}
                                        </p>
                                        <div className="d-flex gap-3">
                                            <span><i className="icon-img-bed"></i> {propertyList[0]?.bedrooms || ''}</span>
                                            <span><i className="icon-img-tub"></i> {propertyList[0]?.bathroom || ''}</span>
                                            {propertyList[0]?.area_in_sqft && (
                                                <span><i className="icon-img-ratio"></i> {propertyList[0].area_in_sqft} sqft</span>
                                            )}
                                        </div>                                    
                                    </Card.Body>
                                </Col>
                            </Row>
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
                    <Offcanvas.Title>Properties for sale in UAE</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {propertyList?.map((property, i) => {
                        return (
                            <Card className="card-ads h-auto mb-3 shadow-sm border-0 rounded-3" key={i} onClick={() => {
                                setHoveredProperty(property);
                                setShowFullList(false);
                            }}>
                                <Row className="gx-0">
                                    <Col xs='auto'>
                                        <div className="card-image" style={{ width: '120px', height: '80px', borderRadius: '4px', overflow: 'hidden'}}>
                                            <CardImageSlider
                                                data={property}
                                                showSq={true}
                                                icons={true}
                                                showFavIcon={false}
                                                showImgCount={false}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs>
                                        <Card.Body className="py-2">                                    
                                            <h5 className="small fw-semibold text-truncate">
                                                {property?.property_name}
                                            </h5>
                                            <h5>
                                                {formatPrice(property?.exp_price) || ""}
                                            </h5>
                                            <p className="small mb-2">
                                                <span className="text-primary">
                                                    <GeoAlt color="currentColor" size={14} />
                                                </span>{" "}
                                                {property.address || "Not Available"}
                                            </p>
                                            <div className="d-flex gap-3">
                                                {property?.bedrooms && (
                                                    <span><i className="icon-img-bed"></i> {property.bedrooms}</span>
                                                )}
                                                {property?.bathroom && (
                                                    <span><i className="icon-img-tub"></i> {property.bathroom}</span>
                                                )}
                                                {property?.area_in_sqft && (
                                                    <span><i className="icon-img-ratio"></i> {property.area_in_sqft} sqft</span>
                                                )}                                            
                                            </div>

                                        
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>

                        )
                    })}
                </Offcanvas.Body>
            </Offcanvas>
        </>

    );
}