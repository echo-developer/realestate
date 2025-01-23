import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import Router from "next/router";

const ResidentialType = ({ propertyListData,  }) => {
    const { callApi, GetMemberId, isLogin } = AuthUser();
    const [showContactModal, setShowContactModal] = useState(false);
    const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
    const [propertyId, setPropertyId] = useState(null);

    const memberId = GetMemberId();

    const handleContactClose = () => setShowContactModal(false);
    const handleLoginErrorClose = () => setShowLoginErrorModal(false);

    const handleClick = (property_id) => {
        setPropertyId(property_id);
        setShowContactModal(true);
    };

    const SaveFavouriteProperty = async (PropertyId) => {
        if (!isLogin()) {
            setShowLoginErrorModal(true);
            return;
        }

        try {
            const res = await callApi({
                api: `/add_my_fav_property`,
                method: "UPLOAD",
                data: {
                    user_id: memberId,
                    property_id: PropertyId,
                },
            });

            if (res && res.status === 1) {
                toast.success(res.message);
                FetchPropertyListData(res);
            } else {
                toast.error(
                    res?.message || "An error occurred. Please try again."
                );
            }
        } catch (error) {
            toast.error("Failed to save the property. Please try again.");
        }
    };

    return (
        <div className="list-display">
            {propertyListData?.map((property) => (
                <div key={property.property_id} className="card card-ads">
                    <div className="row g-0">
                        {/* Property Details */}
                        <div className="col-lg-3 col-sm-3">
                            {/* Property Image */}
                            <div className="card-image">
                                {property.galleries.length > 0 ? (
                                    <div
                                        id={`carousel${property.property_id}`}
                                        className="carousel slide ads-carousel"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            {property?.galleries?.some(
                                                (gallery) =>
                                                    gallery?.images?.length > 0
                                            ) ? (
                                                property?.galleries?.map(
                                                    (gallery) =>
                                                        gallery?.images?.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={
                                                                        image.image_id
                                                                    }
                                                                    className={`carousel-item ${
                                                                        index ===
                                                                        0
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            image?.image_url
                                                                        }
                                                                        alt={
                                                                            image?.caption ||
                                                                            "Property Image"
                                                                        }
                                                                        className="card-img-top"
                                                                    />
                                                                </div>
                                                            )
                                                        )
                                                )
                                            ) : (
                                                <div className="carousel-item active">
                                                    <img
                                                        src="assets/images/property/default-property-1.jpg"
                                                        alt="Default Property Image"
                                                        className="card-img-top"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src="assets/images/property/default-property-2.jpg"
                                        alt="Default property"
                                        className="card-img-top"
                                    />
                                )}

                                <span
                                    className="ads-type"
                                    style={{
                                        backgroundColor:
                                            property.post_for === "rent"
                                                ? "green"
                                                : "orange",
                                    }}
                                >
                                    For {property.post_for}
                                </span>
                                <div className="ads-price">
                                    <h4>{property.property_size} sq/ft</h4>
                                    {property.post_for}
                                </div>
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="col-lg-7 col-sm-7 position-relative">
                            <div className="card-body">
                                <h4>
                                    <Link
                                        href={`/property-details/${property.slug}`}
                                    >
                                        {property.property_name}
                                    </Link>
                                </h4>
                                <p className="mb-1">
                                    <i className="icon-feather-map-pin"></i>
                                    {property.address}
                                </p>
                                <ul className="list-info mb-2">
                                    <li>
                                        <i
                                            className="icon-img-bed"
                                            title="Bedrooms:"
                                        ></i>
                                        <span>
                                            {property?.bedrooms || "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <i
                                            className="icon-img-tub"
                                            title="Bathrooms:"
                                        ></i>
                                        <span>
                                            {property?.bathroom || "N/A"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <div>
                                    <span className="ad-post-date">
                                        <i className="icon-feather-calendar"></i>
                                        {useDateFormat(property.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact and Favorite Buttons */}
                        <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                                <div className="mb-2">
                                    <h4 className="mb-0">
                                        {property?.price_currency &&
                                        property?.exp_price
                                            ? `${
                                                  property.price_currency
                                              } ${new Intl.NumberFormat(
                                                  "en-US"
                                              ).format(property.exp_price)}`
                                            : "Price not available"}
                                    </h4>
                                </div>
                                <div className="d-grid">
                                    <button
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() =>
                                            handleClick(property.property_id)
                                        }
                                    >
                                        Contact Now
                                    </button>
                                    <button
                                        className={`btn ${
                                            property?.is_favorite === true
                                                ? "btn-danger"
                                                : "btn-primary"
                                        } btn-sm msg-send mb-2`}
                                        onClick={() =>
                                            SaveFavouriteProperty(
                                                property.property_id
                                            )
                                        }
                                    >
                                        {property?.is_favorite === true
                                            ? "Remove Fav."
                                            : "Add Fav."}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Contact Owner Modal */}
            <Modal show={showContactModal} onHide={handleContactClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm
                        propertyId={propertyId}
                        handleClose={handleContactClose}
                    />
                </Modal.Body>
            </Modal>

            {/* Login Error Modal */}
            <Modal
                show={showLoginErrorModal}
                onHide={handleLoginErrorClose}
                centered
                size="lg"
            >
                <Modal.Header>
                    {/* Left-aligned Cancel button */}
                    <button
                        className="btn btn-secondary"
                        onClick={handleLoginErrorClose}
                        style={{ position: "absolute", left: "15px" }}
                    >
                        Cancel
                    </button>

                    {/* Centered Error Message */}
                    <Modal.Title className="mx-auto">
                        Login Required
                    </Modal.Title>

                    {/* Right-aligned Login button */}
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            handleLoginErrorClose();
                            Router.push("/login");
                        }}
                        style={{ position: "absolute", right: "15px" }}
                    >
                        Login
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-center">Please log in to perform this action.</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ResidentialType;
