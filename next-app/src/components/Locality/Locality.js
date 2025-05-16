'use client';
import React, { useEffect, useState } from 'react'
import AuthUser from '../Authentication/AuthUser';
import { useSearchParams } from 'next/navigation';

const Locality = ({ onSelectLocality, errors, defaultValue, city, type }) => {
  const { callApi } = AuthUser();
  const searchParams = useSearchParams();
  const [localitySearchInput, setLocalitySearchInput] = useState(defaultValue?.locality_name || '');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [localityList, setLocalityList] = useState([]);
  const [localityDropdown, setLocalityDropdown] = useState(false);
  const locality = searchParams.get('locality');


  useEffect(() => {
    if (!localitySearchInput) return;
    const timeout = setTimeout(() => {
      setDebouncedValue(localitySearchInput)
    }, 500)

    return () => {
      clearTimeout(timeout);
    }
  }, [localitySearchInput])

  useEffect(() => {
    if (locality) {
      const parsedLocality = JSON.parse(locality);
      setLocalitySearchInput(parsedLocality?.name)
    }
  }, [locality])

  const getGlobalLocalities = async (keyWord, city) => {
    try {
      const res = await callApi({
        api: `/global-localities`,
        method: 'GET',
        data: {
          keyWord: keyWord,
          city_id: city?.city_id || "",
          city_name: city?.name || "",
          city_latitude: city?.latitude || "",
          city_longitude: city?.longitude || ""
        }
      })

      if (res && res?.status == 1) {
        setLocalityList(prev => {
          return [...prev, ...res?.data];
        })
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }


  useEffect(() => {
    if (!debouncedValue || debouncedValue?.length < 3) return;
    const getLocalityList = async () => {
      try {
        const res = await callApi({
          api: `/stored-localities`,
          method: 'GET',
          data: {
            keyWord: debouncedValue,
            city_id: city?.city_id || "",
            city_name: city?.name || ""
          }
        })
        if (res && res?.status == 1) {
          setLocalityList(res?.data);
          if (res.data?.length < 10) {
            getGlobalLocalities(debouncedValue, city);
          }
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      }
    }
    // if (city) {
      getLocalityList();
    // }
  }, [debouncedValue, city])


  const handleLocalityInputChange = (e) => {
    const { value } = e.target;
    if(!value) {
      onSelectLocality({locality_id: ""})
    }
    setLocalitySearchInput(value);
    setLocalityDropdown(value ? true : false);
  }

  const handleLocalitySelect = (locality) => {
    if (!locality || locality == null) return;
    setLocalitySearchInput(locality?.name);
    setLocalityDropdown(false);
    onSelectLocality(locality)
  }

  return (
    <>
      <div className="form-field" style={{ position: 'relative' }}>
        <input
          className={`form-control pac-target-input ${errors?.locality && 'is-invalid'}`}
          placeholder="Enter Locality"
          type="text"
          autoComplete="off"
          value={localitySearchInput}
          onChange={handleLocalityInputChange}
        // readOnly={type ? !city : true}
        />
        {errors?.locality && (
          <div className="invalid-feedback">{errors.locality}</div>
        )}
        {localityDropdown && localityList?.length > 0 && (
          <ul className="suggestions-list" style={{
            position: 'absolute',
            border: '1px solid #ccc',
            maxHeight: '200px',
            overflowY: 'auto',
            width: '100%',
            backgroundColor: 'white',
            zIndex: 10,
            padding: '0',
            margin: '0',
          }}>
            {localityList.map((locality, index) => (
              <li
                key={index}
                style={{
                  padding: '8px',
                  cursor: 'pointer',
                }}
                // onClick={() => selectSuggestion(locality)}
                onClick={() => handleLocalitySelect(locality)}
              >
                {locality?.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

export default Locality
