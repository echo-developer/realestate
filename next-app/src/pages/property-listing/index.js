"use client";
import React ,{ useEffect, useState } from "react";
import ResidentialType from "@/components/property/ResidentialType";
import MainLayout from "@/components/layout/MainLayout";
import SearchForm from "@/components/SearchCategory/SearchForm";
import AuthUser from "@/components/Authentication/AuthUser";

const Index = () => {
    const {callApi}=AuthUser();
    const [selectedOption, setSelectedOption] = useState("Sort By");
    const [propertyListData, setPropertyListData] = useState();

    const handleSortSelection = (event) => {
        setSelectedOption(event.target.innerText);
    };

    useEffect(()=>{
        FetchPropertyLsitData();
    },[])

    const FetchPropertyLsitData=async()=>{
        let response;
        try {
            response = await callApi({
                api:`/get_search_result`,
                method:'GET',
                data:{
                    post_for:'rent'
                }
            })
            if(response && response.status==="success"){
                console.log(response?.data?.searched_properties)
                setPropertyListData(response?.data?.searched_properties)
            }
        } catch (error) {
            
        }
    }

    return (
        <MainLayout>
            <React.Fragment>
                <div className="clearfix"></div>
                <div className="short-banner " style={{ minHeight: "120px" }}>
                    <SearchForm/>
                </div>
                <section className="section">
                    <div className="container-fluid">
                        <div className="row main-row">
                            <aside className="col-xl-9 col-lg-9 col-12">
                                <div className="d-sm-flex justify-content-between align-items-center mb-2">
                                    <h4 className="mb-3 mb-sm-0">
                                        Total{" "}
                                        <span className="text-primary">4</span>{" "}
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

                                <ResidentialType propertyListData={propertyListData}/>
                            </aside>

                            {/* Advertisement Section */}
                            <aside className="col-xl-3 col-lg-3 col-12 mr-2">
                                <img src="/assets/images/ads/real-estate-poster.jpg" />
                            </aside>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        </MainLayout>
    );
};

export default Index;
