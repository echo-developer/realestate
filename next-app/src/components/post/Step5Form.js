"use client";
import React, { useState } from 'react';

const Step5Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  const possessionStatusOptions = [
    { id: 'pstatus1', label: 'Under Construction', value: 'Under Construction' },
    { id: 'pstatus2', label: 'Ready to Move', value: 'Ready to Move' },
  ];

  const ageOptions = [
    { id: 'age_1', label: 'New', value: 'New' },
    { id: 'age_2', label: 'Less Than 5 Years', value: 'Less Than 5 Years' },
    { id: 'age_3', label: '5-10 Years', value: '5-10 Years' },
    { id: 'age_4', label: '10-15 Years', value: '10-15 Years' },
    { id: 'age_5', label: '15-20 Years', value: '15-20 Years' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));


    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };


 

  const validateForm = () => {
    const newErrors = {};

    // Validate Possession Status
    if (!formData.pstatus) {
      newErrors.pstatus = 'Please select possession status.';
    }

    // Validate Age of Construction
    if (!formData.age) {
      newErrors.age = 'Please select the age of construction.';
    }

    // Validate Expected Price
    if (!formData.expectedPrice || isNaN(formData.expectedPrice)) {
      newErrors.expectedPrice = 'Please enter a valid expected price.';
    }

    // Validate Currency
    if (!formData.currency) {
      newErrors.currency = 'Please select a currency.';
    }

    // Validate Token Amount (optional but should be valid if entered)
    if (formData.tokenAmount && isNaN(formData.tokenAmount)) {
      newErrors.tokenAmount = 'Please enter a valid token amount.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div id="step-5">
      {/* Possession Status */}
      <div className="mb-3">
        <label className="form-label">Possession Status:</label>
        {possessionStatusOptions.map((option) => (
          <div className="form-check form-check-inline" key={option.id}>
            <input
              className={`form-check-input ${errors.pstatus ? 'is-invalid' : ''}`}
              type="radio"
              name="pstatus"
              id={option.id}
              value={option.value}
              checked={formData.pstatus === option.value}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={option.id}>
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {/* Age Of Construction */}
      <label className="form-label">Age Of Construction:</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Age">
        {ageOptions.map((option) => (
          <React.Fragment key={option.id}>
            <input
              type="radio"
              className={`btn-check ${errors.age ? 'is-invalid' : ''}`}
              name="age"
              id={option.id}
              autoComplete="off"
              value={option.value}
              checked={formData.age === option.value}
              onChange={handleChange}
            />
            <label className="btn btn-outline-light" htmlFor={option.id}>
              {option.label}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Expected Price */}
      <div className="row gx-3">
        <div className="col-lg-6 col-12">
          <label className="form-label">Expected Price</label>
          <div className="input-group mb-3">
            <select
              className={`selectpicker form-control ${errors.currency ? 'is-invalid' : ''}`}
              value={formData.currency}
              onChange={handleChange}
              name="currency"
              data-width="fit"
              title="Currency"
            >
              <option value="">Currency</option>
              <option value="AED">AED</option>
              <option value="EURO">EURO</option>
              <option value="POND">POND</option>
              <option value="USD">USD</option>
            </select>
            <input
              type="text"
              className={`form-control ${errors.expectedPrice ? 'is-invalid' : ''}`}
              placeholder="Enter Amount"
              value={formData.expectedPrice}
              onChange={handleChange}
              name="expectedPrice"
            />
          </div>
        </div>

        {/* Booking/Token Amount */}
        <div className="col-lg-6 col-12">
          <div className="form-field">
            <label className="form-label">Booking/Token Amount (optional)</label>
            <input
              type="text"
              className={`form-control ${errors.tokenAmount ? 'is-invalid' : ''}`}
              placeholder="Enter Token Amount"
              value={formData.tokenAmount}
              onChange={handleChange}
              name="tokenAmount"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary btn-back-5" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button type="button" className="btn btn-primary btn-next-5" onClick={handleNext}>
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step5Form;
