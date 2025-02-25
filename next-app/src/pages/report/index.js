"use client";
import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import AuthUser from '@/components/Authentication/AuthUser';
const propertyReports = [
    {
        property_id: "P001",
        property_name: "Sunset Apartments",
        property_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "+1234567890"
        },
        reason: "False Information",
        description: "The property details mentioned are misleading and incorrect."
    },
    {
        property_id: "P002",
        property_name: "Green Valley Residency",
        property_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "Jane Smith",
            email: "janesmith@example.com",
            phone: "+1987654321"
        },
        reason: "Scam",
        description: "The owner is asking for payment upfront before showing the property."
    },
    {
        property_id: "P003",
        property_name: "Ocean View Villas",
        property_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "Michael Brown",
            email: "michaelbrown@example.com",
            phone: "+1122334455"
        },
        reason: "Duplicate Listing",
        description: "This property is listed multiple times with different details."
    }
];

const projectReports = [
    {
        project_id: "PR001",
        project_name: "Skyline Towers",
        project_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "Alice Johnson",
            email: "alicejohnson@example.com",
            phone: "+1239876543"
        },
        reason: "Incomplete Information",
        description: "The project details are missing crucial information like amenities and location."
    },
    {
        project_id: "PR002",
        project_name: "Sunrise Residency",
        project_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "Bob Williams",
            email: "bobwilliams@example.com",
            phone: "+1456789023"
        },
        reason: "Fraudulent Claims",
        description: "The developer is falsely claiming government approvals for the project."
    },
    {
        project_id: "PR003",
        project_name: "Greenwood Villas",
        project_image: "/assets/images/property/default-property-1.jpg",
        reported_by: {
            name: "Sophia Martinez",
            email: "sophiamartinez@example.com",
            phone: "+1987564321"
        },
        reason: "Fake Reviews",
        description: "The project has a lot of fake reviews that seem suspicious."
    }
];




const index = () => {
    const [activeTab, setActiveTab] = useState("property");
    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1);
    const [currentpage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { GetMemberId, callApi } = AuthUser();
    const memberId = GetMemberId();

    useEffect(() => {
        const getReportList = async () => {
            // if (activeTab === "property") {
            //     setReportList(propertyReports)
            // } else {
            //     setReportList(projectReports)
            // }
            // return;
            try {
                const url = activeTab === "property" ? "/get_reported_properties" : "/get_reported_projects";
                const res = await callApi({
                    api: url,
                    method: "GET",
                    data: {
                        user_id: memberId,
                    }
                })
                
                if(res){
                    console.log('res',res)
                    setReportList(res.data)
                }
                // if (activeTab === "property") {
                //     setReportList(propertyReports)
                // } else {
                //     setReportList(projectReports)
                // }
            } catch (error) {
                console.error(error?.message || "Something went wrong");
            }
        }

        getReportList();
    }, [activeTab, memberId])
console.log(reportList)
    return (
        <DashboardLayout>
            <aside className="col-xl-9 col-lg-9 col-12 ms-4">
                <div className="tabs mb-1 p-2">
                    <a
                        className={`btn btn-${activeTab === "property" ? "primary" : "secondary"} tab-btn`}
                        onClick={() => setActiveTab("property")}
                    >
                        Property
                    </a>
                    <a
                        className={`btn btn-${activeTab === "project" ? "primary" : "secondary"} tab-btn ms-2`}
                        onClick={() => setActiveTab("project")}
                    >
                        Project
                    </a>
                </div>

                <div className="d-flex justify-content-between mb-3">
                    <h4>
                        {activeTab === "property"
                            ? "Reported Properties"
                            : "Reported Projects"}
                    </h4>
                </div>

                <div className='dashboard-listing mb-4'>
                    {reportList?.map((report, i) => {
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
                                        (ID: {isProperty ? report?.property_id : report?.project_id || "N/A"})
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



                </div>
            </aside>
        </DashboardLayout>
    )
}

export default index
