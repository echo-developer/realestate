import React, { useState } from 'react';

const NearbyLocation = ({ pendingLocations, setPendingLocations }) => {
  const [newLocation, setNewLocation] = useState({
    name: '',
    distance: '',
    type: 'Healthcare', // default type
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation((prev) => ({ ...prev, [name]: value }));
  };

  const addLocation = () => {
    if (newLocation.name.trim() && newLocation.distance.trim()) {
      setPendingLocations((prev) => [...prev, newLocation]);
      setNewLocation({ name: '', distance: '', type: 'Healthcare' }); // Reset with default
    }
  };

  return (
    <div className="row gx-3">
      <div className="col-12 mb-3">
        <div className="row">
          <div className="col-md-4">
            <input
              type="text"
              name="name"
              value={newLocation.name}
              onChange={handleInputChange}
              placeholder="Location Name"
              className="form-control mb-2"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="distance"
              value={newLocation.distance}
              onChange={handleInputChange}
              placeholder="Distance (e.g., 1.2 km)"
              className="form-control mb-2"
            />
          </div>
          <div className="col-md-3">
            <select
              name="type"
              value={newLocation.type}
              onChange={handleInputChange}
              className="form-select mb-2"
            >
              <option value="healthcare">Healthcare</option>
              <option value="metro">Metro</option>
              <option value="rail">Railway</option>
              <option value="education">Education</option>
              <option value="bus">Bus</option>
              <option value="others">Others</option>
            
            </select>
          </div>
          <div className="col-md-2">
            <button
              onClick={addLocation}
              className="btn btn-success w-100"
              disabled={!newLocation.name.trim() || !newLocation.distance.trim()}
            >
              <i className="bi bi-plus-lg"></i> Add
            </button>
          </div>
        </div>
      </div>

      <div className="col-12">
        <h6 className="mb-2">Pending Locations</h6>
        <ul className="list-group">
          {pendingLocations.map((loc, idx) => (
            <li key={idx} className="list-group-item d-flex justify-content-between">
              <span>
                <strong>{loc.type}:</strong> {loc.name}
              </span>
              <span>{loc.distance ? `${loc.distance} km` : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NearbyLocation;
