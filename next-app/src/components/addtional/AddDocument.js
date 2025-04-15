import React, { useEffect, useState } from "react";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";

const DocumentUploadModal = ({ propId, show, onClose }) => {
  const { callApi } = AuthUser();
  const [documents, setDocuments] = useState([]);
  const [newDocuments, setNewDocuments] = useState([]); // Track new uploads
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
const translation = useTranslation();
  // Fetch Previous Documents
  const fetchDocuments = async () => {
    try {
      const response = await callApi({
        api: `/certificates_details`,
        method: "GET",
        data: { property_id: propId },
      });

      if (response?.status === 1) {
        setDocuments(response.data);
      } else {
        toast.error(response?.message || "Failed to fetch documents.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error fetching documents.");
    }
  };

  useEffect(() => {
    if (show) fetchDocuments();
  }, [show]);

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
        data: { file, property_id: propId },
      });

      if (response?.status === 1) {
        setFileUrl(response.filename_url);
        setCurrentDoc((prev) => ({ ...prev, fileName: response.fileName }));
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
    if (
      !currentDoc.certificate_number ||
      !currentDoc.certificate_name ||
      !fileUrl
    ) {
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
        toast.success(response?.message || "Document uploaded successfully.");

        // Add to newDocuments instead of documents
        const newDocument = { ...currentDoc, file_url: fileUrl };
        setNewDocuments((prev) => [...prev, newDocument]);

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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{translation?.upload_documents || "Upload Documents"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display Previous Documents */}
        <h5>{translation?.previous_documents || "Previous Documents"}</h5>
        {documents?.length === 0 ? (
          <p className="text-muted text-italic">{translation?.no_documents_yet || "No documents added yet."}</p>
        ) : (
          <ul className="list-unstyled">
            {documents?.map((doc, index) => (
              <li key={index} className="d-flex align-items-center mb-3">
                <span className="me-3">
                  {doc?.certificate_name} ({translation?.reg_no || "Reg No"}
                    {doc?.certificate_number}) -
                </span>
                {doc?.filename_url?.endsWith(".pdf") ? (
                  <a
                    href={doc?.filename_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                   {translation?.view || "View"}

                  </a>
                ) : (
                  <img
                    src={doc?.filename_url}
                    alt={doc?.certificate_name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        <hr />

        {/* Form for New Upload */}
        <h5 className="mb-3">{translation?.upload_new_document || "Upload New Document"}</h5>
        <FloatingLabel
          label={translation?.registration_number || "Registration Number"} 
          className="mb-3"
        >
          <Form.Control
            type="text"            
            value={currentDoc.certificate_number}
            onChange={(e) => handleChange("certificate_number", e.target.value)}
            placeholder={translation?.enter_registration_number || "Enter Registration Number"}

          />
        </FloatingLabel>
        <FloatingLabel 
          label={translation?.document_name || "Document Name"}
          className="mb-3"
        >
          <Form.Control
            type="text"
            value={currentDoc.certificate_name}
            onChange={(e) => handleChange("certificate_name", e.target.value)}
            placeholder={translation?.enter_document_name || "Enter Document Name"}

          />
        </FloatingLabel>
        <Form.Group 
          label={translation?.upload_file || "Upload File"}
          className="upload-area"
        >
          <Form.Control
            type="file"
            id="fileinput"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <i class="bi bi-upload"></i>
          <p>Drag &amp; Drag &amp; Drop files here or <span class="text-site">Click</span> Click to select files</p>
        </Form.Group>

        {/* File Preview */}
        {fileUrl &&
          (fileUrl.endsWith(".pdf") ? (
            <p>
              <strong>{translation?.uploaded_file || "Uploaded File:"}
              </strong>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {translation?.view_pdf || "View PDF"}

              </a>
            </p>
          ) : (
            <div>
              <strong>{translation?.uploaded_image_preview || "Uploaded Image Preview:"}
              </strong>
              <img
                src={fileUrl}
                alt="Uploaded Document"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            </div>
          ))}

        {/* Display Newly Uploaded Documents */}
        {newDocuments.length > 0 && (
          <>
            <hr />
            <h6>{translation?.newly_uploaded_documents || "Newly Uploaded Documents"}
            </h6>
            <ul className="list-unstyled">
              {newDocuments?.map((doc, index) => (
                <li key={index} className="d-flex align-items-center mb-3">
                  <span className="me-3">
                    {doc?.certificate_name} ({translation?.reg_no || "Reg No"}
                      {doc?.certificate_number})
                    -
                  </span>
                  {doc?.file_url?.endsWith(".pdf") ? (
                    <a
                      href={doc?.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translation?.view_pdf || "View PDF"}

                    </a>
                  ) : (
                    <img
                      src={doc?.file_url}
                      alt={doc?.certificate_name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={saveDocumentToAPI}
          disabled={loading}
        >
          {loading ? "Saving..." : `${translation?.save_document || "Save Document"}`
        }
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentUploadModal;
