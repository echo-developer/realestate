"use client";
import React, { useEffect, useState } from "react";
import AddAmenity from "../ModalData/AddAmenity";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import UploadPropertyBrochure from "../BrochureData/UploadPropertyBrochure";
import AddNewPropertyData from "../addtional/AddNewPropertyData";
import useTranslation from '../../hooks/useTranslation'
import DocumentUploadModal from "../addtional/AddDocument";


const PublishComponent = ({ propertiesData }) => {

  const { callApi } = AuthUser();
  const [propId, setPropId] = useState();
  const [showBrochModal, setShowBrochModal] = useState(false);
  const [docModal,setShowDocModal]=useState(false)
  const [properties, setProperties] = useState(
    propertiesData?.published_properties?.data || []
    
  );
  const [currentPage, setCurrentPage] = useState(
    propertiesData?.published_properties?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(
    propertiesData?.published_properties?.total || 1
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const translation = useTranslation();

  useEffect(() => {
    setProperties(propertiesData?.published_properties?.data || [])
  }, [propertiesData?.published_properties])

  const handleRemoveProperty = async (propertyId) => {
    try {
      const response = await callApi({
        api: `/propety_delete`,
        method: "POST",
        data: {
          id: propertyId,
        },
      });

      if (response && response.status === 1) {
        toast.success("Property deleted successfully");
        setProperties((prevProperties) =>
          prevProperties.filter(
            (property) => property.property_id !== propertyId
          )
        );
      } else {
        toast.error("Failed to delete property");
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

  const handleAdditionalproperty = (id) => {
    setPropId(id);
    setShowAddProperty(true);
  };

  const handleShowBrochueModal = (id) => {
    setShowBrochModal(true);
    setPropId(id);
  };

  const handlePropertyCertificate = (id) => {
    setShowDocModal(true);
    setPropId(id);
  };

  const handleDocClose=()=>{
    setShowDocModal(false);
  }
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
                    showPrice={false}
                  />
                </div>
                <div className="col-sm-8 position-relative">
                  <div className="card-body">
                    <h4>
                      <Link href={`/property-details/${property.slug}`}>
                        {property.property_name ||`${translation?.not_available ||"Not available"}`}
                      </Link>
                    </h4>
                    <p className="mb-1">
                      <i className="bi bi-geo-alt"></i>{" "}
                      {property.address || `${translation?.not_available ||"Not available"}`}
                    </p>
                    <React.Fragment>
                      {property.property_type === "Residential" ? (
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i>{" "}
                            {property.property_type_for}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i>  {translation?.bathrooms || "Bedrooms"}{" "}
                            <span>{property.bedrooms || `${translation?.not_available ||"Not available"}`}</span>
                          </li>
                          <li>
                            <i className="icon-img-tub"></i>  {translation?.bathrooms || "Bathrooms"}{" "}
                            <span>{property.bathroom || `${translation?.not_available ||"Not available"}`}</span>
                          </li>
                        </ul>
                      ) : (
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i>{" "}
                            {property.property_type_for || `${translation?.not_available ||"Not available"}`}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i> {translation?.cafeteria || "Cafeteria"}{" "}
                            <span>{property.cafeteria || `${translation?.not_available ||"Not available"}`}</span>
                          </li>
                          <li>
                            <i className="icon-img-tub"></i> {translation?.personal_washroom || "Personal Washroom:"}{" "}
                            <span>
                              {property.personal_washroom ||`${translation?.not_available ||"Not available"}`}
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
                         {translation?.upload_brochure || "Upload Brochure"}
                      </a>
                      <a
                        onClick={() => handleShowModal(property?.property_id)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        {translation?.add_amenity || "Add Amenity"}
                      </a>
                      <a
                        onClick={() =>
                          handleAdditionalproperty(property?.property_id)
                        }
                        className="btn btn-sm btn-info me-2"
                      >
                        {translation?.add_new_field || "Add New Field"}
                      </a>
                      <a
                        onClick={() =>
                          handlePropertyCertificate(property?.property_id)
                        }
                        className="btn btn-sm btn-danger me-2"
                      >
                        {translation?.add_certificate || "Add Certificate"}
                      </a>
                      <Link
                        href={`/property-edit/${property?.property_id}`}
                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <a
                        onClick={() => handleDeleteClick(property.property_id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="bi bi-trash3"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className='card border-0 text-center'>
              <div className="card-body">
                <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" loading="lazy"/>
                <p className='text-muted'> {translation?.no_record_founds || "No Record Founds"}</p>
              </div>
            </div>
          </>
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

      {docModal && <DocumentUploadModal propId={propId} show={docModal} onClose={handleDocClose}/>}

      <UploadPropertyBrochure
        show={showBrochModal}
        handleClose={() => setShowBrochModal(false)}
        propertyId={propId}
      />
    </>
  );
};

export default PublishComponent;
