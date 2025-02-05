import React from 'react'

const AboutProject = ({projectData}) => {

    console.log("about project project data", projectData);
  return (
    <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    }}
  >
    {/* Header */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>About Project</h2>
      <a
        href="#"
        style={{
          color: "red",
          fontWeight: "bold",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        Explore Project <span style={{ marginLeft: "5px" }}>➝</span>
      </a>
    </div>

    {/* Project Info */}
    <div style={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTABbXr4i-QODqhy7tofHYmTYh05rYPktzacw&s"
        alt="Project"
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "4px",
          marginRight: "16px",
        }}
      />
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>{projectData?.project_name}</h3>
        <p style={{ fontSize: "14px", color: "#555", margin: "4px 0 0" }}>
          {projectData?.project_desc}
        </p>
      </div>
    </div>

    {/* Details Section */}
    <div style={{ display: "flex", marginTop: "16px", fontSize: "14px" }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Price per sqft</p>
        <p style={{ fontWeight: "bold" }}>₹ 15,985 - ₹ 16,373</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Configuration</p>
        <p style={{ fontWeight: "bold" }}>2, 4 BHK Flats</p>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: "#777", marginBottom: "4px" }}>Tower & Unit</p>
        <p style={{ fontWeight: "bold" }}>2 Towers, 60 Units</p>
      </div>
    </div>

    {/* Price */}
    <div style={{ marginTop: "16px" }}>
      <p style={{ color: "#777", marginBottom: "4px" }}>Price</p>
      <p style={{ fontWeight: "bold" }}>₹1.87 Cr Onwards</p>
    </div>

    {/* Buttons */}
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
      <button
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: "20px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Download Brochure
      </button>
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
        Follow Project
      </button>
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
        Compare Projects
      </button>
    </div>
  </div>
  )
}

export default AboutProject
