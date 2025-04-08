import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import useTranslation from "@/hooks/useTranslation";

const BudgetRangeSlider = ({ minLimit = 200, maxLimit = 5000, step = 100, setMinBudget, setMaxBudget }) => {
  const [budgetRange, setBudgetRange] = useState([minLimit, maxLimit]);

  const handleRangeChange = (values) => {
    setBudgetRange(values);
    setMinBudget(values[0]);
    setMaxBudget(values[1]);
  };
const translation = useTranslation();
  useEffect(() => {
    setMinBudget(budgetRange[0]);
    setMaxBudget(budgetRange[1]);
  }, [budgetRange, setMinBudget, setMaxBudget]);

  return (
    <div className="budget-slider-container">
      <label className="form-label text-light">{`${translation?.budget_range ||"Budget Range"}: $${budgetRange[0]} - $${budgetRange[1]}`}</label>

      <div className="slider-wrapper">
        <RangeSlider
          min={minLimit}
          max={maxLimit}
          step={step}
          value={budgetRange}
          onInput={handleRangeChange}
          className="custom-range-slider"
        />
      </div>

      <div className="d-flex justify-content-between mt-2">
      </div>
    </div>
  );
};

export default BudgetRangeSlider;
