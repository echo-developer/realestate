'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import Link from 'next/link';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoAlt } from "react-bootstrap-icons";
import { ShimmerContentBlock } from 'react-shimmer-effects';
import CardImageSlider from '../cardImageSlider/CardImageSlider';
import { useAuth } from '@/context/AuthProvider';
import useTranslation from '@/hooks/useTranslation';
import { useState } from 'react';
import FitBounds from "../../components/MapData/FitBounds"
import { useMap } from 'react-leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const highlightIcon = new L.Icon({
  // iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});



const tempProperties = [
  {
    property_name: "some random name",
    post_for: "sell",
    property_id: 1,
    image_count: 2,
    is_favorite: true,
    user_name: "Sarah Thompson",
    user_type: "A",
    user_image: "http://localhost/realestate/hackground/public/user_upload/profile_image/1740136514-8.jpg",
    property_name: null,
    slug: null,
    views: 0,
    is_featured: 0,
    is_populer: 0,
    parking_ability: null,
    property_type_for: "Apartments / Flats",
    property_type: "Residential",
    possession_status: null,
    construct_year: null,
    possession_month: null,
    possession_year: null,
    bedrooms: null,
    bathroom: null,
    unit_type: "sqm",
    price_currency: null,
    exp_price: 1400000,
    price_per_sqft: 32512.77,
    property_size: 4,
    area_in_sqft: "43.06",
    created_at: "2025-01-29 14:03:03",
    address: "Kolkata",
    address_lat: "22.5726",
    address_lan: "88.3639",
    galleries: []
  },
  {
    property_name: "some random name",
    post_for: "sell",
    property_id: 2,
    image_count: 1,
    is_favorite: false,
    user_name: "Ravi Mehta",
    user_type: "A",
    user_image: "http://localhost/realestate/hackground/public/user_upload/profile_image/dummy2.jpg",
    property_name: null,
    slug: null,
    views: 12,
    is_featured: 1,
    is_populer: 0,
    parking_ability: null,
    property_type_for: "Apartments / Flats",
    property_type: "Residential",
    possession_status: null,
    construct_year: null,
    possession_month: null,
    possession_year: null,
    bedrooms: 2,
    bathroom: 1,
    unit_type: "sqm",
    price_currency: null,
    exp_price: 1800000,
    price_per_sqft: 30000,
    property_size: 6,
    area_in_sqft: "60.00",
    created_at: "2025-02-05 11:23:00",
    address: "Shyambazar, Kolkata",
    address_lat: "22.5855",
    address_lan: "88.3460",
    galleries: []
  },
  {
    property_name: "some random name",
    post_for: "sell",
    property_id: 3,
    image_count: 3,
    is_favorite: true,
    user_name: "Ayesha Khan",
    user_type: "B",
    user_image: "http://localhost/realestate/hackground/public/user_upload/profile_image/dummy3.jpg",
    property_name: null,
    slug: null,
    views: 5,
    is_featured: 0,
    is_populer: 1,
    parking_ability: null,
    property_type_for: "Apartments / Flats",
    property_type: "Residential",
    possession_status: null,
    construct_year: null,
    possession_month: null,
    possession_year: null,
    bedrooms: 3,
    bathroom: 2,
    unit_type: "sqm",
    price_currency: null,
    exp_price: 2500000,
    price_per_sqft: 35000,
    property_size: 7,
    area_in_sqft: "71.20",
    created_at: "2025-03-10 09:15:00",
    address: "Ballygunge, Kolkata",
    address_lat: "22.5315",
    address_lan: "88.3600",
    galleries: []
  },
  {
    property_name: "some random name",
    post_for: "sell",
    property_id: 4,
    image_count: 1,
    is_favorite: false,
    user_name: "John D'Souza",
    user_type: "A",
    user_image: "http://localhost/realestate/hackground/public/user_upload/profile_image/dummy4.jpg",
    property_name: null,
    slug: null,
    views: 0,
    is_featured: 0,
    is_populer: 0,
    parking_ability: null,
    property_type_for: "Apartments / Flats",
    property_type: "Residential",
    possession_status: null,
    construct_year: null,
    possession_month: null,
    possession_year: null,
    bedrooms: 1,
    bathroom: 1,
    unit_type: "sqm",
    price_currency: null,
    exp_price: 950000,
    price_per_sqft: 28000,
    property_size: 3,
    area_in_sqft: "33.92",
    created_at: "2025-04-01 08:40:00",
    address: "Salt Lake Sector V, Kolkata",
    address_lat: "22.5720",
    address_lan: "88.3990",
    galleries: []
  },
  {
    property_name: "some random name",
    post_for: "sell",
    property_id: 5,
    image_count: 2,
    is_favorite: true,
    user_name: "Meera Banerjee",
    user_type: "B",
    user_image: "http://localhost/realestate/hackground/public/user_upload/profile_image/dummy5.jpg",
    property_name: null,
    slug: null,
    views: 18,
    is_featured: 1,
    is_populer: 1,
    parking_ability: null,
    property_type_for: "Apartments / Flats",
    property_type: "Residential",
    possession_status: null,
    construct_year: null,
    possession_month: null,
    possession_year: null,
    bedrooms: 4,
    bathroom: 3,
    unit_type: "sqm",
    price_currency: null,
    exp_price: 3200000,
    price_per_sqft: 37000,
    property_size: 9,
    area_in_sqft: "86.48",
    created_at: "2025-04-15 16:50:00",
    address: "Tollygunge, Kolkata",
    address_lat: "22.4995",
    address_lan: "88.3192",
    galleries: []
  }
];



const ListingMapView = ({ propertyList, loading }) => {
  const { formatPrice } = useAuth();
  const translation = useTranslation();
  const [previewPos, setPreviewPos] = useState(null);
  const [hoveredPropertyIndex, setHoveredPropertyIndex] = useState(null);
  const [clickedPropertyIndex, setClickedPropertyIndex] = useState(null);
  const [hoveredPropertyData, setHoveredPropertyData] = useState(null);


  return (
    <>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar – Project Listings */}
          <div className="col-lg p-4" style={{ background: "#f8f9fa", height: "100vh", overflowY: "auto" }}>
            <h4 className="mb-4">New Projects in UAE</h4>

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
              ) : !loading && tempProperties?.length === 0 ? (
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
                tempProperties?.map((property, i) => (
                  <div key={property.property_id} className={`card card-ads ${clickedPropertyIndex == i ? 'border border-primary bg-primary bg-opacity-10' : ''}`}
                    onMouseEnter={() => {
                      setHoveredPropertyIndex(i);
                      setHoveredPropertyData(property);
                    }}
                    onMouseLeave={() => {
                      setHoveredPropertyIndex(null);
                      setHoveredPropertyData(null);
                    }}
                  >
                    <div className="row g-0">
                      <div className="col-lg-3 col-sm-3">
                        <CardImageSlider
                          data={property}
                          showSq={true}
                          icons={true}
                          showFavIcon={false}
                          addRemoveFav={() =>
                            SaveFavouriteProperty(property.property_id)
                          }
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

          {/* Map Container */}
          <div className="col-lg p-0">
            <div style={{ height: '900px', width: '100%' }}>
              <MapContainer
                center={[22.5726, 88.3639]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <FitBounds
                  markers={tempProperties.map(p => [
                    parseFloat(p.address_lat),
                    parseFloat(p.address_lan),
                  ])}
                />

                <HoverPreview
                  hoveredPropertyData={hoveredPropertyData}
                  setPreviewPos={setPreviewPos}
                />

                {tempProperties?.length > 0 && tempProperties?.map((property, i) => {
                  return (
                    <Marker
                      key={i}
                      position={[property?.address_lat, property?.address_lan]}
                      icon={i === hoveredPropertyIndex ? highlightIcon : defaultIcon}
                      eventHandlers={{
                        click: () => {
                          setHoveredPropertyIndex(i);
                          setClickedPropertyIndex(i);
                          setHoveredPropertyData(property);
                        }
                      }}
                    >
                      {i === hoveredPropertyIndex && hoveredPropertyData && (
                        <Tooltip
                          direction="top"
                          offset={[0, -10]}
                          permanent
                          className="custom-tooltip"
                        >
                          <div style={{ width: 200 }}>
                            <img
                              src='/assets/images/property/default-property-1.jpg'
                              alt=""
                              style={{ width: '100%', height: 80, objectFit: 'cover' }}
                            />
                            <h6 style={{ margin: '10px 0 5px' }}>{hoveredPropertyData.property_name}</h6>
                            <small>{hoveredPropertyData.address}</small>
                          </div>
                        </Tooltip>
                      )}
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListingMapView;



const HoverPreview = ({ hoveredPropertyData, setPreviewPos }) => {
  const map = useMap();

  useEffect(() => {
    if (hoveredPropertyData && map) {
      const latLng = L.latLng(
        hoveredPropertyData.address_lat,
        hoveredPropertyData.address_lan
      );
      const containerPoint = map.latLngToContainerPoint(latLng);
      setPreviewPos(containerPoint);
    }
  }, [hoveredPropertyData, map]);

  return null; // This component is only for logic
};
