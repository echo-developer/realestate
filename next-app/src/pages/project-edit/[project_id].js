import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import '../property-edit/property_edit.css'
import {
    Project_image,
    parkingOptions,
    facingOptions,
    flooringOptions,
    waterAvailabilityOptions,
    electricityStatusOptions,
    projectApprovedByOptions,
    ownershipTypeOptions,
    projectFeatures,
} from "@/components/post/PropertyData";
import AuthUser from "@/components/Authentication/AuthUser";
import ConfigurationComponent from "@/components/property/ConfigurationComponent";
// import EditLandmarkData from "@/components/property/EditLandmarkData";
import EditLandmarkData from "@/components/project/EditLandmarkData"
import StatusModal from "@/components/property/StatusModal";
import EditFloorDetails from "@/components/property/EditFloorDetails";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
// import EditImageGallery from "@/components/property/EditImageGallery";
import EditImageGallery from "@/components/project/EditImageGalary";

const Index = () => {
    const router = useRouter();
    const { callApi } = AuthUser();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("");
    const [activeTab, setActiveTab] = useState("");
    const [tabData, setTabData] = useState({});
    const [options, setOptions] = useState();

    const { project_id } = router.query;
    const [projectData, setProjectData] = useState();

    const [inputValue, setInputValue] = useState({
        buyer_message: "",
        address: "",
        locality: "",
        project_name: "",
        occupied_area: "",
        total_area: "",
        project_furnish: "",
        car_parking: "",
        possession_status: "",
        facing_direction: "",
        water_available: "",
        electric_available: "",
        ownership_type: "",
    });
    const [possessionList, setPossessionList] = useState([]);
    const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);

    useEffect(() => {
        if (project_id) FetchProjectData(project_id);
    }, [project_id]);

    console.log("project id", project_id)

    const FetchProjectData = async (project_id) => {
        let response;
        try {
            response = await callApi({
                api: `/edit-project`,
                method: "GET",
                data: {
                    project_id: project_id,
                },
            });
            if (response && response.status === 1) {
                setProjectData(response.data);
                setOptions(response.options);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
    };

    useEffect(() => {
        if (projectData) {
            setInputValue({
                buyer_message: projectData?.buyer_message || "",
                address: projectData?.address || "",
                locality: projectData?.locality || "",
                project_name: projectData?.project_name || "",
                occupied_area: projectData?.occupied_area || "",
                total_area: projectData?.total_area || "",
                project_furnish: projectData?.project_furnish || "",
                car_parking: projectData?.car_parking || "",
                possession_status: projectData?.possession_status || "",
                facing_direction: projectData?.facing_direction || "",
                water_available: projectData?.water_available || "",
                electric_available: projectData?.electric_available || "",
                ownership_type: projectData?.ownership_type || "",
            });
        }
    }, [projectData]);

    const openModal = (item) => {
        if (item?.key === "possession_status") {
            const getList = async () => {
                setDynamicFieldLoading(true);
                try {
                    const args = {
                        api: "/get_property_status",
                        method: "GET"
                    }

                    const res = await callApi(args);
                    if (res && res?.status === 1) {
                        setPossessionList(res?.data);
                    }
                } catch (error) {
                    console.log(error?.message || "Something went wrong")
                } finally {
                    setDynamicFieldLoading(false);
                }
            }
            getList();
        }
        setSelectedItem(item.key);
        setInputValue((prevState) => ({
            ...prevState,
            [item.key]: projectData[item.key] || "",
        }));
        setModalIsOpen(true);
    };


    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedItem("");
        setActiveTab("");
    };

    const handleAreaChange = (e, field) => {
        setInputValue((prevState) => ({
            ...prevState,
            [field]: e.target.value,
        }));
    };


    const handleSave = async () => {

        const fd = new FormData();
        const formData = {
            [selectedItem]: inputValue[selectedItem],
        };

        if (inputValue.occupied_area) {
            formData.occupied_area = inputValue.occupied_area;
        }

        if (inputValue.total_area) {
            formData.total_area = inputValue.total_area;
        }
        // Ensure galleries include the tabData
        if (selectedItem === "galleries" && tabData) {
            const updatedGalleries = {
                ...(inputValue.galleries || {}), // Existing gallery data
                tabData, // Append tabData
            };
            formData.galleries = updatedGalleries;
        }

        // Append the formData to FormData object
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                fd.append(key, JSON.stringify(value));
            } else {
                fd.append(key, value);
            }
        });

        // Add project_id to the FormData
        fd.append("project_id", project_id);

        try {
            const response = await callApi({
                api: "/update_project",
                method: "POST",
                data: fd,
            });

            // Handle success
            closeModal();
            FetchProjectData(project_id);
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const items = [
        { id: 1, key: "project_price", name: "Price" },
        { id: 2, key: "instruction", name: "Message to Buyer" },
        { id: 3, key: "address", name: "Address" },
        { id: 4, key: "locality", name: "Locality" },
        { id: 5, key: "project_name", name: "Project or Society Name" },
        // { id: 6, key: "configuration", name: "Configuration" },
        { id: 7, key: "area", name: "Area" },
        { id: 8, key: "possession_status", name: "Possession Status" },
        { id: 9, key: "project_furnish", name: "Furnished" },
        { id: 10, key: "car_parking", name: "Car Parking" },
        { id: 11, key: "facing_direction", name: "Facing" },
        { id: 12, key: "overlooking", name: "OverLooking" },
        { id: 13, key: "flooring", name: "Flooring" },
        { id: 14, key: "floor_details", name: "Floor & Unit Details" },
        { id: 15, key: "water_available", name: "Water Availability" },
        { id: 16, key: "electric_available", name: "Status of Electricity" },
        { id: 17, key: "project_approved", name: "Approved By" },
        { id: 18, key: "ownership_type", name: "Type of Ownership" },
        { id: 19, key: "landmarks", name: "Landmark" },
        { id: 20, key: "galleries", name: "Gallery" },
    ];

    const renderModalContent = () => {
        switch (selectedItem) {
            case "buyer_message":
            case "locality":
            case "project_name":
                return (
                    <>
                        <label>Enter the value for {selectedItem}:</label>
                        <input
                            type="text"
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prev) => ({
                                    ...prev,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            placeholder={`Edit ${selectedItem}`}
                            className="modal-input"
                        />
                    </>
                );
            case "project_price":
                return (
                    <>
                        <label>Select Project Budget:</label>
                        {/* <select
                            value={
                                inputValue.project_price ||
                                projectData?.budget_id ||
                                ""
                            }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    project_price: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            {options?.all_budget?.map((budget) => (
                                <option
                                    key={budget.budget_id}
                                    value={budget.budget_id}
                                >
                                    ₹{budget.min_budget} - ₹{budget.max_budget}
                                </option>
                            ))}
                        </select> */}
                        <input type="text" value={
                            inputValue.project_price ||
                            projectData?.budget_id ||
                            ""
                        }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    project_price: e.target.value,
                                }))
                            } />
                    </>
                );
            case "address":
                return (
                    <>
                        <label htmlFor="address-input">
                            Enter the address:
                        </label>
                        <textarea
                            id="address-input"
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prev) => ({
                                    ...prev,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            placeholder="Enter the address here"
                            className="modal-textarea"
                            rows={4}
                        />
                    </>
                );
            case "configuration":
                return (
                    <ConfigurationComponent
                        projectType="Apartment"
                        value={inputValue[selectedItem] || ""}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                        projectData={projectData}
                    />
                );

            case "possession_status":
                return (
                    <StatusModal
                        value={inputValue[selectedItem] || ""}
                        projectData={projectData}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                        list={possessionList}
                    />
                );
            case "project_furnish":
                return (
                    <>
                        <label>Select Furnishing Type:</label>
                        <select
                            value={
                                inputValue.project_furnish ||
                                projectData?.project_furnish?.furnish_id ||
                                ""
                            }
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    project_furnish: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            {options?.all_furnish?.map((furnish) => (
                                <option
                                    key={furnish.furnish_id}
                                    value={furnish.furnish_id}
                                >
                                    {furnish.furnish_name}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "car_parking":
                return (
                    <>
                        <label>Select Your Parking Availability:</label>
                        <select
                            value={inputValue.car_parking || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    car_parking: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select Parking Type</option>
                            {parkingOptions.map((parking) => (
                                <option key={parking.key} value={parking.key}>
                                    {parking.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "galleries":
                return (
                    <EditImageGallery
                        flatImageTab={Project_image}
                        inputValue={inputValue}
                        selectedItem={activeTab}
                        projectData={projectData}
                        projectId={project_id}
                        setProjectData={setProjectData}
                    />
                );
            case "area":
                return (
                    <>
                        <label>Enter the Occupied Area:</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={inputValue.occupied_area || ""}
                                onChange={(e) =>
                                    handleAreaChange(e, "occupied_area")
                                }
                                placeholder="Carpet Area"
                                className="modal-input"
                            />
                            <span className="input-group-addon">sqft</span>
                        </div>

                        <label>Enter the Total Area:</label>
                        <div className="input-group">
                            <input
                                type="number"
                                value={inputValue.total_area || ""}
                                onChange={(e) =>
                                    handleAreaChange(e, "total_area")
                                }
                                placeholder="Super Area"
                                className="modal-input"
                            />
                            <span className="input-group-addon">sqft</span>
                        </div>
                    </>
                );
            case "facing_direction":
                return (
                    <>
                        <label>Select Facing Area :</label>
                        <select
                            value={inputValue.facing_direction || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    facing_direction: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="">Select...</option>
                            {facingOptions.map((facingType) => (
                                <option
                                    key={facingType.key}
                                    value={facingType.key}
                                >
                                    {facingType.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "overlooking":
                return (
                    <>
                        <label>Select Overlooking Features:</label>
                        <div className="checkbox-group">
                            {projectFeatures?.map((item) => (
                                <label key={item?.key}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            inputValue?.[selectedItem]?.includes(item?.key) || false
                                        }
                                        onChange={(e) =>
                                            setInputValue((prevState) => ({
                                                ...prevState,
                                                [selectedItem]: e.target.checked
                                                    ? [
                                                        ...(prevState?.[selectedItem] || []),
                                                        item?.key,
                                                    ]
                                                    : (prevState?.[selectedItem] || []).filter(
                                                        (key) => key !== item?.key
                                                    ),
                                            }))
                                        }
                                    />
                                    {item?.value}
                                </label>
                            ))}

                        </div>
                    </>
                );

            case "flooring":
                return (
                    <>
                        <label>Select Flooring Types:</label>
                        <div className="checkbox-group">
                            {flooringOptions.map((flooring) => (
                                <label key={flooring.key}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            inputValue[selectedItem]?.includes(
                                                flooring.key
                                            ) || false
                                        }
                                        onChange={(e) => {
                                            setInputValue((prevState) => {
                                                const selectedKeys =
                                                    prevState[selectedItem] ||
                                                    [];

                                                if (e.target.checked) {
                                                    // Add the key to the list of selected flooring types
                                                    return {
                                                        ...prevState,
                                                        [selectedItem]: [
                                                            ...selectedKeys,
                                                            flooring.key,
                                                        ],
                                                    };
                                                } else {
                                                    // Remove the key from the list of selected flooring types
                                                    return {
                                                        ...prevState,
                                                        [selectedItem]:
                                                            selectedKeys.filter(
                                                                (key) =>
                                                                    key !==
                                                                    flooring.key
                                                            ),
                                                    };
                                                }
                                            });
                                        }}
                                    />
                                    {flooring.value}
                                </label>
                            ))}
                        </div>
                    </>
                );

            case "water_available":
                return (
                    <>
                        <label>Select Water Availability:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Water Availability
                            </option>
                            {waterAvailabilityOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "electric_available":
                return (
                    <>
                        <label>Select Electricity Status:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Electricity Status
                            </option>
                            {electricityStatusOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "ownership_type":
                return (
                    <>
                        <label>Select Ownership Type:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Ownership Type
                            </option>
                            {ownershipTypeOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );

            case "project_approved":
                return (
                    <>
                        <label>Approved By:</label>
                        <select
                            value={inputValue[selectedItem] || ""}
                            onChange={(e) =>
                                setInputValue((prevState) => ({
                                    ...prevState,
                                    [selectedItem]: e.target.value,
                                }))
                            }
                            className="modal-input"
                        >
                            <option value="" disabled>
                                Select Anyone
                            </option>
                            {projectApprovedByOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.value}
                                </option>
                            ))}
                        </select>
                    </>
                );
            case "floor_details":
                return (
                    <EditFloorDetails
                        projectData={projectData}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                    />
                );

            case "landmarks":
                return (
                    <EditLandmarkData
                        value={inputValue[selectedItem] || ""}
                        onChange={(newValue) =>
                            setInputValue((prev) => ({
                                ...prev,
                                [selectedItem]: newValue,
                            }))
                        }
                        projectData={projectData}
                    />
                );
            default:
                return null;
        }
    };

    if (!projectData) {
        return <div hidden>No project data available</div>;
    }

    return (
        <MainLayout>
            <div className="p-4">
                <h3>Edit & Preview Your Project Ad</h3>
                <p>
                    Modify your ad by clicking the appropriate Edit or Add link.
                    Changes may take up to 24 hours to appear online.
                </p>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="list-container">
                        <ul style={{ listStyleType: "none" }}>
                            {items.map((item, index) => (
                                <li key={index} className="list-item">
                                    {item.name}
                                    <span
                                        className="edit-option"
                                        onClick={() => openModal(item)}
                                    >
                                        Edit
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {console.log("selected item", selectedItem)}
            {/* Modal for editing */}
            <Modal
                show={modalIsOpen}
                onHide={closeModal}
                size={
                    selectedItem === "galleries" || selectedItem === "landmarks"
                        ? "lg"
                        : ""
                }
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit {selectedItem}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{renderModalContent()}</Modal.Body>
                {selectedItem !== "galleries" ? (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>

                        <Button variant="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Modal.Footer>
                ) : (
                    ""
                )}
            </Modal>
        </MainLayout>
    );
};

export default Index;
