import React, { useState, useEffect } from "react";
import ProjectDraftComponent from "@/components/projectListing/ProjectDraftComponent";
import ProjectPendingComponent from "@/components/projectListing/ProjectPendingComponent";
import ProjectExpiredComponent from "@/components/projectListing/ProjectExpiredComponent";
import ProjectPublishComponent from "@/components/projectListing/ProjectPublishComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShimmerContentBlock } from "react-shimmer-effects";
import withAuth from "@/utils/withAuth";
import AuthUser from "@/components/Authentication/AuthUser";
import useTranslation from '../../hooks/useTranslation'


const TabComponent = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [activeTab, setActiveTab] = useState("published");
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);
    const [page, setpage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPages, setCurrentPages] = useState(0);
    const translation = useTranslation();
    const memberId = GetMemberId();

    useEffect(() => {
        if (memberId) {
            fetchProjectData(activeTab);
        }
    }, [activeTab ,memberId]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchProjectData(tab);
        setpage(1);
        setTotalPages(0);
        setCurrentPages(0);
    };

    const fetchProjectData = async (type, loadMore, page=1) => {
        if(!loadMore) {
            setLoading(true); 
        }
        try {
            const response = await callApi({
                api: `/get-myproject`,
                method: "GET",
                data: {
                    type: type || "pending",
                    uid: memberId,
                    page: page,
                },
            });

            if (response && response?.status === 1) {
                if(!loadMore) {
                    setProjectData(response.data);
                    setCurrentPages(response?.pagination?.current_page);
                    setTotalPages(response?.pagination?.total_pages)
                } else {
                    updateLoadMoreState(response)
                }
            } else {
                console.error("Error fetching data:", response.message);
                setProjectData([]);
                setCurrentPages(0);
                setTotalPages(0)
            }
        } catch (error) {
            console.error("API call failed:", error);
            setProjectData([]);
        } finally {
            setLoading(false);
        }
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
            case "published":
                return <ProjectPublishComponent projectData={projectData} />;
            case "pending":
                return <ProjectPendingComponent projectData={projectData}/>;
            case "expired":
                return <ProjectExpiredComponent projectData={projectData} />;
            case "draft":
                return <ProjectDraftComponent projectData={projectData} />;
            default:
                return null;
        }
    };

    const updateLoadMoreState = (res) => {
        setCurrentPages(res?.pagination?.current_page);
        setTotalPages(res?.pagination?.total_pages)
        setProjectData(prev => {
            return [
                ...prev,
                ...res?.data
            ]
        })
    }
    const handleLoadMoreClick = () => {
        const nextPage = page + 1;
        setpage(nextPage);
        fetchProjectData(activeTab, true, nextPage)
    }
    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">{translation?.my_project_listing || "My Project Listing"}</h1>
                    <ul className="nav nav-underline mb-3 gap-4">
                        <li className="nav-item">
                            <a
                                role="button"
                                className={`nav-link ${
                                    activeTab === "published" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("published")}
                            >
                                {translation?.publish || "Publish"}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                            role="button"
                                className={`nav-link ${
                                    activeTab === "pending" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("pending")}
                            >
                               {translation?.pending || "Pending"} 
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                            role="button"
                                className={`nav-link ${
                                    activeTab === "expired" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("expired")}
                            >
                                 {translation?.expired || "Expired"} 
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                            role="button"
                                className={`nav-link ${
                                    activeTab === "draft" ? "active" : ""
                                }`}
                                onClick={() => handleTabChange("draft")}
                            >
                                  {translation?.draft || "Draft"} 
                            </a>
                        </li>
                    </ul>
                    {!loading && renderTabContent()}
                    {loading && (
                        <div className="loading-spinner">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden"> {translation?.loading || "Loading...."} </span>
                        </div>
                      </div>
                    )}
                    {currentPages < totalPages && (
                    <button
                        className="btn btn-primary btn-lg d-block mx-auto mt-4"
                        onClick={handleLoadMoreClick}>
                            {translation?.load_more || "Load More"} 
                    </button>
                    )} 
                </div>
            </aside>
            <aside className="col-xl-auto col-12">
                <div className="text-center mt-4">
                    <img
                        src="/assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
                        alt="ads"
                        className="img-fluid"
                        loading="lazy"
                    />
                </div>
            </aside>
        </DashboardLayout>
    );
};

export default withAuth(TabComponent);
