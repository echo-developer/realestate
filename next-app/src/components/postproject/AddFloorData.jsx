import { useEffect, useState } from "react";
import { Modal, Button, Form, Tab, Nav } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const AddFloorData = ({ show, handleClose, propId }) => {
  const { callApi } = AuthUser();
  const [activeTab, setActiveTab] = useState("kitchen");
  const [formData, setFormData] = useState({});
  const [newItem, setNewItem] = useState({ item: "", description: "" });
  const [floorData, setFloorData] = useState({ floor_plan_types: [], floor_plans: [] });

  useEffect(() => {
    if (propId) {
      fetchFloorData();
    }
  }, [propId]);

  const fetchFloorData = async () => {
    try {
      const response = await callApi({
        api: `/get_floor_plan_type`,
        method: "GET",
        data: { project_id: propId },
      });

      if (response && response.status === 1) {
        const { floor_plan_types, floor_plans } = response.data;

        // Map floor plans to their respective tabs by type_id
        const initialData = {};
        floor_plan_types.forEach((tab) => {
          initialData[tab.slug] = {
            id: tab.id,
            items: floor_plans
              .filter((plan) => plan.type_id === tab.id)
              .map((plan) => ({
                item_id: plan.item_id,
                item: plan.item,
                description: "",
                isNew: false,
              })),
          };
        });

        setFloorData(response.data);
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error fetching floor data:", error);
    }
  };

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
      setFormData((prevState) => {
        const updatedData = { ...prevState };
        updatedData[activeTab] = {
          ...updatedData[activeTab],
          items: [
            ...(prevState[activeTab]?.items || []),
            { item: newItem.item, description: newItem.description, isNew: true },
          ],
        };
        return updatedData;
      });
      setNewItem({ item: "", description: "" });
    }
  };

  const handleDeleteItem = (index) => {
    setFormData((prevState) => {
      const updatedData = { ...prevState };
      updatedData[activeTab].items.splice(index, 1);
      return updatedData;
    });
  };

  const handleDescriptionChange = (index, value) => {
    setFormData((prevState) => {
      const updatedItems = [...(prevState[activeTab]?.items || [])];
      updatedItems[index].description = value;

      return {
        ...prevState,
        [activeTab]: {
          ...prevState[activeTab],
          items: updatedItems,
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      const dataToSend = [];
  
      Object.keys(formData).forEach((tabSlug) => {
        if (formData[tabSlug]?.items?.length > 0) {
          const tabId = formData[tabSlug].id;
          const items = formData[tabSlug].items.map((item, index) => ({
            id: item.item_id,
            item: item.item,
            description: item.description,
            type_id: tabId,
          }));
  
          dataToSend.push(...items);
        }
      });
  
      const response = await callApi({
        api: `/save_floor_data`,
        method: "POST",
        data: {
          floor_data: JSON.stringify(dataToSend),
          project_id: propId,
        },
      });
  
      if (response && response.status === 1) {
        toast.success("Data saved successfully!");
        handleClose();
      } else {
        toast.error(response.message || "Failed to save data");
      }
    } catch (error) {
      console.error("Error saving data: ", error);
      toast.error("Error saving data");
    }
  };
  

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Insert New Value for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
          <Nav variant="tabs" className="mb-3">
            {floorData.floor_plan_types?.map((tab) => (
              <Nav.Item key={tab.id}>
                <Nav.Link eventKey={tab.slug}>{tab.name}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {floorData.floor_plan_types?.map((tab) => (
              <Tab.Pane eventKey={tab.slug} key={tab.id}>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {formData[tab.slug]?.items?.map((data, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      <div className="row col-md-12 col-lg-12 p-1">
                        <div className="col-md-2 col-lg-2">
                          <strong>{data.item}:</strong>
                        </div>
                        <div className="col-md-10 col-lg-10">
                          <Form.Control
                            type="text"
                            value={data.description}
                            placeholder={`Enter description for ${data.item}`}
                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          />
                        </div>
                      </div>
                      {data.isNew && (
                        <span
                          role="button"
                          className="ms-2"
                          onClick={() => handleDeleteItem(index)}
                          style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                        >
                          <AiOutlineDelete size={20} />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <Form onSubmit={handleAddItem} className="row d-flex align-items-center col-md-12 col-lg-12">
                  <Form.Group controlId={`${tab.slug}Item`} className="col-md-3 col-lg-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="item"
                      placeholder={`Enter item for ${tab.name}`}
                      value={newItem.item}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group controlId={`${tab.slug}Description`} className="col-md-7 col-lg-7">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      name="description"
                      placeholder={`Enter description for ${tab.name}`}
                      value={newItem.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" size="sm" className="col-md-2 col-lg-2 mt-4">
                    Add
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
