import React, { useState } from 'react';

const EditFloorDetails = ({totalFloors,floorNumber}) => {
  const [floorNo, setFloorNo] = useState("");
  // const [totalFloors, setTotalFloors] = useState("");
  const [liftsInTower, setLiftsInTower] = useState("");

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };


  console.log(totalFloors,floorNumber)
  // Options for the dropdowns
  const floorsOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const liftsOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <label htmlFor="floorNo">Floor No.:</label>
      <select id="floorNo" value={floorNo} onChange={(e) => handleChange(e, setFloorNo)}>
        <option value="">Select Floor</option>
        {floorsOptions.map((floor) => (
          <option key={floor} value={floor}>
            {floor}
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="totalFloors">Total Floors:</label>
      <select id="totalFloors" value={totalFloors} onChange={(e) => handleChange(e, setTotalFloors)}>
        <option value="">Select Total Floors</option>
        {floorsOptions.map((floor) => (
          <option key={floor} value={floor}>
            {floor}
          </option>
        ))}
      </select>

      <br />

      <label htmlFor="flatsOnFloor">Flats on the Floor:</label>
      <input
        type="text"
        id="flatsOnFloor"
        value={liftsInTower}
        onChange={(e) => handleChange(e, setLiftsInTower)}
      />

      <br />

      <label htmlFor="liftsInTower">Lifts in the Tower:</label>
      <select
        id="liftsInTower"
        value={liftsInTower}
        onChange={(e) => handleChange(e, setLiftsInTower)}
      >
        <option value="">Select Number of Lifts</option>
        {liftsOptions.map((lifts) => (
          <option key={lifts} value={lifts}>
            {lifts}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EditFloorDetails;
