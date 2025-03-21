"use client"

import React, { useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal"
import EnquiryForm from "../charts/EnquiryForm"
import AuthUser from "../Authentication/AuthUser"
import { toast } from "react-toastify"
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
import { ChevronLeft, ChevronRight, EnvelopeFill, PhoneFill, Whatsapp } from "react-bootstrap-icons";

const GalleryList = ({ setVisible, propertyId }) => {
  const { callApi } = AuthUser()
  const [show, setShow] = useState(false)
  const [visibleImage, setVisibleImage] = useState(0)
  const [activeTab, setActiveTab] = useState("exterior")
  const [data, setData] = useState([])

  useEffect(() => {
    FetchImageData(propertyId)
  }, [propertyId])

  useEffect(() => {
    if (visibleImage) {
      const activeImage = data?.filter((item, i) => i === visibleImage)
      if (activeImage?.length > 0) {
        setActiveTab(activeImage[0]?.gallery_type)
      }
    }
  }, [visibleImage, data])

  useEffect(() => {
    const galleryTypes = Array.from(new Set(data.map((item) => item.gallery_type)))
    if (galleryTypes.length > 0 && !galleryTypes.includes(activeTab)) {
      setActiveTab(galleryTypes[0])
    }
  }, [data, activeTab])

  const FetchImageData = async (propertyId) => {
    try {
      const response = await callApi({
        api: `/get_property_allImages/${propertyId}`,
        method: "GET",
      })
      if (response && response.status === 1) {
        setData(response.data)
      } else {
        toast.error(response.message || "Failed to fetch images")
      }
    } catch (error) {
      toast.error("An error occurred while fetching images.")
    }
  }

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleLeftClick = () => {
    setVisibleImage((prevVisibleImage) => (prevVisibleImage > 0 ? prevVisibleImage - 1 : prevVisibleImage))
  }

  const handleRightClick = () => {
    setVisibleImage((prevVisibleImage) =>
      prevVisibleImage < data.length - 1 ? prevVisibleImage + 1 : prevVisibleImage,
    )
  }

  const handleKey = (key_name) => {
    setActiveTab(key_name)
    const index = data?.findIndex((obj) => obj?.gallery_type === key_name)
    setVisibleImage(index >= 0 ? index : 0)
  }

  const handleThumbnailClick = (index) => {
    setVisibleImage(index)
    const activeImage = data[index]
    if (activeImage) {
      setActiveTab(activeImage.gallery_type)
    }
  }

  const galleryTypes = Array.from(new Set(data.map((item) => item.gallery_type)))
  const currentGallery = data.filter((tab) => tab.gallery_type === activeTab)
  const totalImages = data.length

  return (
    <React.Fragment>
      <div
        className="detail-full-pop open-state"
        id="writeReviewPopupSection"
        style={{
          display: "block",
        }}
      >
        <div className="pop-header clearfix open-state">
          <div className="tabSlider">
            <div className="slider-container">
              <div
                className="slider-top-bar p-2"
              >
                <div className="topTitle text-white">
                  <a role="button" onClick={() => setVisible(false)}>
                    <i className="bi bi-chevron-left"></i>
                    Back
                  </a>
                </div>
              </div>

              <div className="navList">
                <Nav justify variant="underline"
                  >  
                  {galleryTypes.map((tab, index) => {
                    const imageCount = data.filter((gallery) => gallery.gallery_type === tab).length
                    return (
                      <Nav.Item
                        key={index}
                      >
                        <Nav.Link
                            className={`text-white ${tab === activeTab ? "active" : ""}`}
                            onClick={() => handleKey(tab)}
                        >
                          {tab} ({imageCount})
                        </Nav.Link>
                      </Nav.Item>
                    )
                  })}
                </Nav>
                <div className="bottomIndicator" id="bottomIndicator">
                  {visibleImage + 1}/{totalImages}
                </div>
              </div>

              <div id="myGallery">
                <div
                  className="photoGallery"
                  
                >
                  <a
                    className="left-arrow"
                    onClick={visibleImage > 0 ? handleLeftClick : undefined}
                    style={{
                      pointerEvents: visibleImage === 0 ? "none" : "auto",
                      opacity: visibleImage === 0 ? 0.5 : 1,
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
                    onClick={visibleImage + 1 < totalImages ? handleRightClick : undefined}
                    style={{
                      pointerEvents: visibleImage + 1 === totalImages ? "none" : "auto",
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
                      border: visibleImage === index ? "2px solid #3498db" : "2px solid transparent",
                      transition: "all 0.2s ease",
                      //boxShadow: visibleImage === index ? "0 0 10px rgba(52, 152, 219, 0.7)" : "none",
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

              <div className="bottomIndicator" id="bottomIndicator" style={{ textAlign: "center" }}>
                {visibleImage + 1}/{totalImages}
              </div>

              <div className="galleryClientInfo">
                <Row className="align-items-center">
                  <Col className="col-sm col-12">
                    <div className="d-flex align-items-center mb-3 mb-sm-0">
                      <img
                        src="/assets/images/user.jpg" alt="User" className="flex-shrink-0 rounded-circle" height="52" width="52"
                      />
                      <div className="flex-grow-1 ps-3">
                        <h4 className="mb-1"><small>Owner Name Here...</small></h4>
                        <p className="small">Owner / Agent</p>
                      </div>
                    </div>
                  </Col>                  
                  <Col className="col-sm-auto col-12">
                    <div className="d-flex gap-2">
                      <Button variant="primary"><EnvelopeFill color="white" size={16} /> Email</Button>
                      <Button variant="info" className="text-white"><PhoneFill color="white" size={16} /> Call</Button>
                      <Button variant="success"><Whatsapp color="white" size={16} /> Whatsapp</Button>
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
          <Modal.Title>Contact Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EnquiryForm />
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default GalleryList

