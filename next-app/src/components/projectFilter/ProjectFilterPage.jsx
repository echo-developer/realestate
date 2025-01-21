import React, { useState } from "react";
import { useRouter } from "next/router";

const ProjectFilterPage = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    city: "",
    address: "",
    society_name: "",
    project_type: "",
    project_for: "",
    project_status: "",
    bhk_type: "",
    possession_date: "",
    min_price: "",
    max_price: "",
  });

  // Handle filter input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Create query string from non-empty filters
    const queryString = Object.entries(filters)
      .filter(([key, value]) => value) // Include only non-empty values
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    // Navigate to the results page
    if (queryString) {
      router.push(`/all-project?${queryString}`);
    }
  };

  return (
    <div>
      <div className="filterHeader">
        <h4>Filters</h4>
        <a className="float-end d-lg-none" id="filter" title="Filter">
          <i className="icon-feather-filter f20"></i>
        </a>
      </div>
      <div className="filter">
        <div className="card-header filterHeader d-lg-none">
          <div className="row d-flex">
            <div className="col">
              <a>Clear</a>
            </div>
            <div className="col text-center">
              <h4>Filters</h4>
            </div>
            <div className="col">
              <a className="close_filter" title="Filter">
                <i className="icon-feather-x f20"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="acc-panel">
          <form id="projectSearchFilter" onSubmit={handleSubmit}>
            {/* City Filter */}
            <div className="floating-label-group address-box-wrap ui-widget ui-ck">
              <input
                type="text"
                name="city"
                className="form-control address-box ui-autocomplete-input"
                placeholder=" "
                autoComplete="off"
                value={filters.city}
                onChange={handleInputChange}
              />
              <label className="floating-label" htmlFor="city">
                City
              </label>
            </div>

            {/* Address Filter */}
            <div className="floating-label-group address-box-wrap ui-widget ui-ck">
              <input
                type="text"
                name="address"
                className="form-control address-box ui-autocomplete-input"
                placeholder=" "
                autoComplete="off"
                value={filters.address}
                onChange={handleInputChange}
              />
              <label className="floating-label" htmlFor="address">
                Address
              </label>
            </div>

            {/* Society Name Filter */}
            <div className="floating-label-group address-box-wrap ui-widget ui-ck">
              <input
                type="text"
                name="society_name"
                className="form-control address-box ui-autocomplete-input"
                placeholder=" "
                autoComplete="off"
                value={filters.society_name}
                onChange={handleInputChange}
              />
              <label className="floating-label" htmlFor="society_name">
                Project Name
              </label>
            </div>

            {/* Project Type Filter */}
            <div className="form-field">
              <select
                className="form-control"
                name="project_type"
                value={filters.project_type}
                onChange={handleInputChange}
              >
                <option value="">Select Property Type</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
              </select>
            </div>

            {/* Project For Filter */}
            <div className="form-field">
              <select
                className="form-control"
                name="project_for"
                value={filters.project_for}
                onChange={handleInputChange}
              >
                <option value="">Select Property For</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* Project Status Filter */}
            <div className="form-field">
              <select
                className="form-control"
                name="project_status"
                value={filters.project_status}
                onChange={handleInputChange}
              >
                <option value="">Select Project Status</option>
                <option value="completed">Completed</option>
                <option value="under_construction">Under Construction</option>
              </select>
            </div>

            {/* Min and Max Price Filters */}
            <div className="form-field">
              <select
                className="form-control"
                name="min_price"
                value={filters.min_price}
                onChange={handleInputChange}
              >
                <option value="">Min Budget</option>
                <option value="500000">5 Lakh</option>
                <option value="1000000">10 Lakh</option>
                <option value="2000000">20 Lakh</option>
                <option value="5000000">50 Lakh</option>
              </select>
            </div>
            <div className="form-field">
              <select
                className="form-control"
                name="max_price"
                value={filters.max_price}
                onChange={handleInputChange}
              >
                <option value="">Max Budget</option>
                <option value="1000000">10 Lakh</option>
                <option value="2000000">20 Lakh</option>
                <option value="5000000">50 Lakh</option>
                <option value="10000000">1 Cr</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="form-control btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilterPage;
