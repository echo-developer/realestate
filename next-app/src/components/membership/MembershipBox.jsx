"use client"
import React from 'react'
import useTranslation from '@/hooks/useTranslation';
import { Button, Card} from "react-bootstrap";

const MembershipBox = ({ data, handleSelectPlan, currency, currencyCode }) => {
    const planGroups = data.reduce((acc, item) => {
        if (!acc[item.plan_name]) {
            acc[item.plan_name] = [];
        }
        acc[item.plan_name].push(item);
        return acc;
    }, {});
    const planGroupNames = Object.keys(planGroups);
    const translation = useTranslation();
    const allFeatures = [];
    data.forEach(item => {
        Object.keys(item.features).forEach(feature => {
            if (!['id', 'validity_days'].includes(feature) && !allFeatures.includes(feature)) {
                allFeatures.push(feature);
            }
        });
    });

    const formatFeatureName = (name) => {
        return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const formatPrice = (price) => {
        return `${currencyCode}${parseFloat(price).toFixed(2)}`;
    };
    const getPlanColumnClass = (planName, index) => {
        if (planName === 'Gold') return 'bg-warning-subtle';
        if (planName === 'Platinum') return 'bg-primary-subtle';
        return index % 2 === 0 ? 'bg-purple-subtle' : 'bg-secondary-subtle';
    };

    const shouldShowDiscount = (plan) => {
        const value = Number(plan.discount) > 0 && Number(plan.discounted_price) > 0;
        return value
    };


    return (
        <>
            <div className="ul-table-responsive membership d-none d-lg-block">
                <div className="ul-table">
                    <ul className="head">
                        <li>&nbsp;</li>
                        {planGroupNames.flatMap(planName =>
                            planGroups[planName].map((plan, index) => (
                                <li
                                    key={`${planName}-${plan.validity_days}`}
                                    className={getPlanColumnClass(planName, index)}
                                >
                                    <h4>{planName}
                                    {planName === 'Gold' && index === 0 && (
                                        <span
                                            className="material-icons-outlined ms-2"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="top"
                                            style={{ verticalAlign: "sub", cursor: "default" }}
                                            data-bs-original-title="Recommended"
                                        >recommend</span>
                                    )}
                                    </h4>
                                    <div className="small">{plan.validity_days} days</div>
                                </li>
                            ))
                        )}
                    </ul>

                    {/* Price Row */}
                    <ul>
                        <li>PRICE</li>
                        {planGroupNames.flatMap(planName =>
                            planGroups[planName].map(plan => (
                                <li key={`price-${planName}-${plan.validity_days}`}>
                                    {shouldShowDiscount(plan) ? (
                                        <>
                                            <strike>{formatPrice(plan.price)}</strike>
                                            <span className="badge bg-green ms-1">{parseFloat(plan.discount).toFixed(0)}% OFF</span>

                                            <br />
                                            <span className="text-price">{formatPrice(plan.discounted_price)}</span>
                                        </>
                                    ) : (
                                        <span className="text-price">{formatPrice(plan.price)}</span>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

                    {/* Feature Rows */}
                    {allFeatures.map(feature => (
                        <ul key={feature}>
                            <li>{formatFeatureName(feature)}</li>
                            {planGroupNames.flatMap(planName =>
                                planGroups[planName].map(plan => {
                                    const featureValue = plan.features[feature];
                                    return (
                                        <li key={`${planName}-${plan.validity_days}-${feature}`}>
                                            {typeof featureValue === 'string' ? (
                                                featureValue === 'Y' || featureValue === 'N' ? (
                                                    featureValue === 'Y' ? (
                                                        <i className="material-icons-outlined text-green">check</i>
                                                    ) : (
                                                        <i className="material-icons-outlined text-danger">close</i>
                                                    )
                                                ) : (
                                                    featureValue.trim() === '' ? '-' : featureValue
                                                )
                                            ) : featureValue === null || featureValue === undefined ? (
                                                'Unlimited'
                                            ) : featureValue === 0 ? (
                                                '-'
                                            ) : (
                                                featureValue
                                            )}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    ))}


                    {/* Select Buttons */}
                    <ul>
                        <li>&nbsp;</li>
                        {planGroupNames.flatMap(planName =>
                            planGroups[planName].map((plan, index) => (
                                <li key={`select-${planName}-${plan.validity_days}`}>
                                    <a
                                        className={`btn btn-sm btn-success ${planName === 'Gold' ? 'btn-outline-gold' :
                                            planName === 'Platinum' ? 'btn-outline-platinum' : 'btn-outline-plan-name'
                                            } w-75`}
                                        role="button"
                                        onClick={() => handleSelectPlan(plan)}
                                    >
                                        {translation?.select || "SELECT"}
                                    </a>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
            <div className="ul-table-responsive membership d-lg-none">
                <div className="ul-table">
                    {planGroupNames?.flatMap(planName =>
                        planGroups?.[planName]?.map((plan, index) => (
                            <Card 
                                key={`${planName}-${plan?.validity_days}`} 
                                className={`mb-4 border-0 shadow-sm ${getPlanColumnClass(planName, index)}`}
                            >
                                <Card.Header>
                                    <ul className="head mb-0 list-unstyled text-center">
                                        <li>
                                            <h4>{planName}
                                            {planName === 'Gold' && index === 0 && (
                                                <span
                                                    className="material-icons-outlined ms-2"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    style={{ verticalAlign: "sub", cursor: "default" }}
                                                    data-bs-original-title="Recommended"
                                                >recommend</span>
                                            )}
                                            </h4>
                                            <div className="small">{plan?.validity_days} Days</div>
                                        </li>
                                    </ul>
                                </Card.Header>
                                <Card.Body>
                                    <ul className="mb-2 list-unstyled text-center">
                                        <li>
                                            {shouldShowDiscount(plan) ? (
                                                <>
                                                    <strike>{formatPrice(plan?.price)}</strike>
                                                    <span className="badge bg-green ms-1">
                                                        {parseFloat(plan?.discount)?.toFixed(0)}% OFF
                                                    </span>
                                                    <br />
                                                    <span className="text-price">{formatPrice(plan?.discounted_price)}</span>
                                                </>
                                            ) : (
                                                <span className="text-price">{formatPrice(plan?.price)}</span>
                                            )}
                                        </li>
                                    </ul>

                                    {allFeatures?.map(feature => (
                                        <ul key={feature} className="mb-2 list-unstyled">
                                            <li className="d-flex justify-content-between align-items-center">
                                                <span>{formatFeatureName(feature)}</span>
                                                <b>
                                                    {(() => {
                                                        const featureValue = plan?.features?.[feature];
                                                        return typeof featureValue === 'string' ? (
                                                            featureValue === 'Y' ? (
                                                                <i className="material-icons-outlined text-green">check</i>
                                                            ) : featureValue === 'N' ? (
                                                                <i className="material-icons-outlined text-danger">close</i>
                                                            ) : (
                                                                featureValue.trim() === '' ? '-' : featureValue
                                                            )
                                                        ) : featureValue === null || featureValue === undefined ? (
                                                            'Unlimited'
                                                        ) : featureValue === 0 ? (
                                                            '-'
                                                        ) : (
                                                            featureValue
                                                        );
                                                    })()}
                                                </b>
                                            </li>
                                        </ul>
                                    ))}

                                    <ul className="list-unstyled text-center mt-3 mb-0">
                                        <li>
                                            <a
                                                className={`btn btn-primary ${planName === 'Gold' ? 'btn-warning' :
                                                    planName === 'Platinum' ? 'btn-outline-platinum' : 'btn-outline-plan-name'} w-100 py-2 fw-semibold`}
                                                role="button"
                                                onClick={() => handleSelectPlan(plan)}
                                            >
                                                {translation?.select || "SELECT"}
                                            </a>
                                        </li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        ))
                    )}

                </div>
            </div>



        </>
    )
}

export default MembershipBox