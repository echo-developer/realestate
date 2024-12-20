"use client"
import React from 'react';
import Link from 'next/link';

const SearchForm = () => {
  const propertyOptions = [
    { label: 'Residential', types: ['Flats', 'Residential house', 'Villa', 'Builder floor Appt', 'Penthouse'] },
    { label: 'Commercial', types: ['Commercial office space', 'Warehouse', 'Office in IT park/Sez', 'Commercial shop', 'Commercial showroom'] },
    { label: 'Agricultural', types: ['Agricultural land', 'Farmhouse'] },
  ];

  return (
    <div className="container-fluid mt-3">
      <div className="row">
        <div className="col-12">
          <div className="search-form">
            <ul className="nav nav-pills justify-content-center mb-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="pills-buy-tab"
                  data-bs-toggle="pill"
                  href="#pills-buy"
                  role="tab"
                  aria-selected="true"
                >
                  Buy
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="pills-rent-tab"
                  data-bs-toggle="pill"
                  href="#pills-rent"
                  role="tab"
                  aria-selected="false"
                >
                  Rent
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link"
                  id="pills-pg-tab"
                  data-bs-toggle="pill"
                  href="#pills-pg"
                  role="tab"
                  aria-selected="false"
                >
                  PG
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
                  <select className="form-control">
                    <option>Property Type</option>
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Agricultural</option>
                  </select>
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-field">
                  <select className="form-control">
                    <option>Property Type For</option>
                    {propertyOptions.map((option) => (
                      <optgroup label={option.label} key={option.label}>
                        {option.types.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </optgroup>
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

        {/* Add similar forms for Buy and PG sections */}
      </div>
    </div>
  );
};

export default SearchForm;
