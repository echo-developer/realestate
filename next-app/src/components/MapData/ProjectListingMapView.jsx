import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api"
import { GeoAlt } from "react-bootstrap-icons";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";


const containerStyle = {
  width: "100%",
  height: "100vh"
};


const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true
};



export default function ProjectListingMapView({ loading, projectList }) {
    console.log("projectList", projectList);
  const translation = useTranslation();
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0
  })

  useEffect(() => {
    if(projectList?.length > 0) {
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
  const { formatPrice } = useAuth();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);

  return (
    <h2>hello</h2>
  )
}