import React from "react";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const CompletionStatus = ({ completionPercentage, missingFields }) => {
  return (
    <div className="w-72 bg-white shadow-md p-4 rounded-md border">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Completion Status</h2>

      {/* Circular Progress Bar */}
      <div className="w-24 mx-auto mb-4">
        <CircularProgressbar
          value={completionPercentage}
          text={`${completionPercentage}%`}
          styles={buildStyles({
            textColor: "#228B22",
            pathColor: "#228B22",
            trailColor: "#d1d5db",
            textSize: "18px",
          })}
        />
      </div>

      {/* Info Message */}
      <p className="text-sm text-gray-700 font-medium text-center mb-3">
        Get 5 times more response! Just add the following
      </p>

      {/* Missing Fields */}
      <ul className="text-sm text-gray-700">
        {missingFields.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-red-600">
            <span className="flex items-center">
              ❗ <span className="ml-1">{item.name}</span>
            </span>
            <span>{item.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletionStatus;
