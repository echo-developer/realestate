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
        <Modal.Title>{translation?.no_credits_available || "No Credits Available"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{translation?.not_enough_credits || "You don’t have enough credits to proceed."}
        </p>
        <p>{translation?.upgrade_membership_to_continue || "Please upgrade your membership to continue."}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
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
