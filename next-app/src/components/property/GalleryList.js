"use client";
import useIsMobile from "@/hooks/useIsMobile";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import {
  Card,
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  EnvelopeFill,
  PhoneFill,
  Whatsapp,
  XLg,
} from "react-bootstrap-icons";

const GalleryList = ({ setVisible, propertyId, userDetails, video }) => {
  const { callApi } = AuthUser();
  const [visibleImage, setVisibleImage] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState([]);
  const isMobile = useIsMobile();
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    FetchImageData(propertyId);
  }, [propertyId]);

  // Set activeTab based on visibleImage (including visibleImage=0)
  useEffect(() => {
    const activeImage = data?.filter((item, i) => i === visibleImage);
    if (activeImage?.length > 0) {
      setActiveTab(activeImage[0]?.gallery_type);
    }
  }, [visibleImage, data]);

  // Initialize activeTab once when data loads, only if not already set
  useEffect(() => {
    const galleryTypes = Array.from(
      new Set(data.map((item) => item.gallery_type))
    );
    if (galleryTypes.length > 0 && !activeTab) {
      setActiveTab(galleryTypes[0]);
    }
  }, [data]);

  const FetchImageData = async (propertyId) => {
    try {
      const response = await callApi({
        api: `/get_property_allImages/${propertyId}`,
        method: "GET",
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
    const index = data?.findIndex((obj) => obj?.gallery_type === key_name);
    setVisibleImage(index >= 0 ? index : 0);
  };

  const handleThumbnailClick = (index) => {
    setVisibleImage(index);
    const activeImage = data[index];
    if (activeImage) {
      setActiveTab(activeImage.gallery_type);
    }
  };

  const galleryTypes = Array.from(
    new Set(data.map((item) => item.gallery_type))
  );
  if (video) {
    galleryTypes.unshift("Video");
  }
  const currentGallery = data.filter((tab) => tab.gallery_type === activeTab);
  const totalImages = data.length;

  const formatTabName = (name) => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleCloseForm = () => {
    setShowContactForm(false);
  };

  const property_id = data[0]?.property_id || 0;

  return (
    <>
      <div
        className="detail-full-pop open-state"
        id="writeReviewPopupSection"
        style={{
          display: "block",
        }}
      >
        {showContactForm ? (
          <Row className="justify-content-center">
            <Col xl={5} lg={6}>
              <Card className="contact-form-section bg-light">
                <Card.Header className="d-flex justify-content-between">
                  <h4 className="">Contact Us</h4>
                  <Button
                    variant="light p-1"
                    role="button"
                    onClick={() => setShowContactForm(false)}
                    title="Back to Gallery"
                  >
                    <XLg size={20} color="currentColor" />{" "}
                  </Button>
                </Card.Header>
                <Card.Body>
                  <EnquiryForm
                    propertyId={property_id}
                    handleClose={handleCloseForm}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <div className="pop-header clearfix open-state">
            <div className="tabSlider">
              <div className="slider-container">
                <div className="slider-top-bar p-2">
                  <div className="topTitle text-white">
                    <a role="button" onClick={() => setVisible(false)}>
                      <i className="bi bi-chevron-left"></i>
                      Back
                    </a>
                  </div>
                </div>

                <div className="navList">
                  <Nav justify variant="underline">
                    {galleryTypes.map((tab, index) => {
                      const imageCount = data.filter(
                        (gallery) => gallery.gallery_type === tab
                      ).length;
                      return (
                        <Nav.Item key={index}>
                          <Nav.Link
                            className={`text-white ${
                              tab === activeTab ? "active" : ""
                            }`}
                            onClick={() => handleKey(tab)}
                          >
                            {formatTabName(tab)} ({tab === "Video" ? 1 : imageCount})
                          </Nav.Link>
                        </Nav.Item>
                      );
                    })}
                  </Nav>
                </div>

                <div id="myGallery" className="mt-3">
                  <div className="photoGallery">
                    {activeTab === "Video" && video ? (
                      <div className="videoContainer text-center mb-2">
                        <video
                          src={video}
                          controls
                          style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: 8 }}
                        />
                      </div>
                    ) : (
                      <>
                        <a
                          className="left-arrow"
                          onClick={visibleImage > 0 ? handleLeftClick : undefined}
                          style={{
                            pointerEvents: visibleImage === 0 ? "none" : "auto",
                            opacity: visibleImage === 0 ? 0.5 : 1,
                            cursor:
                              visibleImage + 1 === totalImages
                                ? "default"
                                : "pointer",
                          }}
                        >
                          <ChevronLeft size={24} color="black" />
                        </a>
                        <div className="imageContainer">
                          <div className="sliderImages text-center mb-2 d-flex justify-content-center">
                            {data.map((image, index) => (
                              <img
                                key={image.image_id}
                                className="img-fluid img-2 active"
                                src={image.image_url || "/placeholder.svg"}
                                alt={image.caption}
                                style={{
                                  display: index === visibleImage ? "block" : "none",
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
                              visibleImage + 1 === totalImages ? "none" : "auto",
                            opacity: visibleImage + 1 === totalImages ? 0.5 : 1,
                            cursor:
                              visibleImage + 1 === totalImages
                                ? "default"
                                : "pointer",
                          }}
                        >
                          <ChevronRight size={24} color="black" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
                {/* Thumbnails Gallery */}
                {activeTab !== 'Video' && (
                  <div className="thumbnails-gallery">
                  {data.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      style={{
                        position: "relative",
                        height: "80px",
                        minWidth: "120px",
                        cursor: "pointer",
                        border:
                          visibleImage === index
                            ? "2px solid #3498db"
                            : "2px solid transparent",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <img
                        src={image.image_url || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "2px",
                        }}
                      />
                      {visibleImage === index && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                            width: "100%",
                            height: "4px",
                            backgroundColor: "#3498db",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                ) || null}

                <div
                  className="bottomIndicator text-light"
                  id="bottomIndicator"
                  style={{ textAlign: "center" }}
                >
                  {visibleImage + 1}/{totalImages}
                </div>

                <div className="galleryClientInfo">
                  <Row className="align-items-center">
                    <Col className="col-sm col-12">
                      <div className="d-flex align-items-center mb-3 mb-sm-0">
                        <img
                          src={`${
                            userDetails?.image || "/assets/images/user.jpg"
                          }`}
                          alt="User"
                          className="flex-shrink-0 rounded-circle"
                          height="52"
                          width="52"
                        />
                        <div className="flex-grow-1 ps-3">
                          <h4 className="mb-1">
                            <small>{userDetails?.name}</small>
                          </h4>
                          <p className="small">
                            {userDetails?.user_type === "A"
                              ? "Agent"
                              : userDetails?.user_type === "O"
                              ? "Owner"
                              : userDetails?.user_type === "B"
                              ? "Builder"
                              : "Not Available"}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col className="col-sm-auto col-12">
                      <div className="d-flex gap-2">
                        <Button
                          variant="primary"
                          onClick={() => setShowContactForm(true)}
                        >
                          <EnvelopeFill color="white" size={16} /> Email
                        </Button>
                        <Button
                          variant="info"
                          className="text-white"
                          onClick={() => setShowContactForm(true)}
                        >
                          <PhoneFill color="white" size={16} /> Call
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => setShowContactForm(true)}
                        >
                          <Whatsapp color="white" size={16} /> Whatsapp
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GalleryList;
