import React, { useState } from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import moment from "moment";
import { extendMoment } from "moment-range";
import LocalitySearch from "../MapData/LocalitySearch";

const extendedMoment = extendMoment(moment);

const EnquirySearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle Date Selection
  const handleDateSelect = (range) => {
    if (range) {
      setDateRange(range);
      setShowDatePicker(false);
    }
  };

  // Handle Search Action
  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Category:", category);
    console.log("Status:", status);
    console.log(
      "Date Range:",
      dateRange
        ? `${dateRange.start.format("YYYY-MM-DD")} - ${dateRange.end.format("YYYY-MM-DD")}`
        : "No Date Selected"
    );
  };

  // Clear Selected Date
  const clearDateRange = () => {
    setDateRange(null);
  };

  return (
    <div className="input-group mb-3">
      {/* Search Input */}
      <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
        <i className="bi bi-search"></i>
        <input
          type="text"
          className="form-control"
          placeholder="Search enquiry here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Dropdown */}
      {/* <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
        <i className="bi bi-list"></i>
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="general">General</option>
          <option value="finance">Finance</option>
          <option value="technical">Technical</option>
        </select>
      </div> */}
      <LocalitySearch/>

      {/* Status Dropdown */}
      <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
        <i className="bi bi-filter"></i>
        <select
          className="form-control"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Date Picker Toggle Button */}
      <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {dateRange
            ? `${dateRange.start.format("YYYY-MM-DD")} - ${dateRange.end.format("YYYY-MM-DD")}`
            : "Select Date Range"}
        </button>
        {dateRange && (
          <button className="btn btn-outline-danger ms-2" onClick={clearDateRange}>
            Clear
          </button>
        )}
      </div>

      {/* Show Date Picker */}
      {showDatePicker && (
        <div className="position-absolute bg-white shadow p-3">
          <DateRangePicker
            value={dateRange}
            onSelect={handleDateSelect}
            singleDateRange={true}
          />
        </div>
      )}

      {/* Search Button */}
      <button className="btn btn-primary" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default EnquirySearchFilter;
