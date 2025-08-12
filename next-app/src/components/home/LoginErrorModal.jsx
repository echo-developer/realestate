"use client";
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

const LoginErrorModal = ({
  showLoginErrorModal,
  handleLoginErrorClose,
  translation,
}) => {
  const router = useRouter();

  return (
    <Modal
      show={showLoginErrorModal}
      onHide={handleLoginErrorClose}
      centered
      size="lg"
    >
      <Modal.Header>
        <Button
          variant="secondary"
          onClick={handleLoginErrorClose}
          style={{ position: 'absolute', left: '15px' }}
        >
          {translation?.cancel || 'Cancel'}
        </Button>
        <Modal.Title className="mx-auto">
          {translation?.login_required || 'Login Required'}
        </Modal.Title>
        <Button
          variant="danger"
          onClick={() => {
            handleLoginErrorClose();
            router.push('/login');
          }}
          style={{ position: 'absolute', right: '15px' }}
        >
          {translation?.login || 'Login'}
        </Button>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">
          {translation?.please_log_in_to_perform_this_action ||
            'Please log in to perform this action.'}
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default LoginErrorModal;
