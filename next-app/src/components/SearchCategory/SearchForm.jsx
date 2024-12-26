"use client";
import React from 'react';
import Link from 'next/link';

const SearchForm = ({ cityName, propertyType, propertyFor, postFor }) => {
    console.log(cityName, propertyFor, propertyType, postFor); // 2,3,4,'rent'

    const locations = [
        { key: 1, value: "kolkata", label: "Kolkata" },
        { key: 2, value: "ajman", label: "Ajman" },
        { key: 3, value: "dubai", label: "Dubai" },
        { key: 4, value: "fujairah", label: "Fujairah" },
        { key: 5, value: "ras-al-khaimah", label: "Ras Al Khaimah" },
        { key: 6, value: "sharjah", label: "Sharjah" },
        { key: 7, value: "umm-al-quwain", label: "Umm Al-Quwain" },
        { key: 8, value: "abu-dhabi", label: "Abu Dhabi" },
    ];

    const propertyTypes = [
        { category_id: 1, category_name: "Residential", category_key: "residential" },
        { category_id: 2, category_name: "Commercial", category_key: "commercial" },
        { category_id: 4, category_name: "Agricultural", category_key: "agricultural" },
    ];

    const propertyForOptions = [
        { sub_category_id: 1, sub_category_name: "Apartments / Flats", sub_category_key: "apartments--flats" },
        { sub_category_id: 2, sub_category_name: "Villas", sub_category_key: "villas" },
        { sub_category_id: 6, sub_category_name: "Residential House", sub_category_key: "residential-house" },
        { sub_category_id: 7, sub_category_name: "Builder Floor Apartment", sub_category_key: "builder-floor-apartment" },
        { sub_category_id: 8, sub_category_name: "Residential Land/ Plot", sub_category_key: "residential-land-plot" },
        { sub_category_id: 9, sub_category_name: "Penthouse", sub_category_key: "penthouse" },
        { sub_category_id: 10, sub_category_name: "Studio Apartment", sub_category_key: "studio-apartment" },
    ];

    const selectedLocation = locations.find((loc) => loc.key === cityName);
    const selectedPropertyType = propertyTypes.find((type) => type.category_id === propertyType);
    const selectedPropertyFor = propertyForOptions.find((option) => option.sub_category_id === propertyFor);
    const selectedPostFor = postFor;

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="search-form">
                        <ul className="nav nav-pills justify-content-center mb-3" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${postFor === 'buy' ? 'active' : ''}`}
                                    id="pills-buy-tab"
                                    data-bs-toggle="pill"
                                    href="#pills-buy"
                                    role="tab"
                                    aria-selected={postFor === 'buy'}
                                >
                                    Buy
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${postFor === 'rent' ? 'active' : ''}`}
                                    id="pills-rent-tab"
                                    data-bs-toggle="pill"
                                    href="#pills-rent"
                                    role="tab"
                                    aria-selected={postFor === 'rent'}
                                >
                                    Rent
                                </a>
                            </li>
                            <li className="nav-item" role="presentation">
                                <a
                                    className={`nav-link ${postFor === 'commercial' ? 'active' : ''}`}
                                    id="pills-commercial-tab"
                                    data-bs-toggle="pill"
                                    href="#pills-commercial"
                                    role="tab"
                                    aria-selected={postFor === 'commercial'}
                                >
                                    Commercial
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Rent Section */}
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-rent" role="tabpanel">
                    <form id="searchfilter">
                        <div className="row gx-2">
                            <div className="col-lg col-12">
                                <div className="form-field with-search address-box-wrap">
                                    <input
                                        type="text"
                                        className="form-control address-city address-box"
                                        placeholder="Search by Locality, Builder or a Project"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                                <div className="form-field">
                                    <select className="form-control" value={propertyType || ''}>
                                        <option>Property Type</option>
                                        {propertyTypes.map((type) => (
                                            <option key={type.category_id} value={type.category_key}>
                                                {type.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6 col-12">
                                <div className="form-field">
                                    <select className="form-control" value={propertyFor || ''}>
                                        <option>Property Type For</option>
                                        {propertyForOptions.map((option) => (
                                            <option key={option.sub_category_id} value={option.sub_category_key}>
                                                {option.sub_category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2 col-sm-6 col-12">
                                <div className="form-field">
                                    <button className="btn btn-secondary" type="button">Advanced</button>
                                </div>
                            </div>
                            <div className="col-lg-auto col-sm-6 col-12">
                                <div className="d-grid">
                                    <Link href="/" className="form-control btn btn-primary">
                                        Search
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* You can add similar forms for the "Buy" and "Commercial" sections */}
            </div>
        </div>
    );
};

export default SearchForm;
