"use client";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthUser from "@/components/Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { toast } from "react-toastify";

const UserLogoUpload = ({ show, setShow, setUserLogo }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();

  const translation = useTranslation();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleUpload(file);
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
        setUserLogo(response?.data?.image_url);
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
    <div>
      <Button variant="primary" onClick={handleShow}>
        {translation?.upload_logo || "Upload Logo"}
      </Button>

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
    </div>
  );
};

export default UserLogoUpload;
