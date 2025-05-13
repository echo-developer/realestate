import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { GeoAlt } from "react-bootstrap-icons";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col } from "react-bootstrap";
import './map.css';

const containerStyle = {
  width: "100%",
  height: "100%"
};


const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true
};



export default function ProjectListingMapView({ loading, projectList }) {
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

  return (
    
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
          ) : !loading && projectList?.length === 0 ? (
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
            {projectList?.map((project, i) => {
              return (
                <Col className="col-sm-6">
                <div key={project.id} className="card card-ads" 
                  onMouseEnter={() => {
                    setHoveredProperty(project)
                  }}
                  onMouseLeave={() => {
                    setHoveredProperty(null)
                  }}
                >
                  <CardImageSlider
                    data={project}
                    keyword={"gallery"}
                    showSq={true}
                    icons={false}
                  />                                
                  <div className="card-body position-relative">
                    <h4>
                      <Link href={`/project-details/${project.slug}`}>
                        {project.project_name}
                      </Link>
                    </h4>
                    <h5 className="mb-0">
                      {formatPrice(project?.expected_price) || "Price not available"}

                    </h5>
                    <p className="mb-1">
                      <small>
                        {translation?.price_per_sqft || "Price Per sqft:"}{" "}
                        {project?.price_per_sqft ? (<>
                          {`${currencyCode} `} {project?.price_per_sqft}
                        </>) : ('Not Available')}
                      </small>
                    </p>

                    <ul className="list-info mb-2">
                      <li>
                        <i className="icon-img-ratio" title="Carpet Area"></i>
                        <span>
                          {translation?.occupied_area || "Occupied"}:{" "}
                          {project?.occupied_area || "Not Available"}{" "}
                          {project?.occupied_area && project?.unit_type}
                        </span>
                      </li>
                      <li>
                        <i className="icon-img-ratio" title="Total Area"></i>
                        <span>
                          {translation?.total_area || "Total"}:{" "}
                          {project?.project_size || "Not Available"}{" "}
                          {project?.project_size && project?.unit_type}
                        </span>
                      </li>
                      <li>
                        <i className="icon-img-check" title="Possession Status"></i>
                        <span>
                          {project?.possession_status || "Not Available"}
                        </span>
                      </li>
                      <li>
                        <i className="icon-img-tower" title="Total Tower"></i>
                        <span>
                          {translation?.total_tower || "Total Tower"}:{" "}
                          {project?.total_tower || "Not Available"}
                        </span>
                      </li>

                      <li>
                        <i className="icon-img-project" title="Total Unit"></i>
                        <span>
                          {translation?.total_unit || "Total Unit:"}{" "}
                          {project?.total_unit || "Not Available"}
                        </span>
                      </li>
                    </ul>
                    <p className="mb-1">
                      <i className="icon-feather-map-pin me-1"></i>
                      {project.address}
                    </p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <div className="ps-1">
                        <h6 className="mb-0">
                          {project?.developer_name || "Developer Name"}
                        </h6>
                        <p className="small text-muted">Developer</p>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleContactClick(project.id)}
                    >
                      {translation?.contact_now || "Contact Now"}
                    </button>
                  </div>                                        
                </div>
                </Col>
              )
            })}
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
            <div></div>
          </>)}
        </div>
      </Col>
    </Row>  
  )
}

