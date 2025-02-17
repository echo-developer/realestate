import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';

const PropertyLegalCheck = () => {
  const [checks, setChecks] = useState({
    validOwnership: false,
    noPendingLitigation: false,
    clearTitle: false,
    validBuildingPermit: false,
    taxClearance: false,
    noIllegalConstruction: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecks((prevChecks) => ({
      ...prevChecks,
      [name]: checked,
    }));
  };

  const handleSubmit = () => {
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    const result = passedChecks === totalChecks
      ? 'Property is legally clear.'
      : 'Property has legal issues.';

    alert(result);
  };

  return (
    <MainLayout>
    <div className="container my-5">
      <h1 className="text-center mb-4">Property Legal Tick Check</h1>

      <form>
        <div className="mb-3">
          <input
            type="checkbox"
            name="validOwnership"
            checked={checks.validOwnership}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">Valid Ownership Documents</label>
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            name="noPendingLitigation"
            checked={checks.noPendingLitigation}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">No Pending Litigation</label>
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            name="clearTitle"
            checked={checks.clearTitle}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">Clear Title</label>
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            name="validBuildingPermit"
            checked={checks.validBuildingPermit}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">Valid Building Permit</label>
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            name="taxClearance"
            checked={checks.taxClearance}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">Tax Clearance</label>
        </div>

        <div className="mb-3">
          <input
            type="checkbox"
            name="noIllegalConstruction"
            checked={checks.noIllegalConstruction}
            onChange={handleCheckboxChange}
          />
          <label className="ms-2">No Illegal Construction</label>
        </div>

        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>

      <div className="mt-4">
        <h4>Legal Check Summary</h4>
        <ul>
          <li>Valid Ownership Documents: {checks.validOwnership ? '✔️' : '❌'}</li>
          <li>No Pending Litigation: {checks.noPendingLitigation ? '✔️' : '❌'}</li>
          <li>Clear Title: {checks.clearTitle ? '✔️' : '❌'}</li>
          <li>Valid Building Permit: {checks.validBuildingPermit ? '✔️' : '❌'}</li>
          <li>Tax Clearance: {checks.taxClearance ? '✔️' : '❌'}</li>
          <li>No Illegal Construction: {checks.noIllegalConstruction ? '✔️' : '❌'}</li>
        </ul>
      </div>
    </div>
    </MainLayout>
  );
};

export default PropertyLegalCheck;
