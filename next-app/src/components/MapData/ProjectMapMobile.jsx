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

    return (
        <>
            <div className="position-relative" style={{ height: '75vh', width: '100vw', overflow: 'hidden' }}>
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
                        <h5 className="fw-bold mb-0">Projects in UAE</h5>
                        <Button variant="light" size="sm" onClick={() => setShowFullList(true)}>
                            <i className="bi bi-chevron-up" />
                        </Button>
                    </div>

                    {/* First property preview */}
                    <div className="property-card-wrapper mb-2">
                        <Card className="card-ads h-auto">
                            <Row className="gx-0">
                                <Col xs='auto'>
                                    <div class="card-image" style={{ width: '120px', height: '120px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <CardImageSlider
                                            data={projectList[0]}
                                            showSq={true}
                                            keyword={"gallery"}
                                            icons={true}
                                            showFavIcon={false}
                                            showImgCount={false}
                                        />
                                    </div>
                                </Col>
                                <Col xs>
                                    <Card.Body className="py-2 pe-0">
                                        <h5 className="small fw-semibold text-truncate">
                                            {projectList[0]?.project_name}
                                        </h5>
                                        <h5>
                                            {formatPrice(projectList[0]?.expected_price) || ""}
                                        </h5>
                                        <p className="small mb-1">
                                            <i className="icon-feather-map-pin me-1"></i>
                                            {projectList[0].address}
                                        </p>
                                        <div className="d-flex flex-wrap column-gap-3">
                                            {projectList[0]?.occupied_area && (
                                                <span>
                                                    <i className="icon-img-ratio"></i> {projectList[0].occupied_area} {projectList[0]?.unit_type}
                                                </span>
                                            )}
                                            {projectList[0]?.project_size && (
                                                <span>
                                                    <i className="icon-img-ratio"></i> {projectList[0].project_size} {projectList[0].unit_type}
                                                </span>
                                            )}
                                            {projectList[0]?.possession_status && (
                                                <span>
                                                    <i className="icon-img-check"></i> {projectList[0].possession_status}
                                                </span>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
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
                    <Offcanvas.Title>Projects in UAE</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {projectList?.map((project, i) => {
                        return (
                            <Card className="card-ads h-auto mb-3" key={i} onClick={() => {
                                setHoveredProperty(project);
                                setShowFullList(false);
                            }}>
                                <Row className="gx-0">
                                    <Col xs='auto'>
                                        <div className="card-image" style={{ width: '120px', height: '120px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                                            <CardImageSlider
                                                data={project}
                                                showSq={true}
                                                keyword={"gallery"}
                                                icons={true}
                                                showFavIcon={false}
                                                showImgCount={false}
                                            />
                                        </div>
                                    </Col>
                                    <Col xs>
                                        <Card.Body className="py-2">
                                            <h5 className="small fw-semibold text-truncate">
                                                {project.project_name}
                                            </h5>
                                            <h5>
                                                {formatPrice(project?.expected_price) || ""}
                                            </h5>
                                            <p className="small mb-1">
                                                <i className="icon-feather-map-pin me-1"></i>
                                                {project.address}
                                            </p>
                                            <div className="d-flex flex-wrap column-gap-3">
                                                {project?.occupied_area && (
                                                    <span><i className="icon-img-ratio"></i> {project.occupied_area} {project?.unit_type}</span>
                                                )}
                                                {project?.project_size && (
                                                    <span><i className="icon-img-ratio"></i> {project.project_size} {project?.unit_type} </span>
                                                )}
                                                {project?.possession_status && (
                                                    <span><i className="icon-img-check"></i> {project.possession_status}</span>
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
    )
}

