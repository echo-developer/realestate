import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import SideBar from "@/components/sidebar/SideBar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [enquiryList, setEnquiryList] = useState([]);
    const [sortType, setSortType] = useState("all");

    const memberId = GetMemberId();

    useEffect(() => {
        FetchEnquiryList(memberId);
    }, [memberId]);

    const FetchEnquiryList = async (memberId) => {
        try {
            const response = await callApi({
                api: `/my_fav_property_list`,
                method: "GET",
                data: { user_id: memberId },
            });

            if (response && response.status === 1) {
                setEnquiryList(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching the enquiries.");
        }
    };

    const listings = [
        {
            id: 1,
            title: "Sample Listing Title 1",
            location: "Sample Location 1",
            thumbnail: "assets/images/uploads/property-1.jpg",
            agents: ["assets/images/agents/agent-1.jpg", "assets/images/agents/agent-2.jpg"],
            queryCount: 24,
            type: "For Rent",
            price: "AED4900.00/Year",
            date: "2023-12-22",
        },
        {
            id: 2,
            title: "Sample Listing Title 2",
            location: "Sample Location 2",
            thumbnail: "assets/images/uploads/property-2.jpg",
            agents: ["/assets/images/agents/agent-3.jpg", "assets/images/agents/agent-4.jpg"],
            queryCount: 30,
            type: "For Sale",
            price: "AED7500.00/Year",
            date: "2023-11-15",
        },
        {
            id: 3,
            title: "Sample Listing Title 3",
            location: "Sample Location 3",
            thumbnail: "/assets/images/uploads/property-3.jpg",
            agents: ["/assets/images/agents/agent-5.jpg", "assets/images/agents/agent-6.jpg"],
            queryCount: 20,
            type: "For Sale",
            price: "AED6500.00/Year",
            date: "2023-12-01",
        },
    ];

    const [visibleListings, setVisibleListings] = useState(2);

    const handleLoadMore = () => {
        setVisibleListings((prev) => prev + 2);
    };

    const filterListingsBySortType = () => {
        const now = new Date();
        if (sortType === "weekly") {
            return listings.filter(
                (listing) =>
                    new Date(listing.date) >= now &&
                    new Date(listing.date) <= new Date(now.setDate(now.getDate() + 7))
            );
        } else if (sortType === "monthly") {
            return listings.filter(
                (listing) =>
                    new Date(listing.date).getMonth() === new Date().getMonth()
            );
        } else if (sortType === "yearly") {
            return listings.filter(
                (listing) =>
                    new Date(listing.date).getFullYear() === new Date().getFullYear()
            );
        }
        return listings;
    };

    const sortedListings = filterListingsBySortType();

    return (
        <>
            <Header />
            <div className="short-banner">
                <div className="container">
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
                                <select
                                    className="form-select"
                                    value={sortType}
                                    onChange={(e) => setSortType(e.target.value)}
                                    style={{ width: "150px" }}
                                >
                                    <option value="all">Sort By</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            <div className="dashboard-listing mb-4">
                                {sortedListings
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
                                                <h4 className="mb-0">{listing.title}</h4>
                                                <p className="mb-0">
                                                    <i className="icon-feather-map-pin text-site"></i>{" "}
                                                    {listing.location}
                                                </p>
                                                <div className="user-groups ms-3">
                                                    {listing.agents.map((agent, index) => (
                                                        <img
                                                            key={index}
                                                            src={agent}
                                                            alt={`Agent ${index + 1}`}
                                                            height="32"
                                                            width="32"
                                                        />
                                                    ))}
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
                                                    <i className="material-icons-outlined">today</i>{" "}
                                                    {listing.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {visibleListings < sortedListings.length && (
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
            <Footer />
        </>
    );
};

export default Index;
