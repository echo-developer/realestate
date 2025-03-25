import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const DocumentUploadModal = ({ show, onClose, onSubmit }) => {
  const [documents, setDocuments] = useState([
    { registrationNumber: "", documentName: "", file: null }
  ]);

  // Handle Input Change
  const handleChange = (index, field, value) => {
    const updatedDocs = [...documents];
    updatedDocs[index][field] = value;
    setDocuments(updatedDocs);
  };

  // Handle File Change
  const handleFileChange = (index, file) => {
    const updatedDocs = [...documents];
    updatedDocs[index].file = file;
    setDocuments(updatedDocs);
  };

  // Add More Documents
  const addDocument = () => {
    setDocuments([...documents, { registrationNumber: "", documentName: "", file: null }]);
  };

  // Remove Document
  const removeDocument = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);
  };

  // Submit Form
  const handleSubmit = () => {
    onSubmit(documents); // Callback with documents data
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Documents</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {documents.map((doc, index) => (
          <div key={index} className="mb-3 border p-3 rounded">
            <Form.Group className="mb-2">
              <Form.Label>Registration Number</Form.Label>
              <Form.Control
                type="text"
                value={doc.registrationNumber}
                onChange={(e) => handleChange(index, "registrationNumber", e.target.value)}
                placeholder="Enter Registration Number"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                value={doc.documentName}
                onChange={(e) => handleChange(index, "documentName", e.target.value)}
                placeholder="Enter Document Name"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(index, e.target.files[0])}
              />
            </Form.Group>
            {documents.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => removeDocument(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button variant="primary" onClick={addDocument}>
          + Add More
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentUploadModal;
