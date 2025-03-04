import React, { useState, useEffect } from 'react';
import {
  Form,
  Row,
  Col,
  ListGroup,
  FloatingLabel,

} from "react-bootstrap";

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
      <FloatingLabel controlId="floor_number" label="Floor No.:" className='mb-3'>
      <Form.Select
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
      </Form.Select>
      </FloatingLabel>

      <FloatingLabel controlId="total_floor" label="Total Floors:" className='mb-3'>
      <Form.Select
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
      </Form.Select>
      </FloatingLabel>

      <FloatingLabel controlId="flat_each_floor" label="Flats on the Floor:" className='mb-3'>
      <Form.Control
        type="text"
        placeholder=''
        id="flat_each_floor"
        value={formData.flat_each_floor || ""}
        onChange={(e) => handleChange(e, "flat_each_floor")}
      />
      </FloatingLabel>
      
      <FloatingLabel controlId="lifts_in_tower" label="Lifts in the Tower:">
      <Form.Select
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
      </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default EditFloorDetails;
