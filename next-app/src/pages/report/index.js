"use client";
import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import AuthUser from '@/components/Authentication/AuthUser';





const index = () => {
    const [activeTab, setActiveTab] = useState("property");
    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1);
    const [currentpage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { GetMemberId, callApi } = AuthUser();
    const [loading, setLoading] = useState(true);
    const memberId = GetMemberId();

    const getReportList = async (loadmore, page=1) => {
        if(!loadmore) {
            setLoading(true);
        }
        try {
            const url = activeTab === "property" ? "/get_reported_properties" : "/get_reported_projects";
            const res = await callApi({
                api: url,
                method: "GET",
                data: {
                    user_id: memberId,
                    current_page: page
                }
            })
            
            if(res && res?.status === 1){
                if(!loadmore) {
                    setReportList(res?.data || [])
                } else {
                    setReportList(prev => {
                        return [...prev, ...(res?.data || [])]
                    })
                }
                setCurrentPage(res?.pagination?.current_page || 0);
                setTotalPages(res?.pagination?.total_pages || 0)
            }
        } catch (error) {
            console.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getReportList(false, page);
    }, [activeTab, memberId])

    const handleLoadMoreClick = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        getReportList(true, nextPage)
    }

    return (
        <DashboardLayout>
            <aside className="col-xl-9 col-lg-9 col-12 ms-4">
                <ul className="nav nav-underline mb-3 gap-4">
                    <li className="nav-item">
                    <a role="button"
                        className={`nav-link ${activeTab === "property" ? "active" : "secondary"} tab-btn`}
                        onClick={() => {
                            setActiveTab("property")
                            setPage(1)
                        }}
                    >
                        Property
                    </a>
                    </li>
                    <li className="nav-item">
                        <a role="button"
                        className={`nav-link ${activeTab === "project" ? "active" : "secondary"} tab-btn ms-2`}
                        onClick={() => {
                            setActiveTab("project")
                            setPage(1)
                        }}
                    >
                        Project
                    </a>
                    </li>
                </ul>

                <div className="d-flex justify-content-between mb-3">
                    <h4>
                        {activeTab === "property"
                            ? "Reported Properties"
                            : "Reported Projects"}
                    </h4>
                </div>

                <div className='dashboard-listing mb-4'>
                    {console.log("report list", reportList)}
                    {reportList?.length > 0 && reportList?.map((report, i) => {
                        const isProperty = activeTab === "property";

                        return (
                            <div key={i} className="d-flex align-items-center mb-3">
                                {/* Dynamic Image */}
                                <div className="photox">
                                    <img
                                        src={isProperty ? report?.image : report?.image || "/assets/images/property/default-property-1.jpg"}
                                        alt="Thumbnail"
                                        height="64"
                                        width="96"
                                    />
                                </div>

                                {/* Dynamic Details */}
                                <div className="flex-grow-1 ms-3">
                                    <h4 className="mb-0">
                                        {report?.name|| "Unknown"}
                                        (ID: {isProperty ? report?.property_id : report?.project_id || "Not Available"})
                                    </h4>
                                    <p className="mb-0">
                                        <i className="icon-feather-user"></i> {report?.reported_by|| "Anonymous"}
                                    </p>
                                    
                                </div>

                                {/* Report Details */}
                                <div className="text-end">
                                    <span className="ads-type">{report?.reason || "No reason provided"}</span>
                                    <p className="mb-0">
                                        <i className="material-icons-outlined">info</i> {report?.description || "No description"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    {!loading && reportList?.length === 0 && (
                        <>
                        <div className='card border-0 text-center'>
                          <div className="card-body">
                            <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" />
                            <p className='text-muted'>No Record Founds</p>
                          </div>
                        </div>
                      </> 
                    )}
                    {currentpage < totalPages && (
                        <button
                        className="btn btn-primary btn-lg d-block mx-auto mt-4"
                        onClick={handleLoadMoreClick}>
                        Load More
                        </button>
                    )}

                </div>
            </aside>
        </DashboardLayout>
    )
}

export default index
