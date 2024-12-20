import { useState, useEffect } from "react";
import CommercialType from "@/components/property/CommercialType";
import ResidentialType from "@/components/property/ResidentialType";

const PropertyPage = () => {
    const [PropertyData, setPropertyData] = useState();
    const [selectedOption, setSelectedOption] = useState("Sort By");
    const [currentPage, setCurrentPage] = useState(1);

    const handleSortSelection = (event) => {
        setSelectedOption(event.target.innerText);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        FetchPropertyData;
    }, []);

    const FetchPropertyData = async () => {
        setLoading(true);
        try {
            const response = await callApi({
                api: `/my_property_list?user_id=${11}`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setPropertyData(response.data);
            } else {
                toast.error(response.message || "Failed to fetch properties");
            }
        } catch (error) {
            console.error("API call failed:", error);
            toast.error("An error occurred while loading data.");
        } finally {
            setLoading(false);
        }
    };

    console.log(PropertyData);

    return (
        <section className="section">
            <div className="container-fluid">
                <div className="row main-row">
                    <aside className="col-xl-9 col-lg-9 col-12">
                        <div className="d-sm-flex justify-content-between align-items-center mb-2">
                            <h4 className="mb-3 mb-sm-0">
                                Total{" "}
                                <span className="text-primary">
                                    {PropertyData?.totalRecords}{" "}
                                </span>{" "}
                                Properties Found
                            </h4>
                            <div className="sort-by">
                                <button className="btn me-2 btn-list active">
                                    <i className="icon-feather-list"></i>
                                </button>
                                <button className="btn me-2 btn-grid">
                                    <i className="icon-feather-grid"></i>
                                </button>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-light dropdown-toggle w-100"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {selectedOption}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                value="recent"
                                                onClick={handleSortSelection}
                                            >
                                                Recent
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                value="low-to-high"
                                                onClick={handleSortSelection}
                                            >
                                                Price - Low to High
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                value="high-to-low"
                                                onClick={handleSortSelection}
                                            >
                                                Price - High to Low
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                value="low-high"
                                                onClick={handleSortSelection}
                                            >
                                                size/sqft - Low to High
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                value="high-low"
                                                onClick={handleSortSelection}
                                            >
                                                size/sqft - High to Low
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <ResidentialType
                                        key={index}
                                        property={property}
                                    />

                        {PropertyData?.data.map((property, index) => {
                            if (
                                property.property_for === "sell" &&
                                property.property_type === "Commercial"
                            ) {
                                return (
                                    <CommercialType
                                        key={index}
                                        property={property}
                                    />
                                );
                            }
                            if (
                                property.property_for === "sell" &&
                                property.property_type === "Residential"
                            ) {
                                return (
                                    <ResidentialType
                                        key={index}
                                        property={property}
                                    />
                                );
                            }
                            if (
                                property.property_for === "rent" &&
                                property.property_type === "Commercial"
                            ) {
                                return (
                                    <CommercialType
                                        key={index}
                                        property={property}
                                    />
                                );
                            }
                            if (
                                property.property_for === "rent" &&
                                property.property_type === "Residential"
                            ) {
                                return (
                                    <ResidentialType
                                        key={index}
                                        property={property}
                                    />
                                );
                            }
                            return null;
                        })}

                      
                    </aside>

                    {/* Advertisement Section */}
                    <aside className="col-xl-3 col-lg-3 col-12">
                        {/* Ads logic */}
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default PropertyPage;
