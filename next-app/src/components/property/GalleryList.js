import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";

const GalleryList = ({propertyDetails, setVisible }) => {
  const [show, setShow] = useState(false);
  const [visibalImage, setVisibalImage] = useState(0);
  const [activeTab, setActiveTab] = useState("bedroom");

  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLeftClick = () => {
    setVisibalImage((prevVisibleImage) => prevVisibleImage - 1);
  };

  const handleRightClick = () => {
    setVisibalImage((prevVisibleImage) => prevVisibleImage + 1);
  };

  const handleKey = (key_name) => {
    const selectedTab = propertyDetails?.galleries?.find(
      (tab) => tab.gallery_name === key_name
    );
    setActiveTab(key_name);

    if (selectedTab) {
      const index = selectedTab.images.findIndex((img, idx) => idx === 0);
      setVisibalImage(index);
    }
  };

  const currentGallery = propertyDetails?.galleries?.find(
    (tab) => tab.gallery_name === activeTab
  );

  return (
    <React.Fragment>
      <div
        className="detail-full-pop open-state"
        id="writeReviewPopupSection"
        style={{ display: "block", width: "100%", backgroundColor: "gray" }}
      >
        <div className="pop-header clearfix open-state" style={{ width: "100%" }}>
          <div className="tabSlider" style={{backgroundColor:'gray'}}>
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
                      className="icon-feather-close "
                      style={{
                        color: "black",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Back
                    </i>
                    &nbsp;&nbsp;&nbsp; <span>Plot/Land for Sale in Ajman</span>
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
                    backgroundColor:'gray'
                  }}
                >
                  {propertyDetails?.galleries?.map((tab, index) => (
                    <li
                      key={index}
                      style={{ marginRight: "-10px" }}
                      className={`nav-link ${
                        tab.gallery_name === activeTab ? "active" : ""
                      }`}
                      onClick={() => handleKey(tab.gallery_name)}
                    >
                      {tab.gallery_name} ({tab.images.length})
                    </li>
                  ))}
                </ul>
                <div className="bottomIndicator" id="bottomIndicator">
                  {visibalImage + 1}/{currentGallery?.images?.length}
                </div>
              </div>

              <div id="myGallery">
                <div
                  className="photoGallery"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <a className="left-arrow" onClick={handleLeftClick}>
                    {visibalImage === 0 ? (
                      <button className="arrow leftArrow" disabled>
                        Left
                      </button>
                    ) : (
                      <button className="arrow leftArrow">Left</button>
                    )}
                  </a>
                  <div className="imageContainer" style={{ marginLeft: "0px" }}>
                    <div className="sliderImages" style={{ display: "flex" }}>
                      {currentGallery?.images?.map(
                        (image, index) =>
                          index === visibalImage && (
                            <img
                              key={index}
                              className="img-2 active"
                              src={image}
                              alt="Slider Image"
                              width={800}
                              height={600}
                            />
                          )
                      )}
                    </div>
                  </div>
                  <a className="left-arrow" onClick={handleRightClick}>
                    {visibalImage + 1 === currentGallery?.images?.length ? (
                      <button className="arrow leftArrow" disabled>
                        Right
                      </button>
                    ) : (
                      <button className="arrow leftArrow">Right</button>
                    )}
                  </a>
                </div>
              </div>

              <div
                className="bottomIndicator"
                id="bottomIndicator"
                style={{ textAlign: "center" }}
              >
                {visibalImage + 1}/{currentGallery?.images?.length}
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
