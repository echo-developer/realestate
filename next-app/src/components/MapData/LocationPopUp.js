'use client'

import { useEffect, useState } from 'react'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function LocationPopup() {
  const [userLocation, setUserLocation] = useState('')
  const locationList = ['Kolkata', 'Chennai', 'Delhi', 'Mumbai']

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchLocationDetails(latitude, longitude)
        },
        () => {
          console.error('Failed to get user location')
        }
      )
    }
  }, [])

  const fetchLocationDetails = async (lat, lon) => {
    const apiKey = 'YOUR_GOOGLE_API_KEY' // Replace with your actual Google API key
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`
      )
      const data = await response.json()
      const locationName =
        data.results[0]?.address_components.find((component) =>
          component.types.includes('locality')
        )?.long_name || 'Unknown Location'

      setUserLocation(locationName)
    } catch (error) {
      console.error('Error fetching location:', error)
    }
  }

  const handleSelectLocation = (location) => {
    setUserLocation(location)
  }

  return (
    <div className="d-flex align-items-center p-4">
      <DropdownButton
        title={`Location: ${userLocation || 'Choose Location'}`}
        onSelect={handleSelectLocation}
      >
        {locationList.map((location, index) => (
          <Dropdown.Item
            key={index}
            eventKey={location}
            active={location === userLocation}
          >
            {location}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  )
}
