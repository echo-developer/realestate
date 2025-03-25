import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import useTranslation from "@/hooks/useTranslation";
import {
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
} from "react-bootstrap-icons";

const ProjectGallery = ({ setVisible, projectId, userDetails }) => {
  const { callApi } = AuthUser();
  const [show, setShow] = useState(false);
  const [visibleImage, setVisibleImage] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState([]);
  const translation = useTranslation();

  useEffect(() => {
    FetchImageData(projectId);
  }, [projectId]);

  useEffect(() => {
    const galleryTypes = Array.from(
      new Set(data.map((item) => item.gallery_type))
    );
    if (galleryTypes.length > 0 && !galleryTypes.includes(activeTab)) {
      setActiveTab(galleryTypes[0]);
    }
  }, [data]);

  const FetchImageData = async (projectId) => {
    try {
      const response = await callApi({
        api: `/get-all-project-gallery/${projectId}`,
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLeftClick = () => {
    setVisibleImage((prevVisibleImage) =>
      prevVisibleImage > 0 ? prevVisibleImage - 1 : prevVisibleImage
    );
  };

  const handleRightClick = () => {
    setVisibleImage((prevVisibleImage) =>
      prevVisibleImage < data.length - 1
        ? prevVisibleImage + 1
        : prevVisibleImage
    );
  };

  const handleKey = (key_name) => {
    setActiveTab(key_name);
    const imgIndex = data?.findIndex((item) => item?.gallery_type === key_name);
    setVisibleImage(imgIndex >= 0 ? imgIndex : 0);
  };

  // Add thumbnail click handler
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
  const totalImages = data.length;

  useEffect(() => {
    let img = data?.filter((item, i) => i === visibleImage);
    if (img?.length > 0) {
      setActiveTab(img[0]?.gallery_type);
    }
  }, [visibleImage]);

  const formatTabName = (name) => {
    return name
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <React.Fragment>
      <div
        className="detail-full-pop open-state"
        id="writeReviewPopupSection"
        style={{
          display: "block",
        }}
      >
        <div
          className="pop-header clearfix open-state"
          style={{ width: "100%" }}
        >
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
                          {formatTabName(tab)} ({imageCount})
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
                <div className="bottomIndicator text-light" id="bottomIndicator">
                  {visibleImage + 1}/{totalImages}
                </div>
              </div>

              <div id="myGallery">
                <div className="photoGallery">
                  <a
                    className="left-arrow"
                    onClick={visibleImage > 0 ? handleLeftClick : undefined}
                    title={translation?.left || "Left"}
                    style={{
                      pointerEvents: visibleImage === 0 ? "none" : "auto",
                      opacity: visibleImage === 0 ? 0.5 : 1,
                    }}
                  >
                    <ChevronLeft size={24} color="black" />
                  </a>
                  <div className="imageContainer" style={{ marginLeft: "0px" }}>
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
                    title={translation?.right || "Right"}
                    style={{
                      pointerEvents:
                        visibleImage + 1 === totalImages ? "none" : "auto",
                      opacity: visibleImage + 1 === totalImages ? 0.5 : 1,
                    }}
                  >
                    <ChevronRight size={24} color="black" />
                  </a>
                </div>
              </div>

              {/* Thumbnails Gallery */}
              <div
                className="thumbnails-gallery"
                style={{
                  display: "flex",
                  overflowX: "auto",
                  padding: "10px 0",
                  gap: "8px",
                  backgroundColor: "#333",
                  margin: "10px 0",
                  borderRadius: "4px",
                }}
              >
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
                          ? "3px solid #3498db"
                          : "3px solid transparent",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                      boxShadow:
                        visibleImage === index
                          ? "0 0 10px rgba(52, 152, 219, 0.7)"
                          : "none",
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

              <div
                className="bottomIndicator"
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
                      <Button variant="primary">
                        <EnvelopeFill color="white" size={16} /> Email
                      </Button>
                      <Button variant="info" className="text-white">
                        <PhoneFill color="white" size={16} /> Call
                      </Button>
                      <Button variant="success">
                        <Whatsapp color="white" size={16} /> Whatsapp
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.contact_owner || "Contact Owner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectEnquiryForm projectId={projectId} handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default ProjectGallery;
