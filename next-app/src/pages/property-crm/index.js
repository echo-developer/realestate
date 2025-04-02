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
import { Modal, Button } from "react-bootstrap";
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
            } else {
                toast.error("Failed to update lead status")
            }
        } catch (error) {
            console.error(error?.message);
        }
    }

    const handleLoadMoreClick = (nextPage) => {
        setCurrentPage(nextPage);
        fetchLeadsData(activeTab, nextPage, true);
    }

    const handleModalOpen = (phone = "", email = "", assign_id, enquery_id, lead_type) => {
        setActiveModalData({
            phone: phone,
            email: email,
            assign_id: assign_id,
            enquery_id: enquery_id,
            lead_type: lead_type
        })
        setShow(true);
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


    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary mb-3">Leads Management</h1>


                    <div className="container mt-4">
                        <div className="d-flex justify-content-start">
                            <button className={`btn btn-${activeTab == 'property' ? 'primary' : 'secondary'} mx-2`} onClick={() => handleActiveTabChange("property")}>Property Leads</button>
                            <button className={`btn btn-${activeTab == 'project' ? 'primary' : 'secondary'} mx-2`} onClick={() => handleActiveTabChange("project")}>Project Leads</button>
                            <button className={`btn btn-${activeTab == 'general' ? 'primary' : 'secondary'} mx-2`} onClick={() => handleActiveTabChange("general")}>General Leads</button>
                        </div>
                    </div>
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
                    {list?.length > 0 && !loading && (
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
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h4>{lead?.property_name || "Not available"}</h4>
                                                        <h6>Coustomer Name: {lead?.customer_name || "Not available"}</h6>
                                                        <div className="text-end">
                                                            <span className={`badge ${statusClasses[lead?.lead_status]}`}>{leadStatusList[lead?.lead_status || 0]}</span>
                                                            <br />
                                                            {/* <button className="btn btn-secondary btn-sm mt-1">Actions</button> */}
                                                        </div>
                                                    </div>
                                                    <p>
                                                        <span className="d-block">
                                                            <i className="bi bi-telephone"></i> {lead?.phone}
                                                        </span>
                                                        <span className="d-block">
                                                            <i className="bi bi-envelope"></i> {lead?.email}
                                                        </span>
                                                        <span className="d-block">
                                                            <i className="bi bi-clock"></i> {lead?.created_at}
                                                        </span>
                                                    </p>
                                                    <p className="text-wrap mb-2">{lead?.message}</p>
                                                    <div class="d-flex justify-content-end">
                                                        <button class="btn btn-sm btn-outline-primary me-2" onClick={() => handleModalOpen(lead?.Phone, lead?.Email, lead.assign_id, lead.enquery_id, lead.lead_type)}>Contact</button>
                                                        <Link class="btn btn-sm btn-outline-primary me-2" href={`/property-crm-timeline?assign_id=${lead?.assign_id}`}>Contact History</Link>
                                                        <Link class="btn btn-sm btn-outline-primary me-2" href={`/lead-details/${lead?.assign_id}`}>Lead Details</Link>
                                                        <select class="form-select form-select-sm ms-2" aria-label="Select action" value={lead?.lead_status} onChange={(e) => handleLeadStatusChange(e, i, lead.assign_id)}>
                                                            <option value="">select an option</option>
                                                            {leadStatusList?.length > 0 && leadStatusList?.map((status, i) => {
                                                                return (
                                                                    <option key={i} value={i}>{status}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {/* {propertyCRM?.length > 0 && (
                        <div className="list-display">
                            {propertyCRM?.map((property, index) => (
                                <div className="card card-ads" key={index}>
                                    <div className="row g-0">
                                        <div className="col-lg-3 col-sm-4">
                                            <div className="card-image">
                                                <img
                                                    src={
                                                        property?.gallery?.[0]?.images?.[0]?.image_url || "/default-image.jpg"
                                                    }
                                                    alt="Property Image"
                                                    className="card-img-top"
                                                    loading="lazy"
                                                />
                                                <span
                                                    className={`ads-type ${property?.type}`}
                                                >
                                                    {property?.property_code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-lg-9 col-sm-8 position-relative">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h4>{property?.customer_name || "Not available"}</h4>
                                                    <div className="text-end">
                                                        <span
                                                            className={`badge ${property?.enquery_status == "1"
                                                                ? "bg-primary"
                                                                : property?.enquery_status == "2"
                                                                    ? "bg-success"
                                                                    : property?.enquery_status == "3"
                                                                        ? "bg-danger"
                                                                        : property?.enquery_status == "4"
                                                                            ? "bg-info"
                                                                            : property?.enquery_status == "5"
                                                                                ? "bg-warning"
                                                                                : "bg-primary"
                                                                }`}
                                                        >
                                                            {getStatusLabel(property?.enquery_status)}
                                                        </span>
                                                        <br />
                                                        <button
                                                            className="btn btn-secondary btn-sm mt-1"
                                                            onClick={() => handleShowModal(property, "remarks")}
                                                        >
                                                            {translation?.actions || "Actions"}
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="d-flex gap-2">
                                                    <span>
                                                        <i className="bi bi-telephone"></i> {property?.Phone}
                                                    </span>
                                                    <span>
                                                        <i className="bi bi-envelope"></i> {property?.Email}
                                                    </span>
                                                    <span>
                                                        <i className="bi bi-clock"></i> {useDateFormat(property?.created_at)}
                                                    </span>
                                                </p>
                                                <p className="text-wrap mb-2">
                                                    {property?.message}
                                                </p>
                                                <div className="d-sm-flex">
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() => handleShowModal(property, "details")}
                                                    >
                                                        {translation?.read_more || "Read more"}
                                                    </button>
                                                    <Link
                                                        href={`/property-crm-schedule/${property?.enquery_id}`}
                                                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right"></i>
                                                    </Link>
                                                    <Link href={`/property-crm-timeline?enquery_id=${property?.enquery_id}`} className="btn btn-sm btn-outline-primary me-2">
                                                        <RiMapPinTimeLine />
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteClick(property?.enquery_id)}
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentPages < totalPages && (
                        <button
                            className="btn btn-primary btn-lg d-block mx-auto mt-4"
                            onClick={() => handleLoadMoreClick(perPage + 1)}
                        >
                            {translation?.read_more || "Load More"}
                        </button>
                    )} */}
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



            {/* <CRMEnquiry
                showModal={show}
                modalContent={modalContent}
                handleCloseModal={handleCloseModal}
                logData={modalContent?.log_data}
                fecthPropertyCRMData={fecthPropertyCRMData}
                enquiryId={modalContent?.enquery_id}
                actionUpdateFunction={actionUpdateFunction} /> */}
            {/* {console.log("show", show)} */}
            {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal Title</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <form>
                        <div className="form-floating mb-4">
                            <select className="form-select" id="floatingSelect" aria-label="Select Status">
                                <option value="">select an option</option>
                                {leadStatusList?.length > 0 &&
                                    leadStatusList.map((status, i) => (
                                        <option key={i} value={i}>{status}</option>
                                    ))
                                }
                            </select>

                            <label htmlFor="floatingSelect">Status</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="scheduleDate"
                                aria-label="Schedule Date"
                            />
                            <label htmlFor="scheduleDate">Schedule Date</label>
                        </div>

                        <div className="form-floating mb-4">
                            <textarea
                                rows="4"
                                className="form-control"
                                id="remarks"
                                placeholder="Remarks"
                                style={{ minHeight: "80px" }}
                            ></textarea>
                            <label htmlFor="remarks">Remarks</label>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleClose}>
                        Close
                    </button>
                    <Button variant="primary">Submit</Button>
                </Modal.Footer>
            </Modal> */}
            <ContactModal show={show} handleClose={handleClose} phone={activeModalData?.phone} email={activeModalData?.email} submitHandler={contactSave} />
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

