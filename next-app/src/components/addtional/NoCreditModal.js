"use client"
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "@/hooks/useTranslation";

function NoCreditModal({ show, onHide }) {
  const router = useRouter();
  const translation = useTranslation()
  const goToMembership = () => {
    onHide();
    router.push("/membership");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title as='h5'>{translation?.no_credits_available || "No Credits Available"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center bg-danger-subtle p-3 rounded-2">
          <img src='/assets/images/icons/3515278.png' alt="No Credit" height={64} width={64} className="mb-2" />         
          <p className="mb-0">{translation?.not_enough_credits || "You don’t have enough credits to proceed."}</p>        
          <p className="fst-italic text-muted">{translation?.upgrade_membership_to_continue || "Please upgrade your membership to continue."}</p>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="outline-secondary" onClick={onHide}>
          {translation?.cancel || "Cancel"}

        </Button>
        <Button variant="primary" onClick={goToMembership}>
          {translation?.go_to_membership || "Go to Membership"}

        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NoCreditModal;
