import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SideBar from "@/components/sidebar/SideBar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const Index = () => {
    const {callApi ,GetMemberId}=AuthUser();
    const [enquiryList,setEnquiryList]=useState([])

    const memberId = GetMemberId();

    useEffect(()=>{
        FetchEnquiryList(memberId);
    },[memberId])


    const FetchEnquiryList=async(memberId)=>{
        let response;
        try {
            response = await callApi({
            api:`/my_fav_property_list`,
            method:'GET',
            data:{
                user_id:memberId
            }
            })
            if(response && response.status===1){
                setEnquiryList(response.data)
            }else{
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(response.message)
        }
    }

    console.log(favList)

    const listings = [
        {
            id: 1,
            title: "Sample Listing Title 1",
            location: "Sample Location 1",
            thumbnail: "assets/images/uploads/property-1.jpg",
            agents: ["assets/images/agents/agent-1.jpg", "images/agents/agent-2.jpg"],
            queryCount: 24,
            type: "For Rent",
            price: "AED4900.00/Year",
            date: "22 April, 2022",
        },
        {
            id: 2,
            title: "Sample Listing Title 2",
            location: "Sample Location 2",
            thumbnail: "assets/images/uploads/property-2.jpg",
            agents: ["assets/images/agents/agent-3.jpg", "images/agents/agent-4.jpg"],
            queryCount: 30,
            type: "For Sale",
            price: "AED7500.00/Year",
            date: "15 March, 2022",
        },
        {
            id: 3,
            title: "Sample Listing Title 2",
            location: "Sample Location 2",
            thumbnail: "assets/images/uploads/property-2.jpg",
            agents: ["assets/images/agents/agent-3.jpg", "images/agents/agent-4.jpg"],
            queryCount: 30,
            type: "For Sale",
            price: "AED7500.00/Year",
            date: "15 March, 2022",
        },
    ];

    const [visibleListings, setVisibleListings] = useState(2);

    const handleLoadMore = () => {
        setVisibleListings((prev) => prev + 2);
    };

    return (
        <>
        <Header/>
            <div class="short-banner">
                <div class="container">
                    <h1>My Enquiry</h1>
                </div>
            </div>
            <section className="section">
            <div className="container">
                <div className="row">
                    <SideBar />

                    {/* Main Content */}
                    <aside className="col-xl-9 col-lg-9 col-12">
                        <div className="d-flex justify-content-between mb-3">
                            <h4>Enquiry Listing</h4>
                            <div
                                className="btn-group bootstrap-select select-sm"
                                style={{ width: "110px" }}
                            >
                                <button
                                    type="button"
                                    className="btn dropdown-toggle bs-placeholder btn-default"
                                    data-bs-toggle="dropdown"
                                    role="button"
                                    title="Sort By"
                                    aria-expanded="false"
                                >
                                    <span className="filter-option pull-left">
                                        Sort By
                                    </span>
                                    &nbsp;
                                    <span className="bs-caret">
                                        <span className="caret"></span>
                                    </span>
                                </button>
                                <div
                                    className="dropdown-menu open"
                                    role="combobox"
                                    style={{
                                        maxHeight: "657.484px",
                                        overflow: "hidden",
                                        minHeight: "11px",
                                    }}
                                >
                                    <ul
                                        className="dropdown-menu inner"
                                        role="listbox"
                                        aria-expanded="false"
                                        style={{
                                            maxHeight: "645.484px",
                                            overflowY: "auto",
                                            minHeight: "0px",
                                        }}
                                    >
                                        {[
                                            "Sort By",
                                            "Weekly",
                                            "Monthly",
                                            "Yearly",
                                        ].map((option, index) => (
                                            <li
                                                key={index}
                                                data-original-index={index}
                                                className={`${
                                                    index === 0
                                                        ? "disabled selected"
                                                        : ""
                                                }`}
                                            >
                                                <a
                                                    tabIndex={
                                                        index === 0 ? "-1" : "0"
                                                    }
                                                    className=""
                                                    role="option"
                                                    aria-disabled={index === 0}
                                                    aria-selected={index === 0}
                                                >
                                                    <span className="text">
                                                        {option}
                                                    </span>
                                                    <span className="glyphicon glyphicon-ok check-mark"></span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-listing mb-4">
                            {listings
                                .slice(0, visibleListings)
                                .map((listing) => (
                                    <div
                                        key={listing.id}
                                        className="d-flex align-items-center mb-3"
                                    >
                                        <div className="photox">
                                            <img
                                                src={listing.thumbnail}
                                                alt="Property Thumbnail"
                                                height="64"
                                                width="96"
                                            />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h4 className="mb-0">
                                                {listing.title}
                                            </h4>
                                            <p className="mb-0">
                                                <i className="icon-feather-map-pin text-site"></i>{" "}
                                                {listing.location}
                                            </p>
                                            <div className="user-groups ms-3">
                                                {listing.agents.map(
                                                    (agent, index) => (
                                                        <img
                                                            key={index}
                                                            src={agent}
                                                            alt={`Agent ${
                                                                index + 1
                                                            }`}
                                                            height="32"
                                                            width="32"
                                                        />
                                                    )
                                                )}
                                                <span className="ms-1">
                                                    {listing.queryCount} Query
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <span
                                                className={`ads-type ${listing.type.toLowerCase()}`}
                                            >
                                                {listing.type}
                                            </span>
                                            <h3>{listing.price}</h3>
                                            <p>
                                                <i className="material-icons-outlined">
                                                    today
                                                </i>{" "}
                                                {listing.date}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {visibleListings < listings.length && (
                            <div className="text-center">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleLoadMore}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            </section>
            <Footer/>
        </>
    );
};

export default Index;
