"use client";
import React, { useEffect, useState } from "react";
import ResidentialType from "@/components/property/ResidentialType";
import MainLayout from "@/components/layout/MainLayout";
import SearchForm from "@/components/SearchCategory/SearchForm";
import AuthUser from "@/components/Authentication/AuthUser";
import { useSearchParams } from "next/navigation";
import CommercialType from "@/components/property/CommercialType";

const Index = () => {
    const { callApi } = AuthUser();
    const [selectedOption, setSelectedOption] = useState("Sort By");
    const [propertyListData, setPropertyListData] = useState([]);
    const searchParams = useSearchParams();

    const PostFor = searchParams.get("post_for");
    const propertyType = searchParams.get("property_type");
    const propertyFor = searchParams.get("property_for");
    const bedrooms = searchParams.get("bedrooms");
    const parking = searchParams.get("parking");
    const cityName = searchParams.get("city_id");
    const Budget = searchParams.get("property_budget");
    const Size = searchParams.get("property_size");

    const handleSortSelection = (event) => {
        setSelectedOption(event.target.innerText);
    };

    const FetchPropertyListData = async () => {
        let params = {
            post_for: PostFor || "rent",
        };

        if (propertyType) params.property_type = propertyType;
        if (propertyFor) params.property_for = propertyFor;
        if (bedrooms) params.bedrooms = bedrooms;
        if (parking) params.parking = parking;
        if (cityName) params.city_id = cityName;
        if (Budget) params.property_budget = Budget;
        if (Size) params.property_size = Size;

        try {
            const response = await callApi({
                api: "/get_search_result",
                method: "GET",
                data: params,
            });

            if (response && response.status === "success") {
                setPropertyListData(response?.data?.searched_properties || []);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    useEffect(() => {
        if (PostFor) {
            FetchPropertyListData();
        }
    }, [
        PostFor,
        propertyType,
        propertyFor,
        bedrooms,
        parking,
        cityName,
        Budget,
        Size,
    ]);

    const noRecordsStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "300px",
        textAlign: "center",
    };
    

    return (
        <MainLayout>
            <React.Fragment>
                <div className="clearfix"></div>
                <div className="short-banner" style={{ minHeight: "120px" }}>
                    <SearchForm
                        cityName={cityName}
                        propertyType={propertyType}
                        propertyFor={propertyFor}
                        postFor={PostFor}
                    />
                </div>
                <section className="section">
                    <div className="container-fluid">
                        <div className="row main-row">
                            <aside className="col-xl-9 col-lg-9 col-12">
                                <div className="d-sm-flex justify-content-between align-items-center mb-2">
                                    <h4 className="mb-3 mb-sm-0">
                                        Total{" "}
                                        <span className="text-primary">
                                            {propertyListData.length}
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
                                                        onClick={
                                                            handleSortSelection
                                                        }
                                                    >
                                                        Recent
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        onClick={
                                                            handleSortSelection
                                                        }
                                                    >
                                                        Price - Low to High
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        onClick={
                                                            handleSortSelection
                                                        }
                                                    >
                                                        Price - High to Low
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        onClick={
                                                            handleSortSelection
                                                        }
                                                    >
                                                        size/sqft - Low to High
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className="dropdown-item"
                                                        onClick={
                                                            handleSortSelection
                                                        }
                                                    >
                                                        size/sqft - High to Low
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Conditionally render the property list or "No records found" message */}
                                {propertyListData.length > 0 ? (
                                    <>
                                        {propertyType === 1 ? (
                                            <ResidentialType
                                                propertyListData={
                                                    propertyListData
                                                }
                                                FetchPropertyListData={FetchPropertyListData}
                                            />
                                        ) : propertyType === 2 ? (
                                            <CommercialType
                                                propertyListData={
                                                    propertyListData
                                                }
                                                FetchPropertyListData={FetchPropertyListData}
                                            />
                                        ) : (
                                            <ResidentialType
                                                propertyListData={
                                                    propertyListData
                                                }
                                                FetchPropertyListData={FetchPropertyListData}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div style={noRecordsStyle}>
                                        <h2>No Records Found</h2>
                                    </div>
                                )}
                            </aside>

                            {/* Advertisement Section */}
                            <aside className="col-xl-3 col-lg-3 col-12 mr-2">
                                <img
                                    src="/assets/images/ads/real-estate-poster.jpg"
                                    alt="Advertisement"
                                />
                            </aside>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        </MainLayout>
    );
};

export default Index;
