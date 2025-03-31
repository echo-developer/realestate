import React, { useEffect, useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";
import "./OffcanvasStyle.css";

const FloorSection = ({ detailsData }) => {
    const [show, setShow] = useState(false);
    const [selectedBhk, setSelectedBhk] = useState("");
    const [selectedSqft, setSelectedSqft] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [offCanvasList, setOffCanvasList] = useState([])

    const floorObject = detailsData?.project_floor_plan;
    const bhkOptions = Object.keys(floorObject || {});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleBhkChange = (e) => {
        setSelectedBhk(e.target.value)
    }

    useEffect(() => {
        if (selectedSqft) {
            const list = floorObject?.[selectedBhk]?.list?.filter(
                (item) => item.super_area === selectedSqft
            );

            setOffCanvasList(list);
        }
    }, [selectedSqft])

    const handleSqftChange = (item) => {
        setOffCanvasList([]);
        setSelectedSqft(item);

    }

    useEffect(() => {
        if (offCanvasList?.length > 0) {
            setSelectedProperty(offCanvasList[0]);
        }
    }, [offCanvasList?.length]);

    const cards = transformData(detailsData?.project_floor_plan) || [];

    return (
        <>
            <div className="tab-content bg-white p-3 mb-4 shadow-sm rounded" id="nav-tabContent">
                <h4 className="mb-3 text-primary">Property Flooring</h4>
                <div className="row g-3">
                    {cards?.map((card, i) => (
                        <div className="col-md-6" key={i}>
                            <div
                                className="card mb-3 shadow-sm border-0 p-2 hover-effect"
                                style={{ cursor: "pointer" }}
                                onClick={handleShow}
                            >
                                <div className="row g-0">
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title mb-2">{card.title} Flat</h5>
                                            <p className="card-text text-muted">
                                                {card.min_area} Sq-ft - {card.max_area} Sq-ft
                                            </p>
                                            <p className="card-text">
                                                <span className="fw-bold">Price: </span>₹ {card.min_price} - {card.max_price}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 d-flex align-items-center">
                                        <div className="position-relative w-100">
                                            <img alt="" className="img-fluid rounded-end w-100" src={card.image_url} />
                                            <span className="position-absolute top-50 start-50 translate-middle p-2 bg-dark bg-opacity-75 text-white rounded-circle zoom-icon">
                                                🔍
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Offcanvas for Floor Plan */}
            <Offcanvas show={show} onHide={handleClose} placement="end" className="custom-offcanvas">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Property Floor Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {/* BHK Dropdown */}
                    <div className="mb-3">
                        <label className="form-label fw-bold">Select BHK</label>
                        <select
                            className="form-select"
                            onChange={handleBhkChange}
                            value={selectedBhk}
                        >
                            <option value="">Select an option</option>
                            {bhkOptions?.map((op, i) => (
                                <option key={i} value={op}>
                                    {op}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Super Area Selection */}
                    <ul className="list-unstyled d-flex gap-2 flex-wrap">
                        {floorObject?.[selectedBhk]?.super_area_arr?.map((item, i) => (
                            <li
                                key={i}
                                className={`sqft-option ${selectedSqft === item ? "selected" : ""}`}
                                onClick={() => handleSqftChange(item)}
                            >
                                {item} Sq-ft
                                {selectedSqft === item && <span className="checkmark">✔</span>}
                            </li>
                        ))}
                    </ul>

                    {/* Available Properties */}
                    <ul className="list-unstyled d-flex gap-2 flex-wrap">
                        {offCanvasList?.map((item, i) => (
                            <li
                                key={i}
                                className={`property-option ${selectedProperty === offCanvasList[i] ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedProperty(offCanvasList[i])}
                            >
                                Property {i + 1}
                                {selectedProperty === offCanvasList[i] && (
                                    <span className="checkmark">✔</span>
                                )}
                            </li>
                        ))}
                    </ul>


                    {/* Property Details */}
                    {selectedProperty && (
                        <div className="property-details card shadow-sm p-3">
                            <div className="row g-3">
                                {/* Property Image */}
                                <div className="col-md-12 text-center">
                                    <img
                                        src={selectedProperty.image_url}
                                        alt="Property"
                                        className="img-fluid rounded"
                                    />
                                </div>

                                {/* Property Information */}
                                <div className="col-md-12">
                                    <table className="table table-borderless">
                                        <tbody>
                                            {/* Bathrooms & Balconies */}
                                            <tr className="bg-light">
                                                <td>
                                                    <i className="fas fa-bath me-2"></i>
                                                    <strong>{selectedProperty.bathrooms} Bathrooms</strong>
                                                </td>
                                                <td>
                                                    <i className="fas fa-door-open me-2"></i>
                                                    <strong>{selectedProperty.balconies} Balconies</strong>
                                                </td>
                                            </tr>

                                            {/* Carpet Area */}
                                            <tr>
                                                <td className="text-muted">Carpet area</td>
                                                <td className="fw-bold">{selectedProperty.super_area} Sq-ft</td>
                                            </tr>

                                            {/* Price */}
                                            <tr className="bg-light">
                                                <td className="text-muted">Price</td>
                                                <td className="fw-bold text-primary">
                                                    Sale: ₹ {selectedProperty.expected_price}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default FloorSection;

function transformData(data) {
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
        return [];
    }

    return Object.keys(data).map((key) => {
        const item = data[key]?.list?.[0];

        return {
            title: key,
            min_price: item?.expected_price ?? "N/A",
            max_price: item?.expected_price ?? "N/A",
            image_url: item?.image_url ?? "",
            min_area: item?.super_area ?? "N/A",
            max_area: item?.super_area ?? "N/A",
        };
    });
}
