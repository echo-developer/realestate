import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import AuthUser from "@/components/Authentication/AuthUser";

const UserLogoUpload = ({ show, setShow }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const { callApi ,GetMemberId} = AuthUser();
    const memberId= GetMemberId();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        console.log(file)
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await callApi({
                api: `/update_profile_image`,
                method: "POST",
                data: { 
                    id:memberId,
                    image: formData 
                },
            });
            if (response.status === 1) {
                console.log("Upload successful:", response.data);
                handleClose();
            } else {
                console.error("Upload failed:", response.message);
            }
        } catch (error) {
            console.error("Error during upload:", error);
        }
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>
                Upload Logo
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload User Logo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select a logo to upload</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
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
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserLogoUpload;
