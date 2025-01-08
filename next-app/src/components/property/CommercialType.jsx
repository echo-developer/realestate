import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";

const CommercialType = ({ propertyListData, FetchPropertyListData }) => {
    const [show, setShow] = useState(false);
    const { GetMemberId } = AuthUser();
    const [propertyId, setPropertyId] = useState(null);

    const handleClose = () => setShow(false);

    useEffect(() => {
        FetchPropertyListData(propertyId);
    }, [propertyId]);

    const handleClick = (property_id) => {
        setPropertyId(property_id);
        setShow(true);
    };
    const memberId = GetMemberId();

    const SaveFavouriteProperty = async (PropertyId) => {
        let res;
        try {
            res = await callApi({
                api: `/add_my_fav_property`,
                method: "POST",
                data: {
                    user_id: memberId,
                    property_id: PropertyId,
                },
            });
            if (res && res.status === 1) {
                toast.success(res.message);
                FetchPropertyListData(res);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(res.message);
        }
    };

    return (
        <div className="list-display">
            {propertyListData?.map((property) => (
                <div key={property.property_id} className="card card-ads">
                    <div className="row g-0">
                        <div className="col-lg-3 col-sm-3">
                            <div className="card-image">
                                {property?.galleries?.length > 0 ? (
                                    <div
                                        id={`carousel${property.property_id}`}
                                        className="carousel slide ads-carousel"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            {property?.galleries?.map(
                                                (gallery, index) => (
                                                    <div
                                                        key={index}
                                                        className={`carousel-item ${
                                                            index === 0
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >
                                                         <img
                                                                src={
                                                                    gallery
                                                                        .images[0] || "assets/images/property/default-property-2.jpg"
                                                                }
                                                                alt={
                                                                    gallery.gallery_caption
                                                                }
                                                                className="card-img-top"
                                                            />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        {/* <button
                                            className="carousel-control-prev"
                                            type="button"
                                            data-bs-target={`#carousel${property.property_id}`}
                                            data-bs-slide="prev"
                                        >
                                            <span
                                                className="carousel-control-prev-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">
                                                Previous 
                                            </span>
                                        </button>
                                        <button
                                            className="carousel-control-next"
                                            type="button"
                                            data-bs-target={`#carousel${property.property_id}`}
                                            data-bs-slide="next"
                                        >
                                            <span
                                                className="carousel-control-next-icon"
                                                aria-hidden="true"
                                            ></span>
                                            <span className="visually-hidden">
                                                Next
                                            </span>
                                        </button> */}
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
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-sm-7 position-relative">
                            <div className="card-body">
                                <h4>
                                    <Link
                                        href={`/property-details/${property.property_id}`}
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
                                    {/* <li>
                                        <i
                                            className="icon-img-tub"
                                            title="Washroom:"
                                        ></i>
                                        <span>
                                            {property.corner_shop || "N/A"}
                                        </span>
                                    </li> */}
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
                        <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                                <div className="mb-2">
                                    <h4 className="mb-0">{property.price}</h4>
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
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() =>
                                            SaveFavouriteProperty(
                                                property.property_id
                                            )
                                        }
                                    >
                                        Favourite
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {/* Modal for Contact Owner */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm propertyId={propertyId} handleClose={handleClose}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CommercialType;
