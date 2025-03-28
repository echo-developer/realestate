import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const UploadProjectDocument = ({ propId, show, onClose }) => {
  const { callApi } = AuthUser();
  const [documents, setDocuments] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [currentDoc, setCurrentDoc] = useState({
    certificate_number: "",
    certificate_name: "",
    fileName: null,
    doc_id: "",
    property_id: propId,
    project_id: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (field, value) => {
    setCurrentDoc((prev) => ({ ...prev, [field]: value }));
  };

  // Handle File Change
  const handleFileChange = async (file) => {
    if (!file) return;
    setCurrentDoc((prev) => ({ ...prev, file }));
    await uploadFile(file);
  };

  // Upload File API
  const uploadFile = async (file) => {
    try {
      const response = await callApi({
        api: `/upload_certificates_img`,
        method: "UPLOAD",
        data: {
          file,
          property_id: propId,
        },
      });
      if (response?.status === 1) {
        setFileUrl(response.filename_url);
        setCurrentDoc((prev) => ({
          ...prev,
          fileName: response.fileName,
        }));
        toast.success(response.message || "File uploaded successfully.");
      } else {
        toast.error(response?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("Error uploading file.");
    }
  };

  // Save Document to API
  const saveDocumentToAPI = async () => {
    if (!currentDoc.certificate_number || !currentDoc.certificate_name || !fileUrl) {
      toast.error("Please complete all fields and upload a file.");
      return;
    }

    setLoading(true);
    try {
      const response = await callApi({
        api: `/upload_certificates_details`,
        method: "UPLOAD",
        data: { ...currentDoc, file_url: fileUrl },
      });

      if (response?.status === 1) {
        toast.success(response.message || "Document uploaded successfully.");
        setDocuments((prev) => [...prev, { ...currentDoc, file_url: fileUrl }]);
        resetForm();
      } else {
        toast.error(response?.message || "Document upload failed.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error saving document.");
    } finally {
      setLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setCurrentDoc({
      certificate_number: "",
      certificate_name: "",
      fileName: null,
      doc_id: "",
      property_id: propId,
      project_id: "",
    });
    setFileUrl("");
  };

  // Submit All Documents
  const handleSubmitAll = async () => {
    if (documents.length === 0) {
      toast.error("No documents to submit.");
      return;
    }

    setLoading(true);
    try {
      for (const doc of documents) {
        const response = await callApi({
          api: `/upload_certificates_details`,
          method: "UPLOAD",
          data: doc,
        });

        if (response?.status !== 1) {
          toast.error(`Failed to upload: ${doc.certificate_name}`);
          return;
        }
      }
      toast.success("All documents submitted successfully.");
      onClose();
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Error submitting documents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Documents</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Registration Number</Form.Label>
          <Form.Control
            type="text"
            value={currentDoc.certificate_number}
            onChange={(e) => handleChange("certificate_number", e.target.value)}
            placeholder="Enter Registration Number"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Document Name</Form.Label>
          <Form.Control
            type="text"
            value={currentDoc.certificate_name}
            onChange={(e) => handleChange("certificate_name", e.target.value)}
            placeholder="Enter Document Name"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload File</Form.Label>
          <Form.Control type="file" onChange={(e) => handleFileChange(e.target.files[0])} />
        </Form.Group>

        {/* File Review Section */}
        {fileUrl && (
          fileUrl.endsWith(".pdf") ? (
            <p>
              <strong>Uploaded File: </strong>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </p>
          ) : (
            <div>
              <strong>Uploaded Image Preview:</strong>
              <img src={fileUrl} alt="Uploaded Document" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )
        )}

        {/* Save and Add New */}
        <Button variant="primary" onClick={saveDocumentToAPI} disabled={loading}>
          {loading ? "Saving..." : "Save and Add More"}
        </Button>

        <hr />
        <h6>Saved Documents</h6>
        {documents.length === 0 ? (
          <p>No documents added yet.</p>
        ) : (
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>
                {doc.certificate_name} (Reg No: {doc.certificate_number}) - 
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View</a>
              </li>
            ))}
          </ul>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UploadProjectDocument;
