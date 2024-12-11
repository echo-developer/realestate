"use client"
import React, { useEffect ,useState } from "react";
import AuthUser from "../Authentication/AuthUser";

const Step2Form = ({
    formData,
    setFormData,
    handleChange,
    nextStep,
    prevStep,
}) => {
    const { callApi } = AuthUser();
    const [propertyTypeData, setPropertyTypeData] = useState([]);

    useEffect(() => {
        FetchPropertyTypeData();
    }, []);

    const FetchPropertyTypeData = async () => {
        try {
            const response = await callApi({
                api: `/get_property_type`,
                method: "GET",
            });
            if (response && response.success === 1) {
                setPropertyTypeData(response.data);
            }
        } catch (error) {}
    };

    console.log(propertyTypeData);

    const handleIncrement = () => {
        setFormData({ ...formData, totalFlats: formData.totalFlats + 1 });
    };

    const handleDecrement = () => {
        if (formData.totalFlats > 1) {
            setFormData({ ...formData, totalFlats: formData.totalFlats - 1 });
        }
    };

    return (
        <div id="step-2">
            <label className="form-label">You are here to</label>
            <div className="btn-group btn-group-light d-flex mb-3" role="group">
                <input
                    type="radio"
                    className="btn-check"
                    name="postFor"
                    id="btnradio1"
                    checked={formData.postFor === "rent"}
                    onChange={handleChange}
                    value="rent"
                />
                <label className="btn btn-outline-light" htmlFor="btnradio1">
                    <img
                        src="/assets/images/icons/rent-3.png"
                        alt="Icon"
                        height="24"
                        width="24"
                    />{" "}
                    Rent
                </label>
                <input
                    type="radio"
                    className="btn-check"
                    name="postFor"
                    id="btnradio2"
                    checked={formData.postFor === "sale"}
                    onChange={handleChange}
                    value="sale"
                />
                <label className="btn btn-outline-light" htmlFor="btnradio2">
                    <img
                        src="/assets/images/icons/sale-2.png"
                        alt="Icon"
                        height="24"
                        width="24"
                    />{" "}
                    Sale
                </label>
                <input
                    type="radio"
                    className="btn-check"
                    name="postFor"
                    id="btnradio3"
                    checked={formData.postFor === "pg"}
                    onChange={handleChange}
                    value="pg"
                />
                <label className="btn btn-outline-light" htmlFor="btnradio3">
                    <img
                        src="/assets/images/icons/hostel.png"
                        alt="Icon"
                        height="24"
                        width="24"
                    />{" "}
                    PG/Hostel
                </label>
            </div>

            <label className="form-label">Property Type</label>
            <div className="btn-group btn-group-light d-flex mb-3" role="group">
                {propertyTypeData?.map(
                    (type, index) => (
                        <React.Fragment key={`p_id_${type}`}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="propertyType"
                                id={`property_${index + 1}`}
                                checked={formData.propertyType === type}
                                onChange={handleChange}
                                value={type}
                            />
                            <label
                                className="btn btn-outline-light"
                                htmlFor={`property_${index + 1}`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                                {/* Capitalize the first letter */}
                            </label>
                        </React.Fragment>
                    )
                )}
            </div>

            <label className="form-label">
                Total No. Of Flats In Your Society
            </label>
            <div className="cart-plus-minus mb-4">
                <input
                    type="text"
                    className="form-control"
                    value={formData.totalFlats}
                    readOnly
                />
                <div className="minus qtybutton" onClick={handleDecrement}>
                    <i className="icon-line-awesome-minus"></i>
                </div>
                <div className="plus qtybutton" onClick={handleIncrement}>
                    <i className="icon-line-awesome-plus"></i>
                </div>
            </div>

            <div className="d-grid columns-2">
                <button
                    type="button"
                    className="btn btn-secondary btn-back-2"
                    onClick={prevStep}
                >
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-next-2"
                    onClick={nextStep}
                >
                    Next <i className="bi bi-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

export default Step2Form;
