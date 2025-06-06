{/* <IfModule mod_rewrite.c>
    RewriteEngine On

    RewriteEngine On
    RewriteRule ^([^/]+)/$ $1.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^([^/]+)/$ $1.html
    RewriteRule ^agent-details/([^/]+)/$ /agent-details/[agent_id].html
    RewriteRule ^project-details/([^/]+)/$ /project-details/[project_id].html
    RewriteRule ^property-details/([^/]+)/$ /property-details/[property_id].html
    RewriteRule ^property-crm-schedule/([^/]+)/$ /property-crm-schedule/[crm_id].html
    RewriteRule ^project-edit/([^/]+)/$ /project-edit/[project_id].html
    RewriteRule ^property-edit/([^/]+)/$ /property-edit/[property_id].html
    RewriteRule ^profile-edit/([^/]+)/$ /profile-edit/[profile_id].html
    RewriteRule ^user/([^/]+)/$ /user/[user_id].html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !(\.[a-zA-Z0-9]{1,5}|/)$
    RewriteRule (.*)$ /$1/ [R=301,L]

</IfModule> */}



"use client";
import React, { useState, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthUser from "@/components/Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

const UserLogoUpload = ({ show, setShow, uploadUserImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showCropModal, setShowCropModal] = useState(false);

  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const translation = useTranslation();

  const handleClose = () => {
    setShow(false);
    setImageSrc(null);
    setSelectedFile(null);
    setShowCropModal(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImage = async () => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = 360;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      360,
      360
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], selectedFile.name, {
          type: "image/jpeg",
        });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleUpload = async () => {
    try {
      const croppedFile = await getCroppedImage();

      const response = await callApi({
        api: `/update_profile_image`,
        method: "UPLOAD",
        data: {
          id: memberId,
          image: croppedFile,
        },
      });

      if (response && response.status === 1) {
        uploadUserImage(response?.data?.image_url);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_logo", response?.data?.image_url);
        }
        handleClose();
      } else {
        toast.error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        {translation?.upload_logo || "Upload Logo"}
      </Button>

      {/* Upload Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.upload_user_logo || "Upload User Logo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="upload-area">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <i className="bi bi-upload"></i>
              <p>
                {translation?.darg || "Drag"} &amp;{" "}
                {translation?.drag_drop_files || "Drop files here or"}{" "}
                <span className="text-site">{translation?.click || "Click"}</span>{" "}
                {translation?.click_to_select || "to select files"}
              </p>
            </Form.Group>
            <p className="text-help">
              {translation?.accepted_formats ||
                "Accepted formats are .jpg, .gif, .bmp, .png"}
            </p>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Cropper Modal */}
      <Modal
        show={showCropModal}
        onHide={() => setShowCropModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ position: "relative", height: "400px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCropModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserLogoUpload;

