import React from "react";

const RadioButtonGroup = ({ options, selectedValue, onChange, groupName }) => {
    return (
        <div
            className="btn-group btn-group-light d-flex mb-3"
            role="group"
            aria-label={groupName}
        >
            {options.map((option, index) => (
                <React.Fragment key={`radio_${groupName}_${index}`}>
                    <input
                        type="radio"
                        className="btn-check"
                        name={groupName}
                        id={`${groupName}_${option.value}`}
                        autoComplete="off"
                        checked={selectedValue === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    <label
                        className="btn btn-outline-light"
                        htmlFor={`${groupName}_${option.value}`}
                    >
                        {option.label}
                    </label>
                </React.Fragment>
            ))}
        </div>
    );
};

export default RadioButtonGroup;
