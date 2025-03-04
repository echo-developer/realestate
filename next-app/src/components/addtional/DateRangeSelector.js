import React, { useState } from "react";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import originalMoment from "moment";
import { extendMoment } from "moment-range";

const moment = extendMoment(originalMoment);

const DateRangeSelector = () => {
  const today = moment();
  
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(moment.range(today.clone().subtract(7, "days"), today.clone()));

  // Handle Date Selection
  const onSelect = (newValue) => {
    setValue(newValue);
    setIsOpen(false); // Close picker after selection
  };

  return (
    <div>
      {/* Selected Date Display */}
      <div>
        <strong>Selection:</strong> {value.start.format("YYYY-MM-DD")} - {value.end.format("YYYY-MM-DD")}
      </div>

      {/* Toggle Button */}
      <div>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close Picker" : "Select Date Range"}
        </button>
      </div>

      {/* Date Picker (Shown only when isOpen) */}
      {isOpen && (
        <DateRangePicker
          value={value}
          onSelect={onSelect}
          singleDateRange={true}
        />
      )}
    </div>
  );
};

export default DateRangeSelector;
