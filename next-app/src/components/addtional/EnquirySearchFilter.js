import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import React, { useState } from "react";
import moment from "moment";
import LocalitySearch from "../MapData/LocalitySearch";
import { Row, Col } from "react-bootstrap";

const EnquirySearchFilter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState(null); // Correct initial state

  // Handle Date Change
  const handleDateChange = (value) => {
    setDateRange(value);
  };

  // Handle Search Action
  const handleSearch = () => {
    console.log("Search Term:", searchTerm);
    console.log("Status:", status);
    console.log(
      "Date Range:",
      dateRange && dateRange[0] && dateRange[1]
        ? `${moment(dateRange[0]).format("YYYY-MM-DD")} ~ ${moment(dateRange[1]).format("YYYY-MM-DD")}`
        : "No Date Selected"
    );
  };

  return (
    <Row className="gx-3 mb-3">
      {/* Search Input */}
      <Col>
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
      </Col>

      <Col><LocalitySearch /></Col>

      {/* Status Dropdown */}
      <Col>
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
      </Col>

      {/* Date Range Picker */}
      <Col>
        <DateRangePicker
          format="yyyy-MM-dd"
          showHeader={false}
          value={dateRange}
          onChange={handleDateChange}
          placeholder="Select Date Range"
          placement='bottomEnd'
        />
      </Col>

      {/* Search Button */}
      <Col className='col-lg-auto'>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </Col>
    </Row>
  );
};

export default EnquirySearchFilter;
