import React from "react";

const Step2Form = ({formData,setFormData,handleChange,nextStep,prevStep}) => {
 


  const handleIncrement = () => {
    setFormData({ ...formData, totalFlats: formData.totalFlats + 1 });
  };

  const handleDecrement = () => {
    if (formData.totalFlats > 1) {
      setFormData({ ...formData, totalFlats: formData.totalFlats - 1 });
    }
  };

  return (
    <div id="step-2">
      <label className="form-label">You are here to</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          name="postFor"
          id="btnradio1"
          checked={formData.postFor === "rent"}
          onChange={handleChange}
          value="rent"
        />
        <label className="btn btn-outline-light" htmlFor="btnradio1">
          <img src="/assets/images/icons/rent-3.png" alt="Icon" height="24" width="24" /> Rent
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postFor"
          id="btnradio2"
          checked={formData.postFor === "sale"}
          onChange={handleChange}
          value="sale"
        />
        <label className="btn btn-outline-light" htmlFor="btnradio2">
          <img src="/assets/images/icons/sale-2.png" alt="Icon" height="24" width="24" /> Sale
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postFor"
          id="btnradio3"
          checked={formData.postFor === "pg"}
          onChange={handleChange}
          value="pg"
        />
        <label className="btn btn-outline-light" htmlFor="btnradio3">
          <img src="/assets/images/icons/hostel.png" alt="Icon" height="24" width="24" /> PG/Hostel
        </label>
      </div>

      <label className="form-label">Property Type</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          name="propertyType"
          id="property_1"
          checked={formData.propertyType === "flat"}
          onChange={handleChange}
          value="flat"
        />
        <label className="btn btn-outline-light" htmlFor="property_1">Flat</label>

        <input
          type="radio"
          className="btn-check"
          name="propertyType"
          id="property_2"
          checked={formData.propertyType === "house"}
          onChange={handleChange}
          value="house"
        />
        <label className="btn btn-outline-light" htmlFor="property_2">House</label>

        <input
          type="radio"
          className="btn-check"
          name="propertyType"
          id="property_3"
          checked={formData.propertyType === "villa"}
          onChange={handleChange}
          value="villa"
        />
        <label className="btn btn-outline-light" htmlFor="property_3">Villa</label>

        <input
          type="radio"
          className="btn-check"
          name="propertyType"
          id="property_4"
          checked={formData.propertyType === "plot"}
          onChange={handleChange}
          value="plot"
        />
        <label className="btn btn-outline-light" htmlFor="property_4">Plot</label>

        <input
          type="radio"
          className="btn-check"
          name="propertyType"
          id="property_5"
          checked={formData.propertyType === "penthouse"}
          onChange={handleChange}
          value="penthouse"
        />
        <label className="btn btn-outline-light" htmlFor="property_5">Penthouse</label>
      </div>

      <label className="form-label">Total No. Of Flats In Your Society</label>
      <div className="cart-plus-minus mb-4">
        <input
          type="text"
          className="form-control"
          value={formData.totalFlats}
          readOnly
        />
        <div className="minus qtybutton" onClick={handleDecrement}>
          <i className="icon-line-awesome-minus"></i>
        </div>
        <div className="plus qtybutton" onClick={handleIncrement}>
          <i className="icon-line-awesome-plus"></i>
        </div>
      </div>

      <div className="d-grid columns-2">
        <button
          type="button"
          className="btn btn-secondary btn-back-2"
          onClick={prevStep}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button
          type="button"
          className="btn btn-primary btn-next-2"
          onClick={nextStep}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step2Form;
