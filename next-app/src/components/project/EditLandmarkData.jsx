import React, { useState, useEffect } from "react";
import {
  Form,
  FloatingLabel,
  Button,
  Row,
  Col,
  Nav
} from "react-bootstrap";
const LandmarkComponent = ({ value, onChange, projectData }) => {
  const allTabs = {
    education: [{ key: "education1", name: "", distance: "" }],
    healthcare: [{ key: "healthcare1", name: "", distance: "" }],
    shopping_center: [{ key: "shopping1", name: "", distance: "" }],
    commercial_hub: [{ key: "commercial1", name: "", distance: "" }],
    transportation_hub: [{ key: "transport1", name: "", distance: "" }],
  };

  const initialFormData = { ...allTabs, ...(value?.landmarks || projectData?.landmarks || {}) };
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
      setFormData({ ...allTabs, ...value.landmarks });
    }
  }, [value]);

  return (
    <React.Fragment>
      <div className="row gx-3">
        <div className="col-12"> 
          <Nav variant="underline" className="mb-4">
            {Object.keys(initialFormData)?.map((key, i) => (       
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

        {Object.keys(allTabs).map((key) => (
          <div
            key={key}
            className={`col-12 ${activeTab === key ? "active" : ""}`}
            style={{ display: activeTab === key ? "block" : "none" }}
          >            
              
              <div className="mb-4">
              <button
                    onClick={(e) => {
                      e.preventDefault();
                      increment(key);
                    }}
                    type="button"
                    className="btn btn-success"
                  >
                  <i class="bi bi-plus-lg"></i> Add {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
                  </button>
              </div>

              {formData[activeTab]?.length > 0 &&
                formData[activeTab]?.map((item, i) => (
                  <Row className="gx-3" key={item?.key}>
                    <Col className="col-12 mb-3">
                      <strong>{`${key.charAt(0).toUpperCase() + key.slice(1)} ${i + 1}`}</strong>
                    </Col>
                    <Col className="col-sm mb-3">                      
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Name"
                      >
                        <Form.Control
                          type="text"
                          placeholder="Enter Name"
                          value={item?.name}
                          onChange={(e) => handleFieldChange(key, i, "name", e.target.value)}
                        />
                      </FloatingLabel>
                    </Col>
                    <Col className="col-sm mb-3">   
                      <div className="input-group">                   
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Distance"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter Distance"
                            value={item?.distance}
                            onChange={(e) => handleFieldChange(key, i, "distance", e.target.value)}
                          />
                        </FloatingLabel>
                        <span className="input-group-text">sqft</span>
                      </div>
                    </Col>
                    <Col className="col-sm-auto">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          decrement(key);
                        }}
                        type="button"
                        className="btn btn-danger"
                        title="Remove"
                      >
                        <i class="bi bi-x-lg"></i>
                      </Button>
                    </Col>
                  </Row>
                ))}
            
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default LandmarkComponent;
