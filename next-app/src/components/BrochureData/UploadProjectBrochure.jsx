import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const UploadProjectBrochure = ({ show, handleClose, projectId }) => {
  const { callApi } = AuthUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [base64Data, setBase64Data] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));

      // Convert file to Base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBase64Data(reader.result.split(",")[1]); // Extract only Base64 part
      };
      reader.onerror = (error) => {
        console.error("Error converting file:", error);
      };
    } else {
      alert("Please select a valid PDF file.");
      setSelectedFile(null);
      setPreviewURL(null);
      setBase64Data(null);
    }
  };

  const handleUpload = async () => {

    if (selectedFile) {
      console.log(selectedFile)
      try {
        const response = await callApi({
          api: "/upload_prj_brochure",
          method: "UPLOAD",
          data: {
            project_id: projectId,
            brochure_data: selectedFile,
          },
        });

        if (response && response.success === 1) {
          toast.success(response.message || "Brochure Uploaded Successfully");
        } else {
          toast.error(response.message || "Brochure Upload Failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("An error occurred while uploading.");
      }

      handleClose();
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{translation?.upload_project_brochure || "Upload Project Brochure"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div class="upload-area" id="uploadfile">
          <input
            type="file"
            id="fileinput"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <i class="bi bi-upload"></i>
          <p>{translation?.drag || "Drag"}
            &amp; {translation?.drop_files_here || "Drop files here"}
            <span class="text-site">{translation?.click || "Click"}
            </span> {translation?.to_select_files || "to select files"}
          </p>
        </div>
        <p class="text-help">{translation?.accepted_formats || "Accepted formats are .jpg, .gif, .bmp"}
          &amp; .png.</p>

        {previewURL && (
          <div className="mt-3">
            <p className="text-success">{translation?.selected_file || "Selected File:"}
              {selectedFile.name}</p>
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
                {translation?.open_in_new_tab || "Open in New Tab"}

              </a>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {translation?.cancel || "Cancel"}

        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={!base64Data}>
          {translation?.upload || "Upload"}

        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadProjectBrochure;
