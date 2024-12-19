import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const AddAmenity = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddAmenity = () => {
    // Logic for adding an amenity
    console.log("Amenity added!");
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal} className="btn btn-primary">
        Add Amenity
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Amenity Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "500px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <h2>Add Amenity</h2>
        <form>
          <div className="form-group">
            <label htmlFor="amenityName">Amenity Name</label>
            <input
              type="text"
              id="amenityName"
              className="form-control"
              placeholder="Enter amenity name"
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="amenityDescription">Description</label>
            <textarea
              id="amenityDescription"
              className="form-control"
              rows="3"
              placeholder="Enter a brief description"
            ></textarea>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddAmenity}
              className="btn btn-success me-2"
            >
              Add Amenity
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddAmenity;
