import { useState } from "react";

const RangeSlider = ({ min, max, step = 1, value, setValue, setMin, setMax }) => {
    const handleMinChange = (e) => {
        const newMin = Number(e.target.value);
        setMin(newMin);
        if (value < newMin) {
            setValue(newMin);
        }
    };

    const handleMaxChange = (e) => {
        const newMax = Number(e.target.value);
        setMax(newMax);
        if (value > newMax) {
            setValue(newMax);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div>
                <div className="w-64 text-sm font-medium flex justify-between">
                    <span>{min}</span>
                    <span>{max}</span>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-64"
                />
                <span className="text-lg font-medium">Value: {value}</span>

            </div>

            <div className="flex justify-between w-64 mt-2">
                <div className="flex flex-col items-center">
                    <label className="text-sm">Min</label>
                    <input
                        type="number"
                        value={min}
                        onChange={handleMinChange}
                        className="border p-1 w-20"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <label className="text-sm">Max</label>
                    <input
                        type="number"
                        value={max}
                        onChange={handleMaxChange}
                        className="border p-1 w-20"
                    />
                </div>
            </div>
        </div>
    );
};

export default RangeSlider;