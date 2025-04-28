'use client';
import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { Row, Col, } from 'react-bootstrap';
import AuthUser from '@/components/Authentication/AuthUser';
import { ShimmerContentBlock } from "react-shimmer-effects";
import { useAuth } from '@/context/AuthProvider';



const index = () => {
    const { userData } = useAuth();
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

    // console.log("user data", userData)
    const handleDeleteClick = async (id) => {
        try {
            const res = await callApi({
                api: '/delete-ad-request',
                method: "UPLOAD",
                data: {
                    user_id: userData?.id,
                    request_id: id
                }
            })
            if (res && res?.status == 1) {
                const list = adsList?.filter((item, i) => item.id !== id);
                setAdsList(list);
            }
        } catch (error) {
            console.error(error?.message || "something went wrong")
        }
    }


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
                        {!loading && activeTab == 'pending' && adsList?.length > 0 && adsList?.map((ad, i) => {
                            console.log("ad", ad)
                            return (
                                <>
                                    <div className="card mb-4 shadow-sm" key={i}>
                                        <div className="row g-0">
                                            {/* Placeholder Image Column */}
                                            <div className="col-md-3">
                                                <img
                                                    src={'/assets/images/property/default-property-1.jpg'}
                                                    className="img-fluid rounded-start h-100"
                                                    alt="Advertisement"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>

                                            {/* Details Column */}
                                            <div className="col-md-9">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h5 className="card-title mb-1">Ad by {ad?.name || 'N/A'}</h5>
                                                            <p className="mb-1 text-muted">{ad?.email || 'No email provided'}</p>
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
                                                            <p className="mb-1"><strong>Phone:</strong> +{ad?.phone_code || ''} {ad?.phone || 'N/A'}</p>
                                                            <p className="mb-1">
                                                                <strong>Location:</strong> {[ad?.locality, ad?.city].filter(Boolean).join(', ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1"><strong>Created Date:</strong> {ad?.created_date || 'N/A'}</p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p className="mb-1">
                                                                <strong>Placement:</strong> {[ad?.page, ad?.position].filter(Boolean).map((item, i) =>
                                                                    i === 0 ? item : `(${item} position)`
                                                                ).join(' ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1"><strong>Duration:</strong> {ad?.duration || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    {activeTab == "pending" && (
                                                        <div className="d-flex justify-content-end mt-3">
                                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(ad?.id)}>
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )
                        })}
                        {!loading && activeTab == 'publish' && adsList?.length > 0 && adsList?.map((ad, i) => {
                            return (
                                <>
                                    <div className="card mb-4 shadow-sm" key={i}>
                                        <div className="row g-0">
                                            {/* Placeholder Image Column */}
                                            <div className="col-md-3">
                                                <img
                                                    src={
                                                        ad?.ad_image
                                                            ||
                                                            '/assets/images/property/default-property-1.jpg'
                                                    }
                                                    className="img-fluid rounded-start h-100"
                                                    alt="Advertisement"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </div>

                                            {/* Details Column */}
                                            <div className="col-md-9">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h5 className="card-title mb-1">Ad Type: {ad?.ad_type || 'N/A'}</h5>
                                                            <p className="mb-1 text-muted">Property Type: {ad?.property_type || 'N/A'}</p>
                                                        </div>
                                                        {ad?.status && (
                                                            <span
                                                                className={`badge ${ad.status === 'Completed'
                                                                    ? 'bg-success'
                                                                    : ad.status === 'Rejected'
                                                                        ? 'bg-danger'
                                                                        : 'bg-warning text-dark'
                                                                    }`}
                                                            >
                                                                {ad.status}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="row mt-2">
                                                        <div className="col-md-6">
                                                            <p className="mb-1">
                                                                <strong>Location:</strong> {[ad?.locality, ad?.city].filter(Boolean).join(', ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong>Start Date:</strong> {ad?.start_date || 'N/A'}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong>Expire Date:</strong> {ad?.expire_date || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <p className="mb-1">
                                                                <strong>Placement:</strong>{' '}
                                                                {[ad?.page, ad?.position]
                                                                    .filter(Boolean)
                                                                    .map((item, i) => (i === 0 ? item : `(${item} position)`))
                                                                    .join(' ') || 'N/A'}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong>Views:</strong> {ad?.views || 0}
                                                            </p>
                                                            <p className="mb-1">
                                                                <strong>Impressions:</strong> {ad?.impressions || 0}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {activeTab === 'pending' && (
                                                        <div className="d-flex justify-content-end mt-3">
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeleteClick(ad?.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
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
