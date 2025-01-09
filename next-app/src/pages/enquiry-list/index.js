"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/components/sidebar/SideBar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [enquiryList, setEnquiryList] = useState([]);
    const [sortType, setSortType] = useState("all");
    const [isLoading, setIsLoading] = useState(true);

    const memberId = GetMemberId();

    useEffect(() => {
        if (memberId) {
            FetchEnquiryList(memberId);
        }
    }, [memberId]);

    const FetchEnquiryList = async (memberId) => {
        setIsLoading(true);
        try {
            const response = await callApi({
                api: `/my_property_enquery_list`,
                method: "GET",
                data: { user_id: memberId },
            });

            if (response && response.status === 1) {
                setEnquiryList(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Data not found");
            toast.error("Failed to load enquiries");
        } finally {
            setIsLoading(false);
        }
    };

    const [visibleListings, setVisibleListings] = useState(2);

    const handleLoadMore = () => {
        setVisibleListings((prev) => prev + 2);
    };

    const filterListingsBySortType = () => {
        const now = new Date();
        if (sortType === "weekly") {
            return enquiryList.filter(
                (listing) =>
                    new Date(listing.created_at) >= now &&
                    new Date(listing.created_at) <=
                        new Date(now.setDate(now.getDate() + 7))
            );
        } else if (sortType === "monthly") {
            return enquiryList.filter(
                (listing) =>
                    new Date(listing.created_at).getMonth() ===
                    new Date().getMonth()
            );
        } else if (sortType === "yearly") {
            return enquiryList.filter(
                (listing) =>
                    new Date(listing.created_at).getFullYear() ===
                    new Date().getFullYear()
            );
        }
        return enquiryList;
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
                                    onChange={(e) =>
                                        setSortType(e.target.value)
                                    }
                                    style={{ width: "150px" }}
                                >
                                    <option value="all">Sort By</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>

                            {/* Loading Spinner or Listings */}
                            {isLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                </div>
                            ) : sortedListings.length > 0 ? (
                                <div className="dashboard-listing mb-4">
                                    {sortedListings
                                        .slice(0, visibleListings)
                                        .map((listing) => (
                                            <div
                                                key={listing.property_id}
                                                className="d-flex align-items-center mb-3"
                                            >
                                                <div className="photox">
                                                    <img
                                                        src={
                                                            listing.galleries[0]
                                                                ?.images[0].image_url || ""
                                                        }
                                                        alt="Property Thumbnail"
                                                        height="64"
                                                        width="96"
                                                    />
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h4 className="mb-0">
                                                        {listing.property_name}
                                                    </h4>
                                                    <p className="mb-0">
                                                        <i className="icon-feather-map-pin text-site"></i>{" "}
                                                        {listing.address}
                                                    </p>
                                                    <div className="user-groups ms-3">
                                                        <span className="ms-1">
                                                            {listing.enquiry_count}{" "}
                                                            Enquiries
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <span
                                                        className={`ads-type ${listing.property_post_for.toLowerCase()}`}
                                                    >
                                                        {listing.property_post_for}
                                                    </span>
                                                    <h3>{listing.price}</h3>
                                                    <p>
                                                        <i className="material-icons-outlined">
                                                            today
                                                        </i>{" "}
                                                        {useDateFormat(
                                                            listing.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h5>No records found</h5>
                                </div>
                            )}

                            {/* Load More Button */}
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
