import React, { useEffect, useState } from "react";
import { Dropdown, Nav, ButtonGroup, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";
const PropertyTypeDropdown = ({
  selectedPropertyType,
  selectedPropertyFor,
  handlePropertyTypeChange,
  handlePropertyForChange,
  handleReset,
  handleDone,
}) => {
  const { callApi } = AuthUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [propertyForData, setPropertyForData] = useState([]);

  // Fetch Property Type Data
  const translation = useTranslation();
  const fetchPropertyTypeData = async () => {
    try {
      const response = await callApi({
        api: "/get_property_type",
        method: "GET",
      });

      if (response?.data) {
        setPropertyTypeData(response.data);
      } else {
        toast.error(response.message || "Failed to fetch property types.");
      }
    } catch (error) {
      toast.error("Error fetching property types.");
    }
  };

  // Fetch Property For Data based on selected property type
  const fetchPropertyForData = async () => {
    if (!selectedPropertyType) return;

    try {
      const response = await callApi({
        api: `/get_property_for/${selectedPropertyType}`,
        method: "GET",
      });

      if (response?.data) {
        setPropertyForData(response.data);
      } 
    } catch (error) {
      toast.error("Error fetching property for options.");
    }
  };

  // Fetch Property Type data on mount
  useEffect(() => {
    fetchPropertyTypeData();
  }, []);

  // Fetch Property For data when selectedPropertyType changes
  useEffect(() => {
    fetchPropertyForData();
  }, [selectedPropertyType]);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleDoneClick = () => {
    handleDone();  // Call existing function
    setShowDropdown(false); // Close dropdown
  };

  const displayPropertyTyep = () => {
    let str = "";
    if (selectedPropertyType) {
      const category = propertyTypeData?.find((item) => item?.category_id == selectedPropertyType);
      str = category?.category_name;
    }
    if (selectedPropertyFor) {
      const subCategory = propertyForData?.find((item) => item?.sub_category_id == selectedPropertyFor)
      str = subCategory?.sub_category_name;
    }
    return str || "Residential";
  }
  
  return (
    <Dropdown className="select-dropdown d-grid mb-3" show={showDropdown}>
      <Dropdown.Toggle
        className="btn-form-control"
        id="dropdown-basic"
        onClick={toggleDropdown}
      >
       {displayPropertyTyep()}
      </Dropdown.Toggle>
  
      <Dropdown.Menu className="p-3">
        {/* Property Type Selection as Tabs */}
        <div className="form-field">
          <Nav
            variant="underline"
            activeKey={selectedPropertyType}
            onSelect={handlePropertyTypeChange}
          >
            {propertyTypeData.map((type) => (
              <Nav.Item key={type.category_id}>
                <Nav.Link role="button" eventKey={type.category_id}>
                  {type.category_name}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
  
        {/* Property For Selection as Radio Buttons */}
        <div className="mt-3">
          <div className="form-field">
            <ButtonGroup className="btn-group-light d-flex flex-wrap">
              {propertyForData.map((property, index) => (
                <div key={property.sub_category_id} className="me-2 mb-2">
                  <input
                    type="radio"
                    className="btn-check"
                    name="propertyForGroup"
                    id={`propertyFor-${index}`}
                    value={property.sub_category_id}
                    checked={selectedPropertyFor === property.sub_category_id}
                    onChange={() =>
                      handlePropertyForChange(property.sub_category_id)
                    }
                  />
                  <label
                    className="btn btn-outline-light"
                    htmlFor={`propertyFor-${index}`}
                  >
                    {property.sub_category_name}
                  </label>
                </div>
              ))}
            </ButtonGroup>
          </div>
        </div>
  
        {/* Reset & Done Buttons */}
        <div className="d-flex justify-content-between mt-3">
          <Button variant="outline-secondary" onClick={handleReset}>
            {translation?.reset || "Reset"}
          </Button>
          <Button variant="primary" onClick={handleDoneClick}>
          {translation?.done || "Done"}
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
  
};

export default PropertyTypeDropdown;
