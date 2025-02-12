"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Link from "next/link";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import Router from "next/router";
import { useRouter } from "next/navigation";
import LocalityOption from "../MapData/LocalitySelector";

const budgets = [
  { key: 1, name: "$99 - $199" },
  { key: 2, name: "$200 - $300" },
  { key: 3, name: "$301 - $499" },
  { key: 4, name: "$500 - $999" },
  { key: 5, name: "Above $1000" },
];

const sizes = [
  { key: 1, name: "0 - 250 sq ft" },
  { key: 2, name: "251 sq ft - 350 sq ft" },
  { key: 3, name: "351 sq ft - 500 sq ft" },
  { key: 4, name: "501 sq ft - 1000 sq ft" },
  { key: 5, name: "Above 1000 sq ft" },
];

const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const parkingOptions = [
  { slug: "available", name: "Available" },
  { slug: "not-available", name: "Not Available" },
];

const Banner = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const [locationData, setLocationData] = useState(null);
  const [PropertyTypeData, setPropertyTypeData] = useState([]);
  const [PropertyForData, setPropertyForData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("rent");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("1");
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("1");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedParking, setSelectedParking] = useState("");
  const [gender, setGender] = useState("");
  const [showBedParking, setShowBedParking] = useState(true);

  const handlePropertyTypeChange = (event) =>
    setSelectedPropertyType(event.target.value);
  const handlePropertyForChange = (event) =>
    setSelectedPropertyFor(event.target.value);
  const handleBudgetChange = (event) => setSelectedBudget(event.target.value);
  const handleSizeChange = (event) => setSelectedSize(event.target.value);
  const handleBedroomsChange = (event) =>
    setSelectedBedrooms(event.target.value);
  const handleParkingChange = (event) => setSelectedParking(event.target.value);

  useEffect(() => {
    FetchPropertyTypeData();
  }, []);

  useEffect(() => {
    if (selectedPropertyType) {
      FetchPropertyForData();
    }
  }, [selectedPropertyType]);




  useEffect(() => {
    if(selectedPropertyType == 2) {
      setShowBedParking(false);
      setSelectedBedrooms("");
    } else {
      setShowBedParking(true);
    }
  }, [selectedPropertyType])

  const FetchPropertyTypeData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_type`,
        method: "GET",
      });
      if (response && response.data) {
        setPropertyTypeData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const FetchPropertyForData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_for/${selectedPropertyType}`,
        method: "GET",
      });
      if (response && response.data) {
        setPropertyForData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === "projects") {
      router.push("/project-listing");
    } else {
      setSelectedTab(tab);
    }
  };
  const buildSearchUrl = () => {
    const params = {};
      if (selectedTab) params.post_for = selectedTab;
      if (selectedLocation.length) params.city_id = setLocationData;
      if (selectedPropertyType) params.property_type = selectedPropertyType;
      if (selectedPropertyFor) params.property_for = selectedPropertyFor;
      if (selectedBudget) params.property_budget = selectedBudget;
      if (selectedSize) params.property_size = selectedSize;
      if (selectedBedrooms) params.bedrooms = selectedBedrooms;
      if (selectedParking) params.parking = selectedParking;
      if (gender) params.gender = gender;
      // if(locationData?.length > 0) {
      //   params.location_data = encodeURIComponent(JSON.stringify(locationData))
      // }
      if(locationData) {
        params.location_data = JSON.stringify(locationData)
      }

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(filteredParams).toString();
    return `/property-listing?${queryString}`;
  };

  const handleSearch = () => {
    const url = buildSearchUrl();
    router.push(url);
  };

  return (
    <React.Fragment>
      <div className="clearfix"></div>
      <section
        className="banner"
        style={{ backgroundImage: "url('assets/images/banner-1.jpg')" }}
      >
        <div className="banner-layer">
          <div
            className="transparent-header-spacer"
            style={{ height: "50px" }}
          ></div>
          <div className="container">
            <div className="banner-form">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-8 col-12">
                  <div className="headline">
                    <h1>Search A Home Which You’ll Love</h1>
                  </div>
                  <div className="search-form">
                    <ul
                      className="nav nav-pills nav-justified"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === "rent" ? "active" : ""
                            }`}
                          onClick={() => handleTabChange("rent")}
                          type="button"
                          role="tab"
                        >
                          Rent
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === "sell" ? "active" : ""
                            }`}
                          onClick={() => handleTabChange("sell")}
                          type="button"
                          role="tab"
                        >
                          Buy
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === "pg_hostel" ? "active" : ""
                            }`}
                          onClick={() => handleTabChange("pg_hostel")}
                          type="button"
                          role="tab"
                        >
                          PG/Hostel
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${selectedTab === "projects" ? "active" : ""
                            }`}
                          onClick={() => handleTabChange("projects")}
                          type="button"
                          role="tab"
                        >
                          New Projects
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                      {selectedTab === "sell" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-buy"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                           <LocalityOption setLocationData={setLocationData}/>

                            {/* Property Type Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyType}
                                  onChange={handlePropertyTypeChange}
                                >
                                  <option value="">Select Property Type</option>
                                  {PropertyTypeData.map((type) => (
                                    <option
                                      key={type.category_id}
                                      value={type.category_id}
                                    >
                                      {type.category_name}
                                    </option>
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
                                  <option value="">Select Property For</option>
                                  {PropertyForData.map((property) => (
                                    <option
                                      key={property.sub_category_id}
                                      value={property.sub_category_id}
                                    >
                                      {property.sub_category_name}
                                    </option>
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
                                  <option value="">Select Budget</option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.key}>
                                      {budget.name}
                                    </option>
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
                                  <option value="">Select Size</option>
                                  {sizes.map((size) => (
                                    <option key={size.key} value={size.key}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            {/* Bedrooms Dropdown */}
                            {(selectedPropertyType !== "2") && (
                              <>
                               <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBedrooms}
                                  onChange={handleBedroomsChange}
                                >
                                  <option value="">Select Bedrooms</option>
                                  {bedrooms.map((bedroom, index) => (
                                    <option key={index} value={bedroom}>
                                      {bedroom}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                             
                              </>
                             
                            )}
                            {/* Parking Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="">Select Parking</option>
                                  {parkingOptions.map((option) => (
                                    <option
                                      key={option.slug}
                                      value={option.slug}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                           
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              onClick={() => handleSearch()}
                              className="btn btn-primary"
                            >
                              Search
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedTab === "rent" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-rent"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                           <LocalityOption setLocationData={setLocationData}/>

                            {/* Property Type Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyType}
                                  onChange={handlePropertyTypeChange}
                                >
                                  <option value="" disabled>
                                    Property Type
                                  </option>
                                  {PropertyTypeData.map((type) => (
                                    <option
                                      key={type.category_id}
                                      value={type.category_id}
                                    >
                                      {type.category_name}
                                    </option>
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
                                // disabled={
                                //     selectedPropertyType
                                // }
                                >
                                  <option
                                    value=""
                                  // disabled
                                  >
                                    Property For
                                  </option>
                                  {PropertyForData.map((property) => (
                                    <option
                                      key={property.sub_category_id}
                                      value={property.sub_category_id}
                                    >
                                      {property.sub_category_name}
                                    </option>
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
                                  <option value="" disabled>
                                    Budget
                                  </option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.key}>
                                      {budget.name}
                                    </option>
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
                                  <option value="" disabled>
                                    Size
                                  </option>
                                  {sizes.map((size) => (
                                    <option key={size.key} value={size.key}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Bedrooms Dropdown */}
                            {selectedPropertyType !== "2" && (
                              <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBedrooms}
                                  onChange={handleBedroomsChange}
                                >
                                  <option value="" disabled>
                                    Bedrooms
                                  </option>
                                  {bedrooms.map((bedroom, index) => (
                                    <option key={index} value={bedroom}>
                                      {bedroom}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            )}

                            {/* Parking Dropdown */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="" disabled>
                                    Parking
                                  </option>
                                  {parkingOptions.map((option) => (
                                    <option
                                      key={option.slug}
                                      value={option.slug}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSearch()}
                            >
                              Search
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedTab === "land" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-land"
                          role="tabpanel"
                        >
                          {/* Land Form */}
                          <div>Land Form</div>
                        </div>
                      )}

                      {selectedTab === "pg_hostel" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-pg_hostel"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                           <LocalityOption setLocationData={setLocationData}/>

                            {/* GENDER  */}
                            <div className="col-lg-3 col-sm-6 col-12">
                              <div className="form-field">
                                <select name="gender" className="form-select" value={gender} onChange={(e) => setGender(e?.target?.value)}>
                                <option value="" disabled>
                                    Gender
                                  </option>
                                  <option value="M">Boys</option>
                                  <option value="F">Girls</option>
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
                                  <option value="" disabled>
                                    Budget
                                  </option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.key}>
                                      {budget.name}
                                    </option>
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
                                  <option value="" disabled>
                                    Bedrooms
                                  </option>
                                  {bedrooms.map((bedroom, index) => (
                                    <option key={index} value={bedroom}>
                                      {bedroom}
                                    </option>
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
                                  <option value="" disabled>
                                    Parking
                                  </option>
                                  {parkingOptions.map((option) => (
                                    <option
                                      key={option.slug}
                                      value={option.slug}
                                    >
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSearch()}
                            >
                              Search
                            </button>
                          </div>
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
