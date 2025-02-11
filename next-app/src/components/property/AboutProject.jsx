import React from 'react'
import Link from 'next/link'

const AboutProject = ({projectData}) => {
  
  const price = formatToLacCr(projectData?.project_budget)
  return (
    <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
      marginBottom:'20px',
      backgroundColor:'white'
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>About Project</h2>
      <Link
      target='_blank'
        href={`/project-details/${projectData?.slug}`}
        style={{
          color: "black",
          fontWeight: "bold",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        Explore Project <span style={{ marginLeft: "5px" }}>➝</span>
      </Link>
    </div>

    {/* Project Info */}
    <div style={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
      <img
        src="/assets/images/property/default-property-1.jpg"
        alt="Project"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "4px",
          marginRight: "16px",
        }}
      />
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>{projectData?.project_name || "Not available"}</h3>
        <p style={{ fontSize: "14px", color: "#555", margin: "4px 0 0" }}>
          {projectData?.project_desc || "Not available"}
        </p>
      </div>
    </div>

    {/* Details Section */}
    <div style={{ display: "flex", marginTop: "16px", fontSize: "14px" }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Occupied & total Area</p>
        <p style={{ fontWeight: "bold" }}>{projectData?.occupied_area ||"Not Available"} sq/ft , {projectData?.total_area ||"Not Available"} sq/ft</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Configuration</p>
        <p style={{ fontWeight: "bold" }}>2, 4 BHK Flats</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Tower & Unit</p>
        <p style={{ fontWeight: "bold" }}>{projectData?.total_towers ||"Not Available"} Towers, {projectData?.total_units ||"Not Available"} Units</p>
      </div>
    </div>

    {/* Price */}
    {price && (
      <div style={{ marginTop: "16px" }}>
      <p style={{ color: "#777", marginBottom: "4px" }}>Price</p>
      <p style={{ fontWeight: "bold" }}>{price  || "Not available"}</p>
    </div>
    )}

    {/* Buttons */}
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>

      <button
        style={{
          border: "1px solid #ddd",
          padding: "10px 16px",
          borderRadius: "20px",
          fontWeight: "bold",
          backgroundColor: "white",
          cursor: "pointer",
        }}
      >
        Download Brochure
      </button>
    </div>
  </div>
  )
}

export default AboutProject

function formatToLacCr(range) {
  if (!range) return "";

  const [min, max] = range.split("-").map(Number);
  
  if (isNaN(min) || isNaN(max)) return "Invalid Input";

  const formatNumber = (num) => {
      if (num >= 10000000) {
          return (num / 10000000).toFixed(1) +" "+ "Cr ";
      } else if (num >= 100000) {
          return (num / 100000).toFixed(1) + " "+"Lac ";
      } else {
          return num.toLocaleString();
      }
  };

  return `${formatNumber(min)} - ${formatNumber(max)}`;
}
