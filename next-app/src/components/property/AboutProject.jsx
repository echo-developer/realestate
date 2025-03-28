"use client"
import React from "react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import DOMPurify from "dompurify";

const AboutProject = ({ projectData }) => {
  const translation = useTranslation();
  const price = formatToLacCr(projectData?.project_budget);
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        marginBottom: "20px",
        backgroundColor: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
          {translation?.about_project || "About Project"}
        </h2>
        <Link
          target="_blank"
          href={`/project-details/${projectData?.slug}`}
          style={{
            color: "black",
            fontWeight: "bold",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {translation?.explore_project || "Explore Project"}{" "}
          <span style={{ marginLeft: "5px" }}>➝</span>
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
          <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
            {projectData?.project_name ||
              `${translation?.not_available || "Not available"}`}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html: projectData?.project_desc
                ? DOMPurify.sanitize(projectData?.project_desc)
                : "Description not available",
            }}
          ></div>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ display: "flex", marginTop: "16px", fontSize: "14px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#777", marginBottom: "4px" }}>
            {translation?.occupied_total_area || "Occupied & total Area"}{" "}
          </p>
          <p style={{ fontWeight: "bold" }}>
            {projectData?.occupied_area ||
              `${translation?.not_available || "Not available"}`}{" "}
            {translation?.sq_ft || "sq/ft ,"}{" "}
            {projectData?.total_area ||
              `${translation?.not_available || "Not available"}`}{" "}
            {translation?.sq_ft || "sq/ft "}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#777", marginBottom: "4px" }}>
            {translation?.configuration || "Configuration"}
          </p>
          <p style={{ fontWeight: "bold" }}>
            {translation?.bhk_flats || "2, 4 BHK Flats"}
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "#777", marginBottom: "4px" }}>
            {translation?.tower_unit || "Tower & Unit"}
          </p>
          <p style={{ fontWeight: "bold" }}>
            {projectData?.total_towers ||
              `${translation?.not_available || "Not available"}`}{" "}
            {translation?.towers || "Towers,"}{" "}
            {projectData?.total_units || "Not Available"}{" "}
            {translation?.units || "Units"}
          </p>
        </div>
      </div>

      {/* Price */}
      {price && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ color: "#777", marginBottom: "4px" }}>
            {translation?.price || "Price"}
          </p>
          <p style={{ fontWeight: "bold" }}>
            {price || `${translation?.not_available || "Not available"}`}
          </p>
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
          {translation?.download_brochure || "Download Brochure"}
        </button>
      </div>
    </div>
  );
};

export default AboutProject;

function formatToLacCr(range) {
  if (!range) return "";

  const [min, max] = range.split("-").map(Number);

  if (isNaN(min) || isNaN(max)) return "Invalid Input";

  const formatNumber = (num) => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + " " + "Cr ";
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + " " + "Lac ";
    } else {
      return num.toLocaleString();
    }
  };

  return `${formatNumber(min)} - ${formatNumber(max)}`;
}
