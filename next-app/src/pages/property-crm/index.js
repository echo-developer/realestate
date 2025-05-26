import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import AuthUser from "@/components/Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { enquiryStatuses } from "@/components/post/PropertyData";
import withAuth from "@/utils/withAuth";
import { RiMapPinTimeLine } from "react-icons/ri";
import useTranslation from "@/hooks/useTranslation";
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import { Modal, Button, Nav } from "react-bootstrap";
import ContactModal from "@/components/property-crm/ContactModal";


const ITEMS_PER_PAGE = 10;

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const memberId = GetMemberId();
    const translation = useTranslation();
    const [show, setShow] = useState(false);
    const [activeTab, setActiveTab] = useState("property");
    const [list, setList] = useState([]);
    const [leadStatusList, setLeadStatusList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [activeModalData, setActiveModalData] = useState(null);
    const [membershipModal, setMembershipModal] = useState(false);



    useEffect(() => {
        if (memberId) {
            fetchLeadsData('property', 1, false)
        }
    }, [memberId])

    const handleActiveTabChange = (tab) => {
        setList([]);
        setActiveTab(tab);
        fetchLeadsData(tab);
    }

    const statusClasses = {
        "0": "bg-warning",  // Yellow
        "1": "bg-success",    // Green
        "2": "bg-danger",   // Red
        "3": "bg-success", // Green
        "4": "bg-success"  // Green
    };

    const fetchLeadsData = async (leadType, page, loadMore) => {
        if (!loadMore) {
            setLoading(true);
        }
        try {
            const url = generateUrl(leadType);
            const res = await callApi({
                api: `${url}`,
                method: "GET",
                data: {
                    user_id: memberId,
                    recent_page: page
                }
            })
            if (res && res.status === 1) {
                setLeadStatusList(res?.lead_status_arr || [])
                if (!loadMore) {
                    setList(res.data || []);
                } else {
                    setList(prev => {
                        return [
                            ...prev,
                            ...res.data
                        ]
                    })
                }

                setCurrentPage(res?.pagination?.current_page || 1);
                setTotalPage(res?.pagination?.total_pages || 1);
            } else {
                setCurrentPage(1);
                setTotalPage(1);
            }
        } catch (error) {
            console.error(error.message || "Something went wrong")
        } finally {
            setLoading(false);
        }
    }


    const handleLeadStatusChange = async (e, index, assign_id) => {
        const { value } = e.target || {};
        try {
            const res = await callApi({
                api: `/update-lead-status`,
                method: "UPLOAD",
                data: {
                    user_id: memberId,
                    assign_id: assign_id,
                    lead_status: value,

                }
            })

            if (res && res?.status === 1) {
                const newState = list?.map((lead, i) => {
                    if (i !== index) {
                        return lead;
                    } else {
                        return {
                            ...lead,
                            lead_status: value,
                        }
                    }
                })
                setList(newState);
                toast.success("lead status updated successfully")
            }
        } catch (error) {
            console.error(error?.message);
        }
    }

    const handleLoadMoreClick = (nextPage) => {
        setCurrentPage(nextPage);
        fetchLeadsData(activeTab, nextPage, true);
    }

    const handleModalOpen = (phone = "", email = "", assign_id, enquery_id, lead_type, blur) => {
        if (blur) {

            handleOpenModal();
        } else {
            setActiveModalData({
                phone: phone,
                email: email,
                assign_id: assign_id,
                enquery_id: enquery_id,
                lead_type: lead_type
            })
            setShow(true);
        }
    }

    const handleClose = () => {
        setShow(false);
        setActiveModalData(null)
    }

    const contactSave = async (data) => {
        const newData = {
            ...data,
            user_id: memberId,
            assign_id: activeModalData.assign_id,
            enquery_id: activeModalData.enquery_id,
            lead_type: activeModalData.lead_type,
        };
        try {
            const res = await callApi({
                api: '/save-lead-contact-status',
                method: "UPLOAD",
                data: newData
            })

            if (res && res?.status === 1) {
                toast.success("Contact form submitted successfully");
                handleClose();
            }
        } catch (error) {
            console.log(error.message || "Something went wrong")
        }
    }

    const handleOpenModal = () => {
        setMembershipModal(true);
    }
    const handleCloseModal = () => {
        setMembershipModal(false);
    }

    const handleShowLead = async (enquery_id, enquery_type, activeTab) => {
        if(!enquery_id || !enquery_type) return;
        try {
            const res = await callApi({
                api: '/leads-update',
                method: 'UPLOAD',
                data: {
                    enquery_id: enquery_id,
                    enquery_type: enquery_type
                }
            })
            if(res && res.status == 1) {
                const newList = list.map((item, i) => {
                    if(item.enquery_id !== enquery_id) {
                        return item;
                    } else {
                        return {
                            ...item,
                            ...res.data
                        }
                    }
                })
                setList(newList)

            }
        } catch (error) {
            console.error(error.message)
        }
    }


    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary mb-4">{translation?.leads_management || "Leads Management"}</h1>

                    <Nav variant="underline">
                        <Nav.Item>
                            <Nav.Link role="button" className={`${activeTab == 'property' ? 'active' : ''}`} onClick={() => handleActiveTabChange("property")}>{translation?.property_leads || "Property Leads"}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link role="button" className={`${activeTab == 'project' ? 'active' : ''}`} onClick={() => handleActiveTabChange("project")}>{translation?.project_leads || "Project Leads"}</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link role="button" className={`${activeTab == 'general' ? 'active' : ''}`} onClick={() => handleActiveTabChange("general")}>{translation?.genral_leads || "General Leads"}</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    {loading && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "200px",
                                width: "100%", // Ensure full width
                            }}
                            className="d-flex justify-content-center align-items-center w-100"
                        >
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    {translation?.loading ||
                                        "Loading...."}{" "}
                                </span>
                            </div>
                        </div>
                    )}

                    {(!loading && list?.length === 0) && (
                        <>
                            <div className="card border-0 text-center mt-4">
                                <div className="card-body">
                                    <img
                                        src="/assets/images/icons/9939447.png"
                                        alt="Icon"
                                        height={48}
                                        width={48}
                                        className="mb-2"
                                        loading="lazy"
                                    />
                                    <p className="text-muted">{translation?.no_record_founds || "No Record Founds"}</p>
                                </div>
                            </div>
                        </>
                    )}
                    {activeTab !== 'general' && list?.length > 0 && !loading && (
                        <div className="list-display mt-4">
                            {list.map((lead, i) => {
                                return (
                                    <div className="card card-ads" key={i}>
                                        <div className="row g-0">
                                            <div className="col-lg-3 col-sm-4">
                                                <CardImageSlider
                                                    data={lead}
                                                    icons={false}
                                                    showFavIcon={false}
                                                />
                                            </div>
                                            <div className="col-lg-9 col-sm-8 position-relative">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h4>{lead?.property_name || lead?.project_name || ""}</h4>

                                                        {!lead?.is_blur && (
                                                            <div className="text-end">
                                                                <span className={`badge ${statusClasses[lead?.lead_status]}`}>{leadStatusList[lead?.lead_status || 0]}</span>
                                                                <br />
                                                                {/* <button className="btn btn-secondary btn-sm mt-1">Actions</button> */}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mb-2"><span className="text-muted">{translation?.customer_name || "Coustomer Name:"}</span> <strong className={lead?.is_blur ? 'text-blur' : ""}>{lead?.customer_name || `${translation?.not_available}`}</strong></p>
                                                    <p className="d-flex flex-column flex-md-row mb-2">
                                                        {lead?.phone && (
                                                            <span className="me-3">
                                                                <i className={`bi bi-telephone`}></i> <span className={`${lead?.is_blur ? 'text-blur' : ''}`}>{lead.phone}</span>
                                                            </span>
                                                        )}
                                                        {lead?.email && (
                                                            <span className="me-3">
                                                                <i className={`bi bi-envelope`}></i> <span className={`${lead?.is_blur ? 'text-blur' : ''}`}>{lead.email}</span>
                                                            </span>
                                                        )}
                                                        {lead?.created_at && (
                                                            <span className="me-3">
                                                                <i className={`bi bi-clock`}></i> <span className={`${lead?.is_blur ? 'text-blur' : ''}`}>{lead.created_at}</span>
                                                            </span>
                                                        )}
                                                    </p>

                                                    {lead?.message && (
                                                        <p className={`text-wrap mb-2 ${lead?.is_blur ? 'text-blur' : ''}`}>{lead?.message}</p>
                                                    )}
                                                    <div class="row">
                                                        <div className="col-lg mb-2 mb-lg-0">
                                                            <div className="d-flex d-md-block gap-2">
                                                                <button class="btn btn-sm btn-outline-primary flex-grow-1 me-md-2" onClick={() => handleModalOpen(lead?.phone, lead?.email, lead.assign_id, lead.enquery_id, lead.lead_type, lead?.is_blur)}>{translation?.contact || "Contact"}
                                                                </button>
                                                                {!lead?.is_blur && (
                                                                    <Link class="btn btn-sm btn-outline-primary flex-grow-1 me-md-2" href={`/property-crm-timeline?assign_id=${lead?.assign_id}`}>{translation?.contact_history || "Contact History"}
                                                                    </Link>
                                                                )}
                                                                {lead?.is_blur ? (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary flex-grow-1 me-md-2"
                                                                        onClick={() => handleShowLead(lead?.enquery_id, lead?.lead_type, activeTab)}
                                                                    >
                                                                        Show Lead
                                                                    </button>
                                                                ) : (
                                                                    <Link
                                                                        className="btn btn-sm btn-outline-primary flex-grow-1 me-md-2"
                                                                        href={`/lead-details/${lead?.assign_id}`}
                                                                    >
                                                                        {translation?.lead_details || "Lead Details"}
                                                                    </Link>
                                                                )}

                                                            </div>
                                                        </div>
                                                        {!lead?.is_blur && (
                                                            <div className="col-lg-auto">
                                                                <select class="form-select form-select-sm" aria-label="Select action" value={lead?.lead_status} onChange={(e) => handleLeadStatusChange(e, i, lead.assign_id)}>
                                                                    <option value="">{translation?.select_an_option || "Select an option"}
                                                                    </option>
                                                                    {leadStatusList?.length > 0 && leadStatusList?.map((status, i) => {
                                                                        return (
                                                                            <option key={i} value={i}>{status}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {activeTab == "general" && (
                        <div className="list-display mt-4">
                            {list.map((lead, i) => {
                                return (
                                    <div className="card card-ads" key={i}>
                                        <div className="row g-0">
                                            {/* <div className="col-lg-3 col-sm-4">
                                                <CardImageSlider
                                                    data={lead}
                                                    icons={false}
                                                    showFavIcon={false}
                                                />
                                            </div> */}
                                            <div className="col-12 position-relative">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h4 className={lead?.is_blur ? 'text-blur' : ''}>{lead?.name || "Not available"}</h4>
                                                        {/* <h6>{translation?.customer_name || "Coustomer Name:"} {lead?.customer_name || `${translation?.not_available}`}</h6> */}
                                                        <div className="text-end">
                                                            <span className={`badge ${statusClasses[lead?.lead_status]}`}>{leadStatusList[lead?.lead_status || 0]}</span>

                                                            {/* <button className="btn btn-secondary btn-sm mt-1">Actions</button> */}
                                                        </div>
                                                    </div>
                                                    <p className="d-flex flex-column flex-md-row mb-2">
                                                        <span className={`me-3 ${lead?.is_blur ? 'text-blur' : ''}`}>
                                                            <i className="bi bi-telephone"></i> {lead?.phone}
                                                        </span>
                                                        <span className={`me-3 ${lead?.is_blur ? 'text-blur' : ''}`}>
                                                            <i className="bi bi-envelope"></i> {lead?.email}
                                                        </span>
                                                        <span className={`me-3 ${lead?.is_blur ? 'text-blur' : ''}`}>
                                                            <i className="bi bi-clock"></i> {lead?.created_at}
                                                        </span>
                                                    </p>

                                                    <p className={`text-wrap mb-2 ${lead?.is_blur ? 'text-blur' : ''}`}>{lead?.message}</p>
                                                    <div class="row">
                                                        <div className="col-lg mb-2 mb-lg-0">
                                                            <div className="d-flex d-md-block gap-2">
                                                                <button class="btn btn-sm btn-outline-primary flex-grow-1 me-md-2" onClick={() => handleModalOpen(lead?.phone, lead?.email, lead.assign_id, lead.enquery_id, lead.lead_type, lead?.is_blur)}>{translation?.contact || "Contact"}
                                                                </button>
                                                                {!lead?.is_blur ? (
                                                                    <Link class="btn btn-sm btn-outline-primary flex-grow-1 me-md-2" href={`/property-crm-timeline?assign_id=${lead?.assign_id}`}>{translation?.contact_history || "Contact History"}
                                                                    </Link>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary flex-grow-1 me-md-2"
                                                                        onClick={() => handleShowLead(lead?.enquery_id, lead?.lead_type, activeTab)}
                                                                    >
                                                                        Show Lead
                                                                    </button>
                                                                )}

                                                            </div>
                                                        </div>
                                                        {!lead?.is_blur && (
                                                            <div className="col-lg-auto">
                                                                <select class="form-select form-select-sm" aria-label="Select action" value={lead?.lead_status} onChange={(e) => handleLeadStatusChange(e, i, lead.assign_id)}>
                                                                    <option value="">{translation?.select_an_option || "Select an option"}
                                                                    </option>
                                                                    {leadStatusList?.length > 0 && leadStatusList?.map((status, i) => {
                                                                        return (
                                                                            <option key={i} value={i}>{status}</option>
                                                                        )
                                                                    })}
                                                                </select>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {currentPage < totalPage && (
                        <button
                            className="btn btn-primary btn-lg d-block mx-auto mt-4"
                            onClick={() => handleLoadMoreClick(Number(currentPage) + 1)}
                        >
                            {translation?.load_more || "Load More"}
                        </button>
                    )
                    }
                </div>
            </aside>

            <ContactModal show={show} handleClose={handleClose} phone={activeModalData?.phone} email={activeModalData?.email} submitHandler={contactSave} />
            <Modal show={membershipModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Lead Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p className="mb-4">Please upgrade your membership to view this lead.</p>
                    <Link href="/membership" className="btn btn-warning">
                        Go to Membership
                    </Link>
                </Modal.Body>
            </Modal>


        </DashboardLayout>
    );
};

export default withAuth(Index);

const generateUrl = (leadType) => {
    switch (leadType) {
        case "property":
            return '/my_property_CRMS';
        case 'project':
            return '/user-project-leads';
        case 'general':
            return '/user-general-leads';
        default:
            return '/my_property_CRMS';
    }
};

