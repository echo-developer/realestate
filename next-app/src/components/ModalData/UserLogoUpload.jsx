"use client";
import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthUser from "@/components/Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { toast } from "react-toastify";
import ImageCropper from "./ProfileImageCropper";

const UserLogoUpload = ({ show, setShow, uploadUserImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const fileInputRef = useRef();
  const [cropperModal, setCropperModal] = useState(false);

  const translation = useTranslation();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // handleUpload(file);
    if (file)
      setSelectedFile(file);
    setCropperModal(true);
  };



  const handleUpload = async (file) => {
    try {
      const response = await callApi({
        api: `/update_profile_image`,
        method: "UPLOAD",
        data: {
          id: memberId,
          image: file,
        },
      });
      if (response && response.status === 1) {
        uploadUserImage(response?.data?.image_url);
        if (typeof window !== "undefined") {
          localStorage.setItem("user_logo", response?.data?.image_url);
          setSelectedFile(null);
          if (fileInputRef?.current) {
            fileInputRef.current.value = "";
          }
        }
        handleClose();
      } else {
        toast.error(response.message || "Upload failed");
        setSelectedFile(null)
        if (fileInputRef?.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setSelectedFile(null);
      if (fileInputRef?.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCropDone = (file) => {
    if (file) {
      handleUpload(file);
    }
  }

  return (
    <div>
      {/* <Button variant="primary" onClick={handleShow}>
        {translation?.upload_logo || "Upload Logo"}
      </Button> */}
      {/* {cropperModal ?
        (<>       */}
      <ImageCropper file={selectedFile} show={cropperModal} onClose={() => setCropperModal(false)} onCropDone={handleCropDone} />
      {/* </>)
        :
        (<> */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {translation?.upload_user_logo || "Upload User Logo"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="upload-area">
              <Form.Control
                type="file"
                id="fileinput"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <i class="bi bi-upload"></i>
              <p>
                {translation?.darg || "Drag"} &amp;{" "}
                {translation?.drag_drop_files || "Drop files here or"}{" "}
                <span class="text-site">{translation?.click || "Click"}</span>{" "}
                {translation?.click_to_select || "to select files"}
              </p>
            </Form.Group>
            <p class="text-help">
              {translation?.accepted_formats ||
                "Accepted formats are .jpg, .gif, .bmp, png"}
            </p>
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        Upload
                    </Button>
                </Modal.Footer> */}
      </Modal>
      {/* </>)} */}

    </div>
  );
};

export default UserLogoUpload;
