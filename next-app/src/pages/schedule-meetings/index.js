"use client";
import React, { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthUser from '@/components/Authentication/AuthUser';
import { useRouter } from 'next/router';
import { constructNow } from 'date-fns';

const index = () => {
    const { callApi, GetMemberId } = AuthUser()
    const mermber_id = GetMemberId();
    const router = useRouter();
    const [list, setList] = useState([])


    useEffect(() => {
        if (router.isReady) {
            const { date } = router.query || {};
            fetchScheduleMeetings(date);
        }
    }, [router])

    const fetchScheduleMeetings = async (date) => {
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
        }
    }
    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    {list?.length > 0 && list?.map((item, i) => {
                        return (
                            <div className="card card-ads">
                                <div className="row g-0">
                                    <div className="col-lg-3 col-sm-4">
                                        {/* <CardImageSlider data={null} icons={false} showFavIcon={false} /> */}
                                    </div>
                                    <div className="col-lg-9 col-sm-8 position-relative">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h4>Not available</h4>
                                                <h6>Customer Name: Not available</h6>
                                                <div className="text-end">
                                                    <span className="badge">Status</span>
                                                    <br />
                                                </div>
                                            </div>
                                            <p>
                                                <span className="d-block">
                                                    <i className="bi bi-telephone"></i> Not available
                                                </span>
                                                <span className="d-block">
                                                    <i className="bi bi-envelope"></i> Not available
                                                </span>
                                                <span className="d-block">
                                                    <i className="bi bi-clock"></i> Not available
                                                </span>
                                            </p>
                                            <p className="text-wrap mb-2">No message</p>
                                            <div className="d-flex justify-content-end">
                                                <button className="btn btn-sm btn-outline-primary me-2">Contact</button>
                                                <button className="btn btn-sm btn-outline-primary me-2">Contact History</button>
                                                <select className="form-select form-select-sm ms-2" aria-label="Select action">
                                                    <option value="">Select an option</option>
                                                    <option value="1">Option 1</option>
                                                    <option value="2">Option 2</option>
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
