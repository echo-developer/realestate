"use client"
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";

function NoCreditModal({ show, onHide }) {
  const router = useRouter();

  const goToMembership = () => {
    onHide();
    router.push("/membership");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>No Credits Available</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You don’t have enough credits to proceed.</p>
        <p>Please upgrade your membership to continue.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={goToMembership}>
          Go to Membership
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoCreditModal;
