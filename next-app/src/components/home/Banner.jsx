"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Link from "next/link";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import Router from "next/router";
import { useRouter } from "next/navigation";
import LocalityOption from "../MapData/LocalitySelector";
import useTranslation from '../../hooks/useTranslation'

const budgets = [
  { key: 1, name: "$99 - $199" },
  { key: 2, name: "$200 - $300" },
  { key: 3, name: "$301 - $499" },
  { key: 4, name: "$500 - $999" },
  { key: 5, name: "Above $1000" },
];

const sizes = [
  { id: 1, key: JSON.stringify({ min_carpet: 0, max_carpet: 250 }), name: "0 - 250 sq ft" },
  { id: 2, key: JSON.stringify({ min_carpet: 251, max_carpet: 350 }), name: "251 sq ft - 350 sq ft" },
  { id: 3, key: JSON.stringify({ min_carpet: 351, max_carpet: 500 }), name: "351 sq ft - 500 sq ft" },
  { id: 4, key: JSON.stringify({ min_carpet: 501, max_carpet: 1000 }), name: "501 sq ft - 1000 sq ft" },
  { id: 5, key: JSON.stringify({ min_carpet: 1000 }), name: "Above 1000 sq ft" },
];

const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


const parkingOptions = [
  { slug: "available", name: "Available" },
  { slug: "not-available", name: `${translation?.not_available ||"Not available"}` },
];

const Banner = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const translation = useTranslation();
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
    if (selectedPropertyType == 2) {
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
    if (selectedTab !== "pg_hostel") {
      if (selectedPropertyType) params.property_type = selectedPropertyType;
      if (selectedPropertyFor) params.property_for = selectedPropertyFor;
    }
    if (selectedBudget) params.property_budget = selectedBudget;
    if (gender) params.gender = gender;
    if (locationData) {
      params.location_data = JSON.stringify(locationData)
    }

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    let searchData = {};
    if (selectedBudget) {
      const [min_budget, max_budget] = selectedBudget.match(/\d+/g).map(Number);
      searchData = {
        min_budget: min_budget,
        max_budget: max_budget
      }
    }
    if (selectedParking === "available") {
      searchData = {
        ...searchData,
        amenities: [1]
      }
    }
    if (selectedBedrooms) {
      searchData = {
        ...searchData,
        bedrooms: [Number(selectedBedrooms)]
      }
    }
    if (selectedSize) {
      searchData = {
        ...searchData,
        carpet_area: selectedSize
      }
    }

    if (selectedBudget || selectedParking || selectedBedrooms || selectedSize) {
      return `/property-listing?${queryString}&searchData=${JSON.stringify(searchData)}`;
    } else {
      return `/property-listing?${queryString}`;
    }
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
          <div className="container-lg">
            <div className="banner-form">
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-10 col-lg-11 col-12">
                  <div className="headline">
                    <h1>{translation?.search_home_you_love || "Search A Home Which You’ll Love"}</h1>
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
                         {translation?.rent || "Rent"} 
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
                          {translation?.buy || "Buy"} 
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
                           {translation?.pg_hostel || "PG/Hostel"} 
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
                          {translation?.new_projects || "New Projects"} 
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
                            <LocalityOption setLocationData={setLocationData} />

                            {/* Property Type Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyType}
                                  onChange={handlePropertyTypeChange}
                                >
                                  <option value="">{translation?.select_property_type || "Select Property Type"} </option>
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
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyFor}
                                  onChange={handlePropertyForChange}
                                >
                                  <option value="">{translation?.select_property_for || "Select Property For"}</option>
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
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBudget}
                                  onChange={handleBudgetChange}
                                >
                                  <option value="">{translation?.select_budget || "Select Budget"}</option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.name}>
                                      {budget.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Size Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedSize}
                                  onChange={handleSizeChange}
                                >
                                  <option value="">{translation?.select_size || "Select Size"}</option>
                                  {sizes.map((size) => (
                                    <option key={size.key} value={size.id}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            {/* Bedrooms Dropdown */}
                            {(selectedPropertyType !== "2") && (
                              <>
                                <div className="col-lg-3 col-6">
                                  <div className="form-field">
                                    <select
                                      className="form-select"
                                      value={selectedBedrooms}
                                      onChange={handleBedroomsChange}
                                    >
                                      <option value="">{translation?.select_bedrooms || "Select Bedrooms"}</option>
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
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="">{translation?.select_parking || "Select Parking"}</option>
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

                          <div className="d-grid d-sm-block text-center">
                            <button
                              type="button"
                              onClick={() => handleSearch()}
                              className="btn btn-primary"
                            >
                              {translation?.search || "Search"}
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
                            <LocalityOption setLocationData={setLocationData} />

                            {/* Property Type Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedPropertyType}
                                  onChange={handlePropertyTypeChange}
                                >
                                  <option value="" disabled>
                                  {translation?.property_type || "Property Type"}
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
                            <div className="col-lg-3 col-6">
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
                                     {translation?.property_for || "Property For"}
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
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBudget}
                                  onChange={handleBudgetChange}
                                >
                                  <option value="" disabled>
                                  {translation?.budget || "Budget"}
                                  </option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.name}>
                                      {budget.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Size Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedSize}
                                  onChange={handleSizeChange}
                                >
                                  <option value="" disabled>
                                  {translation?.size || "Size"}
                                  </option>
                                  {sizes.map((size) => (
                                    <option key={size.key} value={size.id}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Bedrooms Dropdown */}
                            {selectedPropertyType !== "2" && (
                              <div className="col-lg-3 col-6">
                                <div className="form-field">
                                  <select
                                    className="form-select"
                                    value={selectedBedrooms}
                                    onChange={handleBedroomsChange}
                                  >
                                    <option value="" disabled>
                                    {translation?.bedrooms || "Bedrooms"}
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
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="" disabled>
                                  {translation?.parking || "Parking"}
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

                          <div className="d-grid d-sm-block text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSearch()}
                            >
                              {translation?.search || "Search"}
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
                          <div>{translation?.land_form || "Land Form"}</div>
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
                            <LocalityOption setLocationDrata={setLocationData} />

                            {/* GENDER  */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select name="gender" className="form-select" value={gender} onChange={(e) => setGender(e?.target?.value)}>
                                  <option value="" disabled>
                                  {translation?.gender || "Gender"}
                                  </option>
                                  <option value="M">{translation?.boys || "Boys"}</option>
                                  <option value="F">{translation?.girls || "Girls"}</option>
                                </select>
                              </div>r
                            </div>
                            {/* Budget Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBudget}
                                  onChange={handleBudgetChange}
                                >
                                  <option value="" disabled>
                                  {translation?.budget || "Budget"}
                                  </option>
                                  {budgets.map((budget) => (
                                    <option key={budget.key} value={budget.key}>
                                      {budget.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>r

                            {/* Bedrooms Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedBedrooms}
                                  onChange={handleBedroomsChange}
                                >
                                  <option value="" disabled>
                                  {translation?.bedrooms || "Bedrooms"}
                                  </option>
                                  {bedrooms.map((bedroom, index) => (
                                    <option key={index} value={bedroom}>
                                      {bedroom}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>r

                            {/* Parking Dropdown */}
                            <div className="col-lg-3 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedParking}
                                  onChange={handleParkingChange}
                                >
                                  <option value="" disabled>
                                  {translation?.parking || "Parking"}
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

                          <div className="d-grid d-sm-block text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSearch()}
                            >
                              {translation?.search || "Search"}
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
