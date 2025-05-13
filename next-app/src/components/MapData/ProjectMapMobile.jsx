import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { GeoAlt } from "react-bootstrap-icons";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Button, Form, Offcanvas, Card } from "react-bootstrap";
import './map.css';

const containerStyle = {
    width: "100%",
    height: "100%"
};


const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true
};



export default function ProjectMobileMapView({ loading, projectList }) {
    const translation = useTranslation();
    const [center, setCenter] = useState({
        lat: 0,
        lng: 0
    })

    useEffect(() => {
        if (projectList?.length > 0) {
            const firstProject = projectList[0]
            setCenter({
                lat: parseFloat(firstProject?.address_lat),
                lng: parseFloat(firstProject?.address_lan)
            })
        }
    }, [projectList])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    })
    const { currencyCode, formatPrice } = useAuth();
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [hoveredProperty, setHoveredProperty] = useState(null);
    const [showFullList, setShowFullList] = useState(false);

    console.log("mobile view ran")
    return (
        <>
            <div className="position-relative" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
                {isLoaded ? (<>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={12}
                        options={mapOptions}
                    >
                        {projectList?.map((property) => {
                            return (
                                <Marker
                                    key={property.id}
                                    position={{
                                        lat: parseFloat(property.address_lat),
                                        lng: parseFloat(property.address_lan)
                                    }}
                                    icon={
                                        hoveredProperty?.id == property.id
                                            ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                            : undefined
                                    }
                                    animation={
                                        hoveredProperty?.id == property.id && window?.google
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
                                onCloseClick={() => setHoveredMarkerId(null)}
                            >
                                <div style={{ maxWidth: '200px' }}>
                                    <img
                                        src={
                                            hoveredProperty.gallery?.[0]?.images?.[0]?.file ||
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
                                    <h6 style={{ margin: '8px 0 4px' }}>{hoveredProperty.project_name}</h6>
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
                                            selectedMarker.gallery?.[0]?.images?.[0]?.file ||
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
                    <div>loading...</div>
                </>)}
            </div>

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
                                        data={projectList[0]}
                                        showSq={true}
                                        keyword={"gallery"}
                                        icons={true}
                                        showFavIcon={false}
                                        showImgCount={false}
                                    />
                                </div>
                                <div className="ms-2 flex-grow-1">
                                    <div className="text-primary fw-semibold small">
                                        {formatPrice(projectList?.exp_price) || ""}
                                    </div>
                                    <div className="small fw-semibold text-truncate" style={{ maxWidth: '100%' }}>
                                        {projectList?.property_name}
                                    </div>
                                    <div className="text-muted small d-flex justify-content-between mt-1" style={{ maxWidth: '100%' }}>
                                        <small><i className="icon-img-bed"></i> {projectList?.bedrooms || ''}</small>
                                        <small><i className="icon-img-tub"></i> {projectList?.bathroom || ''}</small>
                                        <small><i className="icon-img-ratio"></i> {projectList?.carpet_area || ''}</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>

                </div>
            )}

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
                    {projectList?.map((project, i) => {
                        return (
                            <Card className="mb-3 shadow-sm border-0 rounded-3" key={i} onClick={() => {
                                setHoveredProperty(project);
                                setShowFullList(false);
                            }}>
                                <Card.Body className="p-2 d-flex align-items-start">
                                    <div style={{ width: '100px', height: '75px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                        <CardImageSlider
                                            data={project}
                                            showSq={true}
                                            keyword={"gallery"}
                                            icons={true}
                                            showFavIcon={false}
                                            showImgCount={false}
                                        />
                                    </div>

                                    <div className="ms-2 flex-grow-1">
                                        <div className="text-primary fw-semibold small mb-1">
                                            {formatPrice(project?.expected_price) || ""}
                                        </div>
                                        <div className="small fw-semibold text-truncate" style={{ maxWidth: '100%' }}>
                                            {project.project_name}
                                        </div>
                                        <div className="d-flex justify-content-between mt-1 text-muted small" style={{ maxWidth: '100%' }}>
                                            {project?.occupied_area && (
                                                <small><i className="icon-img-ratio"></i> {project.occupied_area} {project?.project?.unit_type}</small>
                                            )}
                                            {project?.total_area && (
                                                <small><i className="icon-img-ratio"></i> {project.total_area} {project?.project?.unit_type}</small>
                                            )}
                                            {project?.possession_status && (
                                                <small><i className="icon-img-check"></i> {project.possession_status}</small>
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
    )
}

