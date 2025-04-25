'use client';
import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { Row, Col, } from 'react-bootstrap';
import AuthUser from '@/components/Authentication/AuthUser';
import { ShimmerContentBlock } from "react-shimmer-effects";

const index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [activeTab, setActiveTab] = useState('publish');
    const memberId = GetMemberId();
    const [adsList, setAdsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab && memberId) {
            const url = activeTab == 'publish' ? '/user-advertisements-list' : '/user-advertisement-requests';
            const getMyAdvertisements = async () => {
                setLoading(true);
                try {
                    const res = await callApi({
                        api: url,
                        method: "UPLOAD",
                        data: {
                            user_id: memberId,
                        }
                    })

                    if (res && res?.status == 1) {
                        setAdsList(res?.data || []);
                    } else {
                        setAdsList([])
                    }
                } catch (error) {
                    console.error(error?.message || "Something went wrong")
                } finally {
                    setLoading(false)
                }
            }
            getMyAdvertisements();
        }
    }, [activeTab, memberId])


    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">My Advertisement</h1>

                    <Row>
                        <Col sm>
                            <ul className="nav nav-underline mb-3 gap-4 align-items-center">
                                <li className='nav-item' onClick={() => setActiveTab('publish')}>
                                    <a className={`nav-link ${activeTab == 'publish' ? 'active' : ''}`} onClick={() => setActiveTab('publish')} role="button">
                                        Publish
                                    </a>
                                </li>
                                <li className='nav-item' onClick={() => setActiveTab('pending')}>
                                    <a className={`nav-link ${activeTab == 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')} role="button">
                                        Pending
                                    </a>
                                </li>
                            </ul>
                        </Col>
                    </Row>

                    <div className='list-display'>
                        {loading && (
                            <>
                                <ShimmerContentBlock
                                    title
                                    text
                                    cta
                                    thumbnailWidth={350}
                                    thumbnailHeight={50}
                                />
                                <ShimmerContentBlock
                                    title
                                    text
                                    cta
                                    thumbnailWidth={350}
                                    thumbnailHeight={50}
                                />
                            </>
                        )}
                        {!loading && adsList?.length > 0 && adsList?.map((ad, i) => {
                            return (
                                <>
                                    <div className="card mb-4 shadow-sm" key={i}>
                                        <div className="row g-0">
                                            {/* Ad Image Column */}
                                            <div className="col-md-3">
                                                <img
                                                    src={ad?.ad_image || ''}
                                                    className="img-fluid rounded-start h-100"
                                                    alt="Advertisement"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>

                                            {/* Ad Details Column */}
                                            <div className="col-md-9">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h5 className="card-title mb-1">Advertisement #{ad?.id || 'N/A'}</h5>
                                                            {ad?.ad_type && (
                                                                <span className="badge bg-secondary mb-2">{ad.ad_type}</span>
                                                            )}
                                                        </div>
                                                        {ad?.status && (
                                                            <span className={`badge ${ad.status === 'Completed' ? 'bg-success' :
                                                                ad.status === 'Rejected' ? 'bg-danger' :
                                                                    'bg-warning text-dark'
                                                                }`}>
                                                                {ad.status}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="row mt-2">
                                                        <div className="col-md-6">
                                                            <p className="mb-1"><strong>Property:</strong> {ad?.property_type || 'N/A'}</p>
                                                            <p className="mb-1">
                                                                <strong>Location:</strong>
                                                                {[ad?.locality, ad?.city].filter(Boolean).join(', ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong>Dates:</strong>
                                                                {ad?.start_date ? `${ad.start_date} to ${ad?.expire_date || ''}`.trim() : 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p className="mb-1">
                                                                <strong>Placement:</strong>
                                                                {[ad?.page, ad?.position].filter(Boolean).map((item, i) =>
                                                                    i === 0 ? item : `(${item} position)`
                                                                ).join(' ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1"><strong>Views:</strong> {ad?.views || '0'}</p>
                                                            <p className="mb-1"><strong>Impressions:</strong> {ad?.impressions || '0'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex justify-content-end mt-3">
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })}

                        {!loading && adsList?.length == 0 && (
                            <div className='card border-0 text-center'>
                                <div className="card-body">
                                    <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" loading="lazy" />
                                    <p className='text-muted'>No Advertisement Founds</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </DashboardLayout>
    )
}

export default index
