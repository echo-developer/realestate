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
    const [data, setData] = useState([]);

    useEffect(() => {
        FetchImageData(propertyId);
    }, [propertyId]);

    useEffect(() => {
        const galleryTypes = Array.from(new Set(data.map((item) => item.gallery_type)));
        if (galleryTypes.length > 0 && !galleryTypes.includes(activeTab)) {
            setActiveTab(galleryTypes[0]);
        }
    }, [data, activeTab]);

    const FetchImageData = async (propertyId) => {
        try {
            const response = await callApi({
                api: `/get_property_allImages`,
                method: "GET",
                data: { property_id: propertyId },
            });
            if (response && response.status === 1) {
                setData(response.data);
            } else {
                toast.error(response.message || "Failed to fetch images");
            }
        } catch (error) {
            toast.error("An error occurred while fetching images.");
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
            prevVisibleImage < data.length - 1 ? prevVisibleImage + 1 : prevVisibleImage
        );
    };

    const handleKey = (key_name) => {
        setActiveTab(key_name);
        setVisibleImage(0);
    };

    const galleryTypes = Array.from(new Set(data.map((item) => item.gallery_type)));
    const currentGallery = data.filter((tab) => tab.gallery_type === activeTab);
    const totalImages = data.length;

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
                    <div className="tabSlider" style={{ backgroundColor: "gray" }}>
                        <div className="slider-container">
                            <div
                                className="slider-top-bar"
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div className="topTitle">
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
                                        <span>Plot/Land for Sale in Kolkata</span>
                                    </div>
                                </div>
                                {/* <div className="btnsGroup">
                                    <button
                                        onClick={handleShow}
                                        className="btn btnBW clientAgent clientAgent2"
                                    >
                                        Contact Builder
                                    </button>
                                </div> */}
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
                                                className={`nav-link ${
                                                    tab === activeTab ? "active" : ""
                                                }`}
                                                onClick={() => handleKey(tab)}
                                            >
                                                {tab} ({imageCount})
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="bottomIndicator" id="bottomIndicator">
                                    {visibleImage + 1}/{totalImages}
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
                                        onClick={
                                            visibleImage > 0 ? handleLeftClick : undefined
                                        }
                                        style={{
                                            pointerEvents: visibleImage === 0 ? "none" : "auto",
                                            opacity: visibleImage === 0 ? 0.5 : 1,
                                        }}
                                    >
                                        Left
                                    </a>
                                    <div className="imageContainer" style={{ marginLeft: "0px" }}>
                                        <div className="sliderImages" style={{ display: "flex" }}>
                                            {data.map((image, index) => (
                                                <img
                                                    key={image.image_id}
                                                    className="img-2 active"
                                                    src={image.image_url}
                                                    alt={image.caption}
                                                    width={800}
                                                    height={600}
                                                    style={{
                                                        display:
                                                            index === visibleImage
                                                                ? "block"
                                                                : "none",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        className="right-arrow"
                                        onClick={
                                            visibleImage + 1 < totalImages
                                                ? handleRightClick
                                                : undefined
                                        }
                                        style={{
                                            pointerEvents:
                                                visibleImage + 1 === totalImages
                                                    ? "none"
                                                    : "auto",
                                            opacity:
                                                visibleImage + 1 === totalImages ? 0.5 : 1,
                                        }}
                                    >
                                        Right
                                    </a>
                                </div>
                            </div>

                            <div
                                className="bottomIndicator"
                                id="bottomIndicator"
                                style={{ textAlign: "center" }}
                            >
                                {visibleImage + 1}/{totalImages}
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
