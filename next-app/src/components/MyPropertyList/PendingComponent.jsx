"use client";

import React, { useState } from "react";
import AddAmenity from "../ModalData/AddAmenity";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import UploadPropertyBrochure from "../BrochureData/UploadPropertyBrochure";
import AddNewPropertyData from "../addtional/AddNewPropertyData";

const PendingComponent = ({ propertiesData }) => {
  const { callApi } = AuthUser();
  const [propId, setPropId] = useState(null);
  const [showBrochModal, setShowBrochModal] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [properties, setProperties] = useState(
    propertiesData?.pending_properties?.data || []
  );
  const [currentPage, setCurrentPage] = useState(
    propertiesData?.pending_properties?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(
    Math.ceil(
      (propertiesData?.pending_properties?.total || 0) /
        (propertiesData?.pending_properties?.per_page || 10)
    )
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveProperty = async (propertyId) => {
    try {
      const response = await callApi({
        api: `/propety_delete`,
        method: "POST",
        data: { id: propertyId },
      });

      if (response?.status === 1) {
        toast.success("Property deleted successfully");
        setProperties((prev) =>
          prev.filter((property) => property.property_id !== propertyId)
        );
      } else {
        toast.error(response?.message || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error while deleting property:", error);
      toast.error("An error occurred while deleting the property");
    }
  };

  const handleDeleteClick = (propertyId) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this property?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProperty(propertyId);
      }
    });
  };

  const handleShowModal = (id) => {
    setPropId(id);
    setIsModalOpen(true);
  };

  const loadMoreProperties = () => {
    const newProperties = propertiesData?.pending_properties?.data || [];
    setProperties((prev) => [...prev, ...newProperties]);
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleShowBrochueModal = (id) => {
    setShowBrochModal(true);
    setPropId(id);
  };

  const handleAdditionalproperty = (id) => {
    setPropId(id);
    setShowAddProperty(true);
  };

  return (
    <>
      <div className="list-display">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div className="card card-ads" key={property.property_id}>
              <div className="row g-0">
                <div className="col-sm-4">
                  <CardImageSlider
                    data={property}
                    showSq={true}
                    icons={false}
                  />
                </div>
                <div className="col-sm-8 position-relative">
                  <div className="card-body">
                    <h4>
                      <Link href={`/property-details/${property.slug}`}>
                        {property.property_name}
                      </Link>
                    </h4>
                    <p className="mb-1">
                      <i className="bi bi-geo-alt"></i>{" "}
                      {property.address || "Not Available"}
                    </p>
                    <React.Fragment>
                      {property.property_type === "Residential" ? (
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i>{" "}
                            {property.property_type_for}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i> Bedrooms:{" "}
                            <span>{property.bedrooms || "Not Available"}</span>
                          </li>
                          <li>
                            <i className="icon-img-tub"></i> Bathrooms:{" "}
                            <span>{property.bathroom || "Not Available"}</span>
                          </li>
                        </ul>
                      ) : (
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i>{" "}
                            {property.property_type_for || "Not Available"}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i> Cafeteria:{" "}
                            <span>{property.cafeteria || "Not Available"}</span>
                          </li>
                          <li>
                            <i className="icon-img-tub"></i> Personal Washroom:{" "}
                            <span>
                              {property.personal_washroom || "Not Available"}
                            </span>
                          </li>
                        </ul>
                      )}
                    </React.Fragment>
                    
                    <p className="ad-post-date mb-2">
                      <i className="bi bi-calendar4"></i>{" "}
                      {useDateFormat(property.created_at)}
                    </p>
                    <div className="d-sm-flex">
                      <a
                        onClick={() =>
                          handleShowBrochueModal(property?.property_id)
                        }
                        className="btn btn-sm btn-success me-2"
                      >
                        Upload Brochure
                      </a>
                      <button
                        onClick={() => handleShowModal(property.property_id)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Add Amenity
                      </button>
                      <Link
                        href={`/property-edit/${property.property_id}`}
                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(property.property_id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No records found.</p>
        )}
      </div>
      <div className="text-center"></div>

      {isModalOpen && (
        <AddAmenity
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propId}
        />
      )}

{showAddProperty && (
        <AddNewPropertyData
          show={showAddProperty}
          handleClose={() => setShowAddProperty(false)}
          propertyId={propId}
        />
      )}

      <UploadPropertyBrochure
        show={showBrochModal}
        handleClose={() => setShowBrochModal(false)}
        propertyId={propId}
      />
    </>
  );
};

export default PendingComponent;
