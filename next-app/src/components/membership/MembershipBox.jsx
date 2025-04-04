"use client"
import React from 'react'

const MembershipBox = ({ data, handleSelectPlan }) => {
    const planGroups = data.reduce((acc, item) => {
        if (!acc[item.plan_name]) {
            acc[item.plan_name] = [];
        }
        acc[item.plan_name].push(item);
        return acc;
    }, {});
    const planGroupNames = Object.keys(planGroups);
    
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
        return `AED${parseFloat(price).toFixed(2)}`;
    };
    const getPlanColumnClass = (planName, index) => {
        if (planName === 'Gold') return 'bg-warning';
        if (planName === 'Platinum') return 'bg-primary text-white';
        return index % 2 === 0 ? 'bg-purple text-white' : 'bg-secondary text-white';
    };

    const shouldShowDiscount = (plan) => {
        const value=Number(plan.discount) > 0 && Number(plan.discounted_price) > 0;
        return  value
    };
    

    return (
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
                                {planName}
                                {planName === 'Gold' && index === 0 && (
                                    <span
                                        className="material-icons-outlined"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        style={{ verticalAlign: "sub", cursor: "default" }}
                                        data-bs-original-title="Recommended"
                                    >
                                    </span>
                                )}
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
                                                featureValue === '' ? '-' : featureValue
                                            )
                                        ) : (
                                            featureValue ? featureValue : '-'
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
                                    className={`btn btn-sm btn-success ${
                                        planName === 'Gold' ? 'btn-outline-gold' : 
                                        planName === 'Platinum' ? 'btn-outline-platinum' : 'btn-outline-plan-name'
                                    } w-75`}
                                    role="button"
                                    onClick={() => handleSelectPlan(plan)}
                                >
                                    SELECT
                                </a>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    )
}

export default MembershipBox