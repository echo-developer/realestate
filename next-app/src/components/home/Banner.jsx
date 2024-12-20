import React, { useState } from "react";
import Select from 'react-select';
import Link from "next/link";

const locations = [
  { value: 'Kolkata', label: 'Kolkata' },
  { value: 'Ajman', label: 'Ajman' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'Fujairah', label: 'Fujairah' },
  { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
  { value: 'Sharjah', label: 'Sharjah' },
  { value: 'Umm Al-Quwain', label: 'Umm Al-Quwain' },
  { value: 'Abu Dhabi', label: 'Abu Dhabi' }
];

const propertyTypes = ['Residential', 'Commercial'];
const propertyFor = {
  Residential: ['Flats', 'House/Villa', 'Penthouse', 'Residential Plots', 'Bungalow'],
  Commercial: ['Office Space', 'Shop/Showroom', 'Warehouse', 'Commercial Plot', 'Industrial Land', 'Hotels']
};
const budgets = ['$99 - $199', '$200 - $300', '$301 - $499', '$500 - $999', 'Above $1000'];
const sizes = ['0 - 250 sq ft', '251 sq ft - 350 sq ft', '351 sq ft - 500 sq ft', '501 sq ft - 1000 sq ft', 'Above 1000 sq ft'];
const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const parkingOptions = ['Available', 'Not Available'];

const Banner = () => {
  const [selectedTab, setSelectedTab] = useState("buy");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedParking, setSelectedParking] = useState("");

  const handleLocationChange = (selected) => setSelectedLocation(selected);
  const handlePropertyTypeChange = (event) => setSelectedPropertyType(event.target.value);
  const handlePropertyForChange = (event) => setSelectedPropertyFor(event.target.value);
  const handleBudgetChange = (event) => setSelectedBudget(event.target.value);
  const handleSizeChange = (event) => setSelectedSize(event.target.value);
  const handleBedroomsChange = (event) => setSelectedBedrooms(event.target.value);
  const handleParkingChange = (event) => setSelectedParking(event.target.value);

  const handleTabChange = (tab) => setSelectedTab(tab);

  const availableLocations = locations.filter(
    location => !selectedLocation.find(selected => selected.value === location.value)
  );

  return (
    <React.Fragment>
      <div className="clearfix"></div>
      <section
        className="banner"
        style={{ backgroundImage: "url('assets/images/banner-1.jpg')" }}
      >
        <div className="banner-layer">
          <div className="transparent-header-spacer" style={{ height: "50px" }}></div>
          <div className="container">
            <div className="banner-form">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-8 col-12">
                  <div className="headline">
                    <h1>Search A Home Which You’ll Love</h1>
                  </div>
                  <div className="search-form">
                    <ul className="nav nav-pills nav-justified" id="pills-tab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === 'buy' ? 'active' : ''}`}
                          onClick={() => handleTabChange('buy')}
                          type="button"
                          role="tab"
                        >
                          Buy
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === 'rent' ? 'active' : ''}`}
                          onClick={() => handleTabChange('rent')}
                          type="button"
                          role="tab"
                        >
                          Rent
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === 'land' ? 'active' : ''}`}
                          onClick={() => handleTabChange('land')}
                          type="button"
                          role="tab"
                        >
                          Land
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === 'commercial' ? 'active' : ''}`}
                          onClick={() => handleTabChange('commercial')}
                          type="button"
                          role="tab"
                        >
                          Commercial
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                      {selectedTab === 'buy' && (
                        <div className="tab-pane fade active show" id="pills-buy" role="tabpanel">
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                            <div className="col-lg-6 col-12">
                              <div className="form-field with-search1">
                                <Select
                                  isMulti
                                  name="locations"
                                  options={availableLocations}
                                  value={selectedLocation}
                                  onChange={handleLocationChange}
                                  getOptionLabel={(e) => e.label}
                                  getOptionValue={(e) => e.value}
                                  placeholder="Choose Location"
                                />
                              </div>
                            </div>

                            {/* Property Type Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyType}
                                  onChange={handlePropertyTypeChange}
                                >
                                  <option value="" disabled>Property Type</option>
                                  {propertyTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Property For Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyFor}
                                  onChange={handlePropertyForChange}
                                >
                                  <option value="" disabled>Property For</option>
                                  {Object.keys(propertyFor).map((category, index) => (
                                    <optgroup key={index} label={category}>
                                      {propertyFor[category].map((property, idx) => (
                                        <option key={idx} value={property}>{property}</option>
                                      ))}
                                    </optgroup>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Budget Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBudget}
                                  onChange={handleBudgetChange}
                                >
                                  <option value="" disabled>Budget</option>
                                  {budgets.map((budget, index) => (
                                    <option key={index} value={budget}>{budget}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Size Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedSize}
                                  onChange={handleSizeChange}
                                >
                                  <option value="" disabled>Size</option>
                                  {sizes.map((size, index) => (
                                    <option key={index} value={size}>{size}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Bedrooms Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBedrooms}
                                  onChange={handleBedroomsChange}
                                >
                                  <option value="" disabled>Bedrooms</option>
                                  {bedrooms.map((bedroom, index) => (
                                    <option key={index} value={bedroom}>{bedroom}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Parking Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="" disabled>Parking</option>
                                  {parkingOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <Link href='/property-listing'>
                            <button type="submit" className="btn btn-primary">Search</button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {selectedTab === 'rent' && (
                        <div className="tab-pane fade active show" id="pills-rent" role="tabpanel">
                          {/* Rent Form */} 
                          <div>Rent Form</div>
                        </div>
                      )}

                      {selectedTab === 'land' && (
                        <div className="tab-pane fade active show" id="pills-land" role="tabpanel">
                          {/* Land Form */} 
                          <div>Land Form</div>
                        </div>
                      )}

                      {selectedTab === 'commercial' && (
                        <div className="tab-pane fade active show" id="pills-commercial" role="tabpanel">
                          {/* Commercial Form */} 
                          <div>Commercial Form</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Banner;
