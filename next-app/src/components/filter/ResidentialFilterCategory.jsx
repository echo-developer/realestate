import React from 'react';

const options = {
  property_type: [
    { value: 'multi-story-appartment', label: 'Multi Story Apartment' },
    { value: 'Builder-floor', label: 'Builder Floor Apartment' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'Studio-appartment', label: 'Studio Apartment' },
    { value: 'service-appt', label: 'Service Apartment' },
    { value: 'villa', label: 'Villa' },
    { value: 'residential', label: 'Residential House' },
  ],
  posted_since: [
    { value: 'all', label: 'All' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-2-week', label: 'Last 2 Weeks' },
    { value: 'last-3-week', label: 'Last 3 Weeks' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-2-month', label: 'Last 2 Months' },
    { value: 'last-4-month', label: 'Last 4 Months' },
  ],
};

const ResidentialFilterCategory = ({
  handleButtonClick = () => {},
  handleCoverArea = () => {}, 
  handleAdvanceKey = () => {},
  covered = '',                
  selectedName = '',           
}) => {
  const renderButtons = (category) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {options[category]?.map(({ value, label }) => (
        <button
          key={value}
          className="btn btn-outline-secondary btn-sm"
          value={value}
          onClick={() => handleButtonClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        display: 'inline-flex',
        background: 'white',
        paddingTop: '5px',
        marginTop: '2px',
        position: 'absolute',
        right: '0',
        width: '700px',
        border: '1px solid #ddd',
        padding: '1rem',
        columnGap: '1rem',
      }}
    >
      <div>
        <ul className="list-group">
          <li
            className="list-group-item"
            name="super_area"
            onClick={handleCoverArea}
          >
            Covered Area
          </li>
          <li
            className="list-group-item"
            name="property_type"
            onClick={handleAdvanceKey}
          >
            Sub Property Type
          </li>
          <li
            className="list-group-item"
            name="posted_since"
            onClick={handleAdvanceKey}
          >
            Posted Since
          </li>
        </ul>
      </div>
      <div>
        {covered === 'super_area' && (
          <div>
            <span>Covered Area</span>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <span>Min and Max range controls here</span>
            </div>
          </div>
        )}
        {selectedName && options[selectedName] && (
          <div>
            <span>{selectedName.replace(/_/g, ' ')}</span>
            {renderButtons(selectedName)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentialFilterCategory;
