import { useState } from "react";
import { Modal, Button, Form, Tab, Nav } from "react-bootstrap";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";

const floorPlanData = {
  kitchen: [
    { item: "Kitchen sink", description: "" },
    { item: "Exhaust fan", description: "" },
    { item: "Gas supply", description: "" },
    { item: "Kitchen platform", description: "" },
    { item: "Water purifier", description: "" },
  ],
  floor: [
    { item: "Wooden Flooring", description: "" },
    { item: "Ceramic Tiles", description: "" },
    { item: "Marble Flooring", description: "" },
    { item: "Vinyl Flooring", description: "" },
  ],
};

const AddFloorData = ({ show, handleClose }) => {
  const [activeTab, setActiveTab] = useState("kitchen");
  const [formData, setFormData] = useState({
    kitchen: [...floorPlanData.kitchen],
    floor: [...floorPlanData.floor],
    electrical: [],
    bathroom: [],
    doors: [],
    windows: [],
    paints: [],
    security: [],
    rcc: [],
  });

  const [newItem, setNewItem] = useState({ item: "", description: "" });
  const [selectedItems, setSelectedItems] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.item && newItem.description) {
      // Update the formData state with the new item and description, adding isNew: true
      setFormData((prevState) => {
        const updatedData = { ...prevState };
        updatedData[activeTab] = [
          ...prevState[activeTab],
          { item: newItem.item, description: newItem.description, isNew: true },
        ];
        return updatedData;
      });
      // Clear the newItem state after adding the new item
      setNewItem({ item: "", description: "" });
    }
  };

  const handleDeleteItem = (index) => {
    setFormData((prevState) => {
      const updatedData = { ...prevState };
      updatedData[activeTab].splice(index, 1);
      return updatedData;
    });
  };

  const handleDescriptionChange = (index, value) => {
    const updatedData = [...formData[activeTab]];
    updatedData[index].description = value;
    setFormData({ ...formData, [activeTab]: updatedData });
  };

  const handleSave = async () => {
    const dataToSend = {
      [activeTab]: [...formData[activeTab], ...selectedItems],
    };

    try {
      const response = await axios.post("/your-api-endpoint", dataToSend);
      console.log("Data saved successfully: ", response.data);
      setSelectedItems([]);
      setFormData({
        kitchen: [],
        floor: [],
        electrical: [],
        bathroom: [],
        doors: [],
        windows: [],
        paints: [],
        security: [],
        rcc: [],
      });
      handleClose();
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const tabs = [
    "kitchen",
    "floor",
    "electrical",
    "bathroom",
    "doors",
    "windows",
    "paints",
    "security",
    "rcc",
  ];

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Insert New Value for{" "}
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
          <Nav variant="tabs" className="mb-3">
            {tabs.map((tab) => (
              <Nav.Item key={tab}>
                <Nav.Link eventKey={tab}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {tabs.map((tab) => (
              <Tab.Pane eventKey={tab} key={tab}>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {formData[tab]?.map((data, index) => (
                    <li
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div className="row col-md-12 col-lg-12 p-1">
                        <div className="col-md-2 col-lg-2">
                          <strong>{data.item}:</strong>
                        </div>
                        <div className="col-md-10 col-lg-10">
                          <Form.Control
                            type="text"
                            value={data.description}
                            placeholder={`Enter description for ${data.item}`}
                            onChange={(e) =>
                              handleDescriptionChange(index, e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {data.isNew && (
                        <span
                          role="button"
                          className="ms-2"
                          onClick={() => handleDeleteItem(index)}
                          style={{
                            cursor: "pointer",
                            color: "red",
                            marginLeft: "10px",
                          }}
                        >
                          <AiOutlineDelete size={20} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <Form
                  onSubmit={handleAddItem}
                  className="row d-flex align-items-center col-md-12 col-lg-12"
                >
                  <Form.Group
                    controlId={`${tab}Item`}
                    className="col-md-3 col-lg-3"
                  >
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="item"
                      placeholder={`Enter item for ${tab}`}
                      value={newItem.item}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group
                    controlId={`${tab}Description`}
                    className="col-md-7 col-lg-7"
                  >
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      placeholder={`Enter description for ${tab}`}
                      value={newItem.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="button"
                    size="sm"
                    className="col-md-2 col-lg-2 mt-4"
                    onClick={handleAddItem}
                  >
                    Save
                  </Button>
                </Form>
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save All
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddFloorData;
