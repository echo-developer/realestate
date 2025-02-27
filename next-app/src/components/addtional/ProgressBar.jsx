import React from "react";
import { Line } from "rc-progress";

const ProgressBar = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100; // Dynamically calculate progress

  return (
    <div className="w-full">
      <Line
        percent={progress}
        strokeWidth={1}
        strokeColor="#3b82f6" // Tailwind's blue-500
        trailWidth={1}
        trailColor="#e5e7eb" // Tailwind's gray-200
      />
    </div>
  );
};

export default ProgressBar;
