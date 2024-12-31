import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const GalleryList = ({ setVisible, propertyId }) => {
    const { callApi } = AuthUser();
    const [show, setShow] = useState(false);
    const [visibleImage, setVisibleImage] = useState(0);
    const [activeTab, setActiveTab] = useState("exterior");
    const [data, setData] = useState([
        {
            property_id: 8,
            gallery_type: "exterior",
            gallary_id: 8,
            caption: "exterior view image",
            image_id: 13,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190666-a1.jfif",
        },
        {
            property_id: 8,
            gallery_type: "living",
            gallary_id: 9,
            caption: "living room image",
            image_id: 14,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190684-a7.jfif",
        },
        {
            property_id: 8,
            gallery_type: "living",
            gallary_id: 9,
            caption: "living room image",
            image_id: 15,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190703-a10.jfif",
        },
        {
            property_id: 8,
            gallery_type: "bedroom",
            gallary_id: 10,
            caption: "bedroom",
            image_id: 16,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190712-a4.jfif",
        },
        {
            property_id: 8,
            gallery_type: "bedroom",
            gallary_id: 10,
            caption: "bedroom",
            image_id: 17,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190713-a5.jfif",
        },
        {
            property_id: 8,
            gallery_type: "bedroom",
            gallary_id: 10,
            caption: "bedroom",
            image_id: 18,
            image_url:
                "http://127.0.0.1:8000/property_images/1735190713-a6.jfif",
        },
    ]);

    useEffect(() => {
        FetchImgaeData(propertyId);
    }, [propertyId]);

    const FetchImgaeData = async (propertyId) => {
        let response;
        try {
            response = await callApi({
                api: `/get_property_allImages`,
                method: "GET",
                data: {
                    property_id: propertyId,
                },
            });
            if (response && response.status === 1) {
                setData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLeftClick = () => {
        setVisibleImage((prevVisibleImage) =>
            prevVisibleImage > 0 ? prevVisibleImage - 1 : prevVisibleImage
        );
    };

    const handleRightClick = () => {
        setVisibleImage((prevVisibleImage) =>
            prevVisibleImage < currentGallery.length - 1
                ? prevVisibleImage + 1
                : prevVisibleImage
        );
    };

    const handleKey = (key_name) => {
        setActiveTab(key_name);
        setVisibleImage(0);
    };

    const currentGallery = data.filter((tab) => tab.gallery_type === activeTab);

    // Gallery types to loop over
    const galleryTypes = ["exterior", "living", "bedroom"];

    return (
        <React.Fragment>
            <div
                className="detail-full-pop open-state"
                id="writeReviewPopupSection"
                style={{
                    display: "block",
                    width: "100%",
                    backgroundColor: "gray",
                }}
            >
                <div
                    className="pop-header clearfix open-state"
                    style={{ width: "100%" }}
                >
                    <div
                        className="tabSlider"
                        style={{ backgroundColor: "gray" }}
                    >
                        <div className="slider-container">
                            <div
                                className="slider-top-bar"
                                style={{
                                    display: "flex",
                                    listStyle: "none",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div className="topTitle">
                                    <span className="closeTab">
                                        <a></a>
                                    </span>
                                    <div onClick={() => setVisible(false)}>
                                        <i
                                            className="icon-feather-close"
                                            style={{
                                                color: "black",
                                                fontWeight: 800,
                                                cursor: "pointer",
                                            }}
                                        >
                                            Back
                                        </i>
                                        &nbsp;&nbsp;&nbsp;{" "}
                                        <span>Plot/Land for Sale in Ajman</span>
                                    </div>
                                </div>
                                <div className="btnsGroup">
                                    <button
                                        onClick={handleShow}
                                        className="btn btnBW clientAgent clientAgent2"
                                    >
                                        Contact Builder
                                    </button>
                                </div>
                            </div>

                            <div className="navList">
                                <ul
                                    className="nav-tabs"
                                    style={{
                                        display: "flex",
                                        listStyle: "none",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                        backgroundColor: "gray",
                                    }}
                                >
                                    {galleryTypes.map((tab, index) => {
                                        const imageCount = data.filter(
                                            (gallery) =>
                                                gallery.gallery_type === tab
                                        ).length;

                                        return (
                                            <li
                                                key={index}
                                                style={{ marginRight: "-10px" }}
                                                className={`nav-link ${
                                                    tab === activeTab
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() => handleKey(tab)}
                                            >
                                                {tab} ({imageCount})
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div
                                    className="bottomIndicator"
                                    id="bottomIndicator"
                                >
                                    {visibleImage + 1}/{currentGallery.length}
                                </div>
                            </div>

                            <div id="myGallery">
                                <div
                                    className="photoGallery"
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <a
                                        className="left-arrow"
                                        onClick={handleLeftClick}
                                    >
                                        {visibleImage === 0 ? (
                                            <button
                                                className="arrow leftArrow"
                                                disabled
                                            >
                                                Left
                                            </button>
                                        ) : (
                                            <button className="arrow leftArrow">
                                                Left
                                            </button>
                                        )}
                                    </a>
                                    <div
                                        className="imageContainer"
                                        style={{ marginLeft: "0px" }}
                                    >
                                        <div
                                            className="sliderImages"
                                            style={{ display: "flex" }}
                                        >
                                            {currentGallery.map(
                                                (image, index) => (
                                                    <img
                                                        key={image.image_id}
                                                        className="img-2 active"
                                                        src={image.image_url}
                                                        alt={image.caption}
                                                        width={800}
                                                        height={600}
                                                        style={{
                                                            display:
                                                                index ===
                                                                visibleImage
                                                                    ? "block"
                                                                    : "none",
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <a
                                        className="left-arrow"
                                        onClick={handleRightClick}
                                    >
                                        {visibleImage + 1 ===
                                        currentGallery.length ? (
                                            <button
                                                className="arrow leftArrow"
                                                disabled
                                            >
                                                Right
                                            </button>
                                        ) : (
                                            <button className="arrow leftArrow">
                                                Right
                                            </button>
                                        )}
                                    </a>
                                </div>
                            </div>

                            <div
                                className="bottomIndicator"
                                id="bottomIndicator"
                                style={{ textAlign: "center" }}
                            >
                                {visibleImage + 1}/{currentGallery.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm />
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default GalleryList;
