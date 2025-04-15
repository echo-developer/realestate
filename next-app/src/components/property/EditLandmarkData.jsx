import React, { useState, useEffect } from "react";
import {
  Form,
  FloatingLabel,
  Button,
  Row,
  Col,
  Nav
} from "react-bootstrap";

const PropertyLandmarkComponent = ({ value, onChange, propertyData }) => {
  const allTabs = {
    education: [{ key: "education1", name: "", distance: "" }],
    healthcare: [{ key: "healthcare1", name: "", distance: "" }],
    shopping_center: [{ key: "shopping1", name: "", distance: "" }],
    commercial_hub: [{ key: "commercial1", name: "", distance: "" }],
    transportation_hub: [{ key: "transpot1", name: "", distance: "" }],
  };

  const initialFormData = value?.landmark || propertyData?.landmarks || allTabs;

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(Object.keys(initialFormData)[0]);

  const increment = (key) => {
    const updatedFormData = { ...formData };
    if (!updatedFormData[key]) updatedFormData[key] = [];
    const newKey = `${key}${updatedFormData[key].length + 1}`;
    updatedFormData[key].push({ key: newKey, name: "", distance: "" });
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  const decrement = (key) => {
    const updatedFormData = { ...formData };
    if (updatedFormData[key]?.length > 0) {
      updatedFormData[key].pop();
      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const handleFieldChange = (key, index, field, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[key][index][field] = value;
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  useEffect(() => {
    if (value?.landmarks) {
      setFormData(value.landmarks);
    }
  }, [value]);

  return (
    <React.Fragment>
      <div className="row gx-3">
        {/* Render landmark tabs dynamically */}
        <div className="col-12">          
          <Nav variant="underline" className="mb-4">
            {Object.keys(allTabs).map((key, i) => (              
              <Nav.Item
                key={`landmark_tab_${i}`}
                className={`nav-item`}
              >
                <Nav.Link className={`${activeTab === key ? "active" : ""}`} 
                onClick={() => setActiveTab(key)}
                >
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                </Nav.Link>
              </Nav.Item>       
            ))}
          </Nav>
        </div>

        {/* Render input fields for each tab */}
        {Object.keys(allTabs).map((key) => (
          <div
            key={key}
            className={`col-12 ${activeTab === key ? "active" : ""}`}
            style={{ display: activeTab === key ? "block" : "none" }}
          >
            
              
            <div className="mb-4">                
              <button className="btn btn-success" onClick={() => increment(key)}><i class="bi bi-plus-lg"></i> Add {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}</button>
            </div>

            {/* Render the fields for each item in the current tab */}
            {(formData[key] || []).map((item, index) => (
              <fieldset className="mb-3 rounded-2">
                <legend className="mb-0">{`${key.charAt(0).toUpperCase() + key.slice(1)} ${index + 1}`}</legend>
                <Row key={`${key}_${index}`} className="gx-3">                  
                  <Col xs={12} sm>
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Name"
                      className="mb-3 mb-sm-0"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={item.name}
                        onChange={(e) => handleFieldChange(key, index, "name", e.target.value)}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col xs={12} sm>
                    <div className="input-group mb-3 mb-sm-0">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Distance"
                      >
                        <Form.Control
                        type="text"
                        placeholder="Enter Distance"
                        value={item.distance}
                        onChange={(e) => handleFieldChange(key, index, "distance", e.target.value)}
                      />
                      </FloatingLabel>
                      <span className="input-group-text">meter</span>
                    </div>                  
                  </Col>
                  <Col xs="auto" sm="auto">
                    <Button 
                      className="btn btn-danger" 
                      onClick={() => decrement(key)}
                      title="Remove"
                    >
                      <i class="bi bi-x-lg"></i>
                    </Button>
                  </Col>
                </Row>
              </fieldset>
            ))}
            
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default PropertyLandmarkComponent;