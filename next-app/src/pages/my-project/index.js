import React, { useState } from "react";
import ProjectDraftComponent from "@/components/projectListing/ProjectDraftComponent";
import ProjectPendingComponent from "@/components/projectListing/ProjectPendingComponent";
import ProjectExpiredComponent from "@/components/projectListing/ProjectExpiredComponent";
import ProjectPublishComponent from "@/components/projectListing/ProjectPublishComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShimmerContentBlock } from "react-shimmer-effects";
import withAuth from "@/utils/withAuth";

// Static Data
const staticProjectData = {
    pending_properties: {
        current_page: "1",
        total: 3,
        per_page: 10,
        data: [
            {
                property_name: "Apartments / Flats FOR Rent",
                slug: "Apartments-Flats-FOR-Rent&id=342D312D52656E74",
                views: 133,
                is_featured: 0,
                status: 0,
                is_populer: 1,
                parking_ability: null,
                property_type_for: "Apartments / Flats",
                bedrooms: 1,
                bathroom: 1,
                price: "AED 1000000",
                created_at: "2025-01-09 11:54:08",
                address: "Park Circus Kolkata",
                galleries: [
                    {
                        gallery: "exterior",
                        images: [
                            {
                                image_id: 11,
                                image_name: "1736403813-plot-4.jpg",
                                image_url:
                                    "http://localhost/realestate/public/property_images/1736403813-plot-4.jpg",
                                caption: "okk",
                            },
                        ],
                    },
                ],
            },
            // Add more pending properties as needed
        ],
    },
    published_properties: {
        current_page: "1",
        total: 2,
        per_page: 10,
        data: [
            {
                property_name: "Luxury Villa FOR Sale",
                slug: "Luxury-Villa-FOR-Sale&id=453D312D56696C6C61",
                views: 50,
                is_featured: 1,
                status: 1,
                is_populer: 0,
                parking_ability: "Yes",
                property_type_for: "Villa",
                bedrooms: 3,
                bathroom: 2,
                price: "AED 2000000",
                created_at: "2025-01-05 14:22:11",
                address: "Palm Jumeirah Dubai",
                galleries: [
                    {
                        gallery: "interior",
                        images: [
                            {
                                image_id: 21,
                                image_name: "1936403813-villa-2.jpg",
                                image_url:
                                    "http://localhost/realestate/public/property_images/1936403813-villa-2.jpg",
                                caption: "Beautiful Villa",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    expired_properties: {
        current_page: "1",
        total: 1,
        per_page: 10,
        data: [
            {
                property_name: "Old Apartment FOR Rent",
                slug: "Old-Apartment-FOR-Rent&id=342D312D6F6C64",
                views: 10,
                is_featured: 0,
                status: -1,
                is_populer: 0,
                parking_ability: "No",
                property_type_for: "Apartment",
                bedrooms: 2,
                bathroom: 1,
                price: "AED 500000",
                created_at: "2024-12-31 09:00:00",
                address: "Deira Dubai",
                galleries: [],
            },
        ],
    },
    draft_properties: {
        current_page: "1",
        total: 2,
        per_page: 10,
        data: [
            {
                property_name: "Draft Property Example 1",
                slug: "Draft-Property-Example-1&id=12345",
                views: 0,
                is_featured: 0,
                status: null,
                is_populer: 0,
                parking_ability: null,
                property_type_for: "Draft",
                bedrooms: 0,
                bathroom: 0,
                price: "AED 0",
                created_at: null,
                address: "Not Specified",
                galleries: [],
            },
        ],
    },
};

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState("publish");
    const [loading, setLoading] = useState(false);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <ShimmerContentBlock
                    title
                    text
                    cta
                    thumbnailWidth={350}
                    thumbnailHeight={50}
                />
            );
        }

        switch (activeTab) {
            case "publish":
                return (
                    <ProjectPublishComponent
                        projectData={staticProjectData}
                    />
                );
            case "pending":
                return (
                    <ProjectPendingComponent
                        projectData={staticProjectData}
                    />
                );
            case "expired":
                return (
                    <ProjectExpiredComponent
                        projectData={staticProjectData}
                    />
                );
            case "draft":
                return (
                    <ProjectDraftComponent
                        projectData={staticProjectData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">My Property Listing</h1>
                    <ul className="nav nav-underline mb-3 gap-4">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "publish" ? "active" : ""
                                }`}
                                href="#"
                                onClick={() => handleTabChange("publish")}
                            >
                                Publish
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "pending" ? "active" : ""
                                }`}
                                href="#"
                                onClick={() => handleTabChange("pending")}
                            >
                                Pending
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "expired" ? "active" : ""
                                }`}
                                href="#"
                                onClick={() => handleTabChange("expired")}
                            >
                                Expired
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "draft" ? "active" : ""
                                }`}
                                href="#"
                                onClick={() => handleTabChange("draft")}
                            >
                                Draft
                            </a>
                        </li>
                    </ul>
                    {renderTabContent()}
                </div>
            </aside>
            <aside className="col-xl-auto col-12">
                <div className="text-center mt-4">
                    <img
                        src="assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
                        alt="ads"
                        className="img-fluid"
                    />
                </div>
            </aside>
        </DashboardLayout>
    );
};

export default withAuth(TabComponent);
