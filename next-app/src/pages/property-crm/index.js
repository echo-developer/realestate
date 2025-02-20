import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import AuthUser from "@/components/Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { enquiryStatuses } from "@/components/post/PropertyData";
import withAuth from "@/utils/withAuth";
import { RiMapPinTimeLine } from "react-icons/ri";

const ITEMS_PER_PAGE = 10;

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [propertyCRM, setPropertyCRM] = useState([]);
    const [visibleProperties, setVisibleProperties] = useState(ITEMS_PER_PAGE);
    const [showModal, setShowModal] = useState({ type: null, visible: false });
    const [modalContent, setModalContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPages, setCurrentPages] = useState(0);
    const [noResultFound, setNoResultFound] = useState(false);


    const handleLoadMore = () => {
        setVisibleProperties((prev) => prev + ITEMS_PER_PAGE);
    };

    const memberId = GetMemberId();

    useEffect(() => {
        if(memberId) {
            fecthPropertyCRMData(memberId);
        }
    }, [memberId]);

    const fecthPropertyCRMData = async (memberId, loadMore, nextpage) => {
        if (!loadMore) {
            setLoading(true);
        }
        try {
            const response = await callApi({
                api: "/my_property_CRMS",
                method: "GET",
                data: {
                    user_id: memberId,
                    recent_page: nextpage || 1
                },
            });

            if (response && response.status === 1) {
                if (!loadMore) {
                    setPropertyCRM(response.data);
                } else {
                    setPropertyCRM(prev => {
                        return [
                            ...prev,
                            ...response?.data
                        ]
                    })
                }


                setTotalPages(response?.pagination?.total_pages || 0);
                setCurrentPages(response?.pagination?.current_page || 0)
            } else {
                setTotalPages(response?.pagination?.total_pages || 0);
                setCurrentPages(response?.pagination?.current_page || 0)
            }
        } catch (error) {
            console.error("Error fetching property CRM data: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (property, type) => {
        setModalContent(property);
        setShowModal({ type, visible: true });
    };

    const handleCloseModal = () => {
        setShowModal({ type: null, visible: false });
    };

    const handleDeleteProperty = async (enquiryId) => {
        try {
            const response = await callApi({
                api: `/delete_enquery?enquiry_id=${enquiryId}`,
                method: "POST",
            });

            if (response && response.status === 1) {
                toast.success(response.message || "Property deleted successfully");
                setPropertyCRM((prevProperties) =>
                    prevProperties.filter(
                        (property) => property.enquery_id !== enquiryId
                    )
                );
            } else {
                toast.error("Failed to delete property");
            }
        } catch (error) {
            console.error("Error deleting property: ", error);
            toast.error("An error occurred while deleting the property");
        }
    };

    const handleDeleteClick = (enquiryId) => {
        Swal.fire({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this property?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteProperty(enquiryId);
            }
        });
    };

    const getStatusLabel = (statusId) => {
        const status = enquiryStatuses.find(
            (item) => item.id === statusId.toString()
        );
        return status ? status.label : "Unknown Status";
    };

    const actionUpdateFunction = (id, data) => {
        const newArr = propertyCRM?.map((item) => {
            if (id === item?.enquery_id) {
                return {
                    ...item,
                    enquery_status: Number(data?.enq_status),
                    log_data: {
                        ...item?.log_data,
                        enquery_status: Number(data?.enq_status),
                        remarks: data?.remarks,
                        schedule_date: data?.date
                    }
                };
            } else {
                return item;
            }
        });

        setPropertyCRM(newArr);
    };

    const handleLoadMoreClick = (nextPage) => {
        setPerPage(nextPage);
        fecthPropertyCRMData(memberId, true, nextPage)
    }
    console.log("locading", loading);
    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary mb-3">Property CRM</h1>

                    {(!loading && propertyCRM.length === 0) && (
                        <div className="text-center text-muted">No data Records Found</div>
                    )} {propertyCRM?.length > 0 && (
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
                                                />
                                                <span
                                                    className={`ads-type ${property?.type}`}
                                                >
                                                    #{property?.property_id}
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
                                                            Actions
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
                                                        Read more
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
                            class="btn btn-primary btn-lg d-block mx-auto mt-4"
                            onClick={() => handleLoadMoreClick(perPage + 1)}
                        >
                            Load More
                        </button>
                    )}
                </div>
            </aside>

            <CRMEnquiry
                showModal={showModal}
                modalContent={modalContent}
                handleCloseModal={handleCloseModal}
                logData={modalContent?.log_data}
                fecthPropertyCRMData={fecthPropertyCRMData}
                enquiryId={modalContent?.enquery_id}
                actionUpdateFunction={actionUpdateFunction} />
        </DashboardLayout>
    );
};

export default withAuth(Index);
