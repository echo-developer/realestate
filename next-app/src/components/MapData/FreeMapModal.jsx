'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

function ClickHandler({setPosition }) {
  useMapEvent('click', (e) => {
    setPosition([e.latlng.lat, e.latlng.lng]);
  });
  return null;
}

const FreeMapModal = ({  lat, lon, onLocationSelect }) => {
  const [position, setPosition] = useState([lat, lon]); 

  const fetchLocationDetails = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      // You can pass this to your parent:
      onLocationSelect({
        latitude: lat,
        longitude: lon,
        address: data.display_name,
        postcode: data.address.postcode,
        locality: data.address.suburb || data.address.neighbourhood || data.address.village,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country
      });
    } catch (error) {
      console.error("Error fetching location info:", error);
    }
  };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={position} draggable>
          <Popup>Drag me to adjust!</Popup>
        </Marker>

        <ClickHandler setPosition={setPosition} />
      </MapContainer>

      <button 
        onClick={() => fetchLocationDetails(position[0], position[1])}
        className="btn btn-primary mt-3"
      >
        Confirm Location
      </button>
    </div>
  );
};

export default FreeMapModal;
