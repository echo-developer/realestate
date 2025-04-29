import React, { useEffect, useState } from 'react'
import AuthUser from '../Authentication/AuthUser';

const Locality = ({onSelectLocality}) => {
    const { callApi } = AuthUser();
    const [localitySearchInput, setLocalitySearchInput] = useState('');
    const [debouncedValue, setDebouncedValue] = useState('');
    const [localityList, setLocalityList] = useState([]);
    const [localityDropdown, setLocalityDropdown] = useState(false);


    useEffect(() => {
        if(!localitySearchInput) return;
        const timeout = setTimeout(() => {
            setDebouncedValue(localitySearchInput)
        }, 500)
        
        return () => {
            clearTimeout(timeout);
        }
    }, [localitySearchInput])

    const getGlobalLocalities = async (keyWord) => {
        try {
            const res = await callApi({
                api: `/global-localities`,
                method: 'GET',
                data: {
                    keyWord: keyWord
                }
            })

            if(res && res?.status == 1) {
                setLocalityList(prev => {
                    return [...prev, ...res?.data];
                })
            }
        } catch (error) {
            console.error(error?.message || "Something went wrong")
        }
    }


    useEffect(() => {
        if(!debouncedValue || debouncedValue?.length < 3) return;
        const getLocalityList = async () => {
            try {
               const res = await callApi({
                    api: `/stored-localities`,
                    method: 'GET',
                    data: {
                        keyWord: debouncedValue
                    }
                })
                if(res && res?.status == 1) {
                    setLocalityList(res?.data);
                    if(res.data?.length < 10) {
                        getGlobalLocalities(debouncedValue);
                    }
                }
            } catch (error) {
                console.error(error?.message || "Something went wrong")
            }
        }
        getLocalityList();
    }, [debouncedValue])


    const handleLocalityInputChange = (e) => {
        const { value } = e.target;
        setLocalitySearchInput(value);
        setLocalityDropdown(value ? true : false);
    }

    const handleLocalitySelect = (locality) => {
        if(!locality || locality == null) return;
        setLocalitySearchInput(locality?.name);
        setLocalityDropdown(false);
        onSelectLocality(locality)
    }

  return (
    <>
        <div className="form-field" style={{ position: 'relative' }}>
                          <input
                            className="form-control pac-target-input"
                            placeholder="Enter Locality"
                            type="text"
                            autoComplete="off"
                            value={localitySearchInput}
                            onChange={handleLocalityInputChange}
                          />
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
