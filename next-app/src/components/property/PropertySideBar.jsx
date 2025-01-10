import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const PropertySidebar = () => {
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [showCommunicationModal, setShowCommunicationModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Create FormData instance
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);

        console.log("Form Submitted", Object.fromEntries(data));

        // Reset form fields
        setFormData({ name: "", email: "", phone: "" });
    };

    const agents = [
        {
            name: "Udaya Singh",
            agency: "Udaya Real Estate",
            rating: 4.3,
            imgSrc: "/assets/images/agents/agent-9.jpg",
        },
        {
            name: "Myra Seikh",
            agency: "Myra Real Estate",
            rating: 4.3,
            imgSrc: "/assets/images/agents/agent-12.jpg",
        },
    ];

    const countryCodes = ["IND +91", "+81", "+71", "+61", "+51"];

    return (
        <aside className="col-xl-3 col-12">
            <div className="sticky-top_ mb-4">
                <div className="sort-by mb-3">
                    <div className="rateStar me-2">
                        <i className="icon-line-awesome-star text-warning"></i>{" "}
                        <span>3.5/5</span>
                    </div>
                    <button className="btn me-2 ads-fav" title="Save for Later">
                        <i className="icon-line-awesome-heart-o"></i>
                    </button>
                    <button className="btn me-2" title="Add to Compare">
                        <i className="icon-img-compare m-0"></i>
                    </button>
                    <button className="btn me-2" title="Report this Ad">
                        <i className="icon-feather-flag"></i>
                    </button>
                    <button className="btn me-2" title="Print">
                        <i className="icon-feather-printer"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-primary w-auto">
                        <i className="icon-feather-share-2"></i> Share
                    </button>
                </div>

                <div className="card border-0 shadow-1 mb-3 text-center">
                    <div className="card-body">
                        <div className="mb-3">
                            <img
                                src="/assets/images/agents/agent-6.jpg"
                                alt="Agent image"
                                height="84"
                                width="84"
                                className="rounded-circle"
                            />
                        </div>
                        <h5>
                            Sunil{" "}
                            <span>
                                {showPhoneNumber
                                    ? "+91 9876543210"
                                    : "+91 26********"}
                            </span>
                        </h5>
                        <div className="d-grid">
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    setShowPhoneNumber(!showPhoneNumber)
                                }
                            >
                                {showPhoneNumber
                                    ? "Hide Phone Number"
                                    : "Get Phone Number"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
                    <h4 className="mb-0">Download Brochure</h4>
                    <a href="">
                        <img
                            src="/assets/images/icons/brochure.png"
                            alt="Download Brochure"
                            height="32"
                        />
                    </a>
                </div>

                <div class="card border-0 shadow-1 mb-4">
                    <div class="card-body">
                        <div class="user-profile align-items-center">
                            <div class="mb-3">
                                <img
                                    alt="Agent image"
                                    height="84"
                                    width="84"
                                    class="rounded-circle"
                                    src="/assets/images/agents/agent-2.jpg"
                                />
                            </div>
                            <div>
                                <h4>
                                    Millan Mathew
                                    <i
                                        class="icon-img-check ms-2"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        aria-label="Certified Agent"
                                        data-bs-original-title="Certified Agent"
                                    ></i>
                                </h4>
                                <p class="mb-0">
                                    <i>400+ Buyer served</i>
                                </p>
                                <div class="star-rating" data-rating="3.5">
                                    <span class="star"></span>
                                    <span class="star"></span>
                                    <span class="star"></span>
                                    <span class="star half"></span>
                                    <span class="star empty"></span>
                                </div>
                                <p class="text-muted">Real Estate Agent</p>
                                <p>
                                    <i class="icon-feather-map-pin text-site"></i>
                                    A.C Sarkar Road, Ariadaha, PS Belghoria,
                                    Dakshineswar, Kolkata - North 24 Parganas
                                    District, West Bengal
                                </p>
                                <ul class="p-0">
                                    <li class="d-flex justify-content-between mb-1">
                                        <span class="text-muted">
                                            Operating Since:
                                        </span>
                                        <span>2010</span>
                                    </li>
                                    <li class="d-flex justify-content-between mb-1">
                                        <span class="text-muted">
                                            Properties For Sale:
                                        </span>
                                        <span>320</span>
                                    </li>
                                    <li class="d-flex justify-content-between">
                                        <span class="text-muted">
                                            Properties For Rent:
                                        </span>
                                        <span>150</span>
                                    </li>
                                </ul>
                                <div class="d-grid">
                                    <button class="btn btn-primary">
                                        Contact Agent
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-1 mb-4">
                    <div className="card-body">
                        <h4 className="mb-3 text-primary">
                            Top Agents In This Locality
                        </h4>
                        {agents.map((agent, index) => (
                            <div
                                className="d-flex align-items-center mb-3"
                                key={index}
                            >
                                <img
                                    src={agent.imgSrc}
                                    alt="Agent image"
                                    height="64"
                                    width="64"
                                    className="rounded-circle"
                                />
                                <div className="flex-grow-1 ps-3">
                                    <h5 className="mb-0">
                                        <a href="">{agent.name}</a>{" "}
                                        <i
                                            className="icon-img-check ms-2"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            aria-label="Certified Agent"
                                            data-bs-original-title="Certified Agent"
                                        ></i>
                                    </h5>
                                    <p className="mb-0 text-muted">
                                        {agent.agency}
                                    </p>
                                    <p className="mb-2">
                                        <i className="icon-line-awesome-star text-warning"></i>{" "}
                                        <span className="text-muted">
                                            {agent.rating} Rating
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))}
                        <a href="">
                            View All Agents{" "}
                            <i className="bi bi-arrow-right"></i>
                        </a>
                    </div>
                </div>

                <div className="card border-0 shadow-1 mb-4">
                    <div className="card-body">
                        <h4 className="mb-3 text-primary">
                            Looking For A Property
                        </h4>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder=" "
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="">Name</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="name@example.com"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="">Email address</label>
                            </div>
                            <div className="input-group mb-3">
                                <select
                                    className="btn-group bootstrap-select input-group-btn fit-width"
                                    defaultValue="IND +91"
                                >
                                    {countryCodes.map((code, index) => (
                                        <option key={index} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </select>
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder=" "
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <label htmlFor="phone">Phone Number</label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Modal
                show={showCommunicationModal}
                onHide={() => setShowCommunicationModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Communication</Modal.Title>
                </Modal.Header>
                <Modal.Body>{/* Add your modal content here */}</Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowCommunicationModal(false)}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </aside>
    );
};

export default PropertySidebar;
