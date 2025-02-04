import React from "react";

const GoogleMapEmbed = ({ lat, lng }) => {
  const googleMapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7365.550470855868!2d${lng}!3d${lat}!3m2!1i1024!2i768!4f13.1!5m2!1sen!2sin`;

  return (
    <iframe
      src={googleMapUrl}
      height="300"
      style={{
        border: "0",
        borderRadius: "10px",
        marginBottom: "1rem",
        width: "100%",
      }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default GoogleMapEmbed;


{/* <GoogleMapEmbed lat={detailsData?.latitude || "22.624867"} lng={detailsData?.longitude || "88.440232"}/> */}