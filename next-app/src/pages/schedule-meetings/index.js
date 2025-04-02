"use client";
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthUser from '@/components/Authentication/AuthUser';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Link from 'next/link';
import useTranslation from '@/hooks/useTranslation';
import { Button } from 'react-bootstrap';

const index = () => {
    const { callApi, GetMemberId } = AuthUser()
    const mermber_id = GetMemberId();
    const router = useRouter();
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true);
    const translation = useTranslation();


    useEffect(() => {
        if (router.isReady) {
            const { date } = router.query || {};
            fetchScheduleMeetings(date);
        }
    }, [router])

    const statusClasses = {
        "0": "bg-warning",  // Yellow
        "1": "bg-success",    // Green
    };

    const fetchScheduleMeetings = async (date) => {
        setLoading(true);
        try {
            const res = await callApi({
                api: `/schedule-meeting-list`,
                method: "GET",
                data: {
                    user_id: mermber_id,
                    schedule_date: date,
                    recent_page: 1,
                }
            })

            if (res && res?.status === 1) {
                setList(res.data);
            } else {
                setList([]);
            }
        } catch (error) {
            console.error(error.message || "Something went wrong")
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (e, i, id) => {
        const { value } = e.target || {};

        try {
            const res = await callApi({
                api: '/update-meeting-status',
                method: "UPLOAD",
                data: {
                    id: id,
                    status: value
                }
            })
        if(res && res?.status === 1) {
            toast.success("Meeting status updated successfully")
            setList(prev => {
                return prev.map((item, index) => {
                    if(index !== i) {
                        return item;
                    } else {
                        return {
                            ...item,
                            status: value,
                        }
                    }
                })
            })
        } else {
            toast.error("Failed to update status")
        }
        } catch (error) {
           toast.error(error.message || "Something went wrong") 
        }
    }
    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                <h1 className="h4 text-primary mb-3">Schedule Meetings</h1>
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
                    {!loading && list?.length > 0 && list?.map((item, i) => {
                        return (
                            <div className="card card-ads" key={i}>
                                <div className="row g-0">
                                    <div className="col-lg-9 col-sm-8 position-relative">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h4>{item?.project_name || item?.property_name || "Not available"}</h4>
                                                <h6>Customer Name: {item?.customer_name || "Not available"}</h6>
                                                <div className="text-end">
                                                    <span className={`badge ${statusClasses[item?.status]}`}>{item?.status == 0 ? "Pending" : "Completed"}</span>
                                                    <br />
                                                </div>
                                            </div>
                                            <p>
                                                <span className="d-block">
                                                    <i className="bi bi-telephone"></i> {item?.customer_phone || "Not available"}
                                                </span>
                                                <span className="d-block">
                                                    <i className="bi bi-envelope"></i> {item?.customer_email || "Not available"}
                                                </span>
                                                <span className="d-block">
                                                    <i className="bi bi-clock"></i> Schedule Time: {item?.schedule_date || "Not available"}
                                                </span>
                                            </p>
                                            <p className="text-wrap mb-2">No message</p>
                                            <div className="d-flex justify-content-end">
                                                <Button>
                                                    <Link href={`/lead-details/${item?.assign_id}`}>Lead Details</Link>
                                                </Button>
                                                <select className="form-select form-select-sm ms-2" aria-label="Select action" value={item?.status} onChange={(e) => handleStatusChange(e, i, item.id)}>
                                                    <option value="">Select an option</option>
                                                    <option value={0}>Pending</option>
                                                    <option value={1}>Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        )
                    })}
                </div></aside>
        </DashboardLayout>
    )
}

export default index
