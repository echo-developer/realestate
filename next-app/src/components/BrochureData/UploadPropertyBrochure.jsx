import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const UploadPropertyBrochure = ({ show, handleClose ,propertyId}) => {
  const {callApi}=AuthUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    } else {
      alert("Please select a valid PDF file.");
      setSelectedFile(null);
      setPreviewURL(null);
    }
  };

  const handleUpload = async() => {
    if (selectedFile) {
      try {
        const response = await callApi({
          api:'/upload_prt_brochure',
          method:'UPLOAD',
          data:{
            property_id:propertyId,
            brochure_data:selectedFile,
          }
        })
        if(response && response.status === 1 ){
          toast.success(response.message || "Brochure Upload Successfully")
        }else{
          toast.error(response.message || "Brochure Upload failed")
        }
      } catch (error) {
        
      }
      handleClose();
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Upload Property Brochure</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={handleFileChange}
        />

        {previewURL && (
          <div className="mt-3">
            <p className="text-success">Selected File: {selectedFile.name}</p>
            <div className="border p-2 text-center">
              <iframe
                src={previewURL}
                title="PDF Preview"
                width="100%"
                height="150px"
                style={{ border: "1px solid #ccc" }}
              />
              <br />
              <a href={previewURL} target="_blank" rel="noopener noreferrer">
                Open in New Tab
              </a>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} centered>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={!selectedFile}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadPropertyBrochure;
