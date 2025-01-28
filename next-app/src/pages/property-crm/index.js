import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import AuthUser from "@/components/Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

const enquiryStatuses = [
    { id: "1", value: "No Answer", label: "No Answer" },
    { id: "2", value: "Lead", label: "Lead" },
    { id: "3", value: "Reject", label: "Reject" },
    { id: "4", value: "Accepted", label: "Accepted" },
    { id: "5", value: "Pending", label: "Pending" },
];

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [propertyCRM, setPropertyCRM] = useState([]);
    const [visibleProperties, setVisibleProperties] = useState(ITEMS_PER_PAGE);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCommunicationModal, setShowCommunicationModal] = useState(false);
    const [showRemarksModal, setShowRemarksModal] = useState(false);
    const [modalContent, setModalContent] = useState({});

    const handleLoadMore = () => {
        setVisibleProperties((prev) => prev + ITEMS_PER_PAGE);
    };

    const memberId = GetMemberId();

    useEffect(() => {
        fecthPropertyCRMData(memberId);
    }, [memberId]);

    const fecthPropertyCRMData = async (memberId) => {
        try {
            const response = await callApi({
                api: "/my_property_CRMS",
                method: "GET",
                data: {
                    user_id: memberId,
                },
            });

            if (response && response.status === 1) {
                setPropertyCRM(response.data);
            }
        } catch (error) {
            console.error("Error fetching property CRM data: ", error);
        }
    };

    const handleShowDetailsModal = (property) => {
        setModalContent(property);
        setShowDetailsModal(true);
    };

    const handleShowCommunicationModal = (property) => {
        setModalContent(property);
        setShowCommunicationModal(true);
    };

    const handleShowRemarksModal = (property) => {
        setModalContent(property);
        setShowRemarksModal(true);
    };

    const handleCloseModal = () => {
        setShowCommunicationModal(false);
        setShowRemarksModal(false);
        setShowDetailsModal(false);
    };

    const handleDeleteProperty = async (enquiryId) => {
        try {
            const response = await callApi({
                api: `/delete_enquery?enquiry_id=${enquiryId}`,
                method: "POST",
            });

            if (response && response.status === 1) {
                toast.success(
                    response.message || "Property deleted successfully"
                );
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
        const newArr = propertyCRM?.map((item, i) => {
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
                }
            } else {
                return item;
            }
        })

        setPropertyCRM(newArr);
    }

    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary mb-3">Property CRM</h1>

                    <div className="list-display">
                        {propertyCRM
                            .slice(0, visibleProperties)
                            .map((property, index) => (
                                <div className="card card-ads" key={index}>
                                    <div className="row g-0">
                                        <div className="col-lg-3 col-sm-4">
                                            <div className="card-image">
                                                <img
                                                    src={
                                                        property?.gallery[0]
                                                            ?.images[0]
                                                            ?.image_url
                                                    }
                                                    alt=""
                                                    className="card-img-top"
                                                />
                                                <span
                                                    className={`ads-type ${property?.type}`}
                                                >
                                                    #{property?.property_id}
                                                </span>
                                                <div className="card-img-overlay">
                                                    <h5>
                                                        {
                                                            property?.property_name
                                                        }
                                                    </h5>
                                                    <p className="mb-1">
                                                        <i className="bi bi-geo-alt text-white"></i>{" "}
                                                        {
                                                            property?.property_address
                                                        }
                                                    </p>
                                                    <ul className="list-info mb-0">
                                                        <li>
                                                            <i className="icon-img-bed"></i>{" "}
                                                            <span>
                                                                {
                                                                    property?.bedrooms
                                                                }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-ratio"></i>{" "}
                                                            <span>
                                                                {
                                                                    property?.carpet_area
                                                                }{" "}
                                                                sq m
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-tub"></i>{" "}
                                                            <span>
                                                                {
                                                                    property?.bathrooms
                                                                }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-garage"></i>{" "}
                                                            <span>
                                                                {
                                                                    property?.super_area
                                                                }
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-9 col-sm-8 position-relative">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h4>
                                                        {
                                                            property?.customer_name || "Not available"
                                                        }
                                                    </h4>
                                                    <div className="text-end ">
                                                        <span
                                                            className={`badge ${property?.enquery_status ==
                                                                    "1"
                                                                    ? "bg-primary"
                                                                    : property?.enquery_status ==
                                                                        "2"
                                                                        ? "bg-success"
                                                                        : property?.enquery_status ==
                                                                            "3"
                                                                            ? "bg-danger"
                                                                            : property?.enquery_status ==
                                                                                "4"
                                                                                ? "bg-info"
                                                                                : property?.enquery_status ==
                                                                                    "5"
                                                                                    ? "bg-warning"
                                                                                    : "bg-primary"
                                                                }`}
                                                        >
                                                            {getStatusLabel(
                                                                property?.enquery_status
                                                            )}
                                                        </span>

                                                        <br />
                                                        <a
                                                            className="btn btn-secondary btn-sm mt-1"
                                                            onClick={() =>
                                                                handleShowRemarksModal(
                                                                    property
                                                                )
                                                            }
                                                        >
                                                            Actions
                                                        </a>
                                                    </div>
                                                </div>
                                                <p className="d-flex gap-2">
                                                    <span>
                                                        <i className="bi bi-telephone"></i>{" "}
                                                        {property?.Phone}
                                                    </span>{" "}
                                                    <span>
                                                        <i className="bi bi-envelope"></i>{" "}
                                                        {property?.Email}
                                                    </span>{" "}
                                                    <span>
                                                        <i className="bi bi-clock"></i>{" "}
                                                        {useDateFormat(
                                                            property?.created_at
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="text-wrap mb-2">
                                                    {property?.message}
                                                </p>
                                                <div className="d-sm-flex">
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() =>
                                                            handleShowDetailsModal(
                                                                property
                                                            )
                                                        }
                                                    >
                                                        Read more
                                                    </button>
                                                    <Link
                                                        href={`/property-crm-schedule/${property?.enquery_id}`}
                                                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right"></i>
                                                    </Link>
                                                    <a
                                                        href="#"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                property?.enquery_id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {visibleProperties < propertyCRM.length && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={handleLoadMore}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>
                            {modalContent?.customer_name}{" "}
                            <span
                                className={`ads-type ${modalContent?.type}`}
                                style={{ position: "inherit" }}
                            >
                                #{modalContent?.property_id}
                            </span>
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="d-flex gap-3 mb-1">
                        <span>
                            <i className="bi bi-telephone text-primary"></i>{" "}
                            {modalContent?.Phone}
                        </span>{" "}
                        <span>
                            <i className="bi bi-envelope text-primary"></i>{" "}
                            {modalContent?.Email}
                        </span>
                    </p>
                    <hr />
                    <p>
                        {modalContent?.description ||
                            "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Communication Modal */}
            <Modal show={showCommunicationModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Communication</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CRMEnquiry
                        handleCloseModal={handleCloseModal}
                        logData={modalContent?.log_data}
                        fecthPropertyCRMData={fecthPropertyCRMData}
                        enquiryId={modalContent?.enquery_id}
                        actionUpdateFunction={actionUpdateFunction || "hello"}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Remarks Modal */}
            <Modal show={showRemarksModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Remarks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CRMEnquiry
                        handleCloseModal={handleCloseModal}
                        logData={modalContent?.log_data}
                        fecthPropertyCRMData={fecthPropertyCRMData}
                        enquiryId={modalContent?.enquery_id}
                        actionUpdateFunction={actionUpdateFunction || "hello"}
                    />
                </Modal.Body>
            </Modal>
        </DashboardLayout>
    );
};

export default Index;
