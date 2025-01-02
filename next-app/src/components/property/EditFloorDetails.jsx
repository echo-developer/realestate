import React, { useState, useEffect } from 'react';

const EditFloorDetails = ({ propertyData, onChange }) => {
  const [formData, setFormData] = useState({
    floor_number: propertyData?.floor_number || "",
    total_floor: propertyData?.total_floor || "",
    flat_each_floor: propertyData?.flat_each_floor || "",
    lifts_in_tower: propertyData?.lifts_in_tower || "",
  });

  useEffect(() => {
    if (propertyData) {
      setFormData({
        floor_number: propertyData.floor_number || "",
        total_floor: propertyData.total_floor || "",
        flat_each_floor: propertyData.flat_each_floor || "",
        lifts_in_tower: propertyData.lifts_in_tower || "",
      });
    }
  }, [propertyData]);

  const handleChange = (event, key) => {
    const newValue = event.target.value;
    const updatedFormData = { ...formData, [key]: newValue };
    setFormData(updatedFormData);
    onChange(updatedFormData); 
  };

  const floorsOptions = Array.from({ length: 100 }, (_, i) => i + 1);
  const liftsOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <label htmlFor="floor_number">Floor No.:</label>
      <select
        id="floor_number"
        value={formData.floor_number || ""}
        onChange={(e) => handleChange(e, "floor_number")}
      >
        <option value="">Select Floor</option>
        {floorsOptions.map((floor) => (
          <option key={floor} value={floor}>
            {floor}
          </option>
        ))}
      </select>
      <br />

      <label htmlFor="total_floor">Total Floors:</label>
      <select
        id="total_floor"
        value={formData.total_floor || ""}
        onChange={(e) => handleChange(e, "total_floor")}
      >
        <option value="">Select Total Floors</option>
        {floorsOptions.map((floor) => (
          <option key={floor} value={floor}>
            {floor}
          </option>
        ))}
      </select>
      <br />

      <label htmlFor="flat_each_floor">Flats on the Floor:</label>
      <input
        type="text"
        id="flat_each_floor"
        value={formData.flat_each_floor || ""}
        onChange={(e) => handleChange(e, "flat_each_floor")}
      />
      <br />

      <label htmlFor="lifts_in_tower">Lifts in the Tower:</label>
      <select
        id="lifts_in_tower"
        value={formData.lifts_in_tower || ""}
        onChange={(e) => handleChange(e, "lifts_in_tower")}
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
