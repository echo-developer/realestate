import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import Select from "react-select";
import Locality from "../project/Locality";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";

const ProjectFilterPage = ({selectedLocation, setSelectedLocation, setPerPage }) => {
  const { callApi } = AuthUser();
  const router = useRouter();

  const [filters, setFilters] = useState({
    city_id: "",
    address: "",
    project_name: "",
    project_type: "",
    project_for: "",
    possession_status: "",
    min_price: "",
    max_price: "",
  });
const translation = useTranslation();
  const [errors, setErrors] = useState({});
  const [locationData, setLocationData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [possessionData, setPossessionData] = useState([]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    FetchPossessionData();
  }, []);

  const FetchPossessionData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_status`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPossessionData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch possession status data.");
    }
  };

  const handleLocationChange = (selectedOptions) => {
    setSelectedLocation(selectedOptions);
    const selectedCities = selectedOptions.map((option) => option.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      city_id: selectedCities.join(","),
    }));
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await callApi({
          api: "/get_property_cities",
          method: "GET",
        });
        if (response?.status === 1) {
          const formattedLocations = response.data.map((location) => ({
            value: location.city_id,
            label: location.name,
          }));
          setLocationData(formattedLocations);
        } else {
          toast.error(response?.message || "Error fetching locations");
        }
      } catch (error) {
        toast.error(error?.message || "Error fetching locations");
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    if (router?.isReady) {
      setFilters((prev) => ({
        ...prev,
        ...router?.query,
      }));
    
    }
  }, [router?.query]);

  useEffect(() => {
    if(router?.isReady) {
      const {city_id} = router?.query;
      let locationArr = [];
      if(city_id) {
        city_id?.split(",")?.forEach(item => {
          const obj = locationData?.find(data => data?.value == item);
          if(obj) {
            locationArr.push(obj);
          }
        })
      }
      if(locationArr?.length > 0) {
        setSelectedLocation(locationArr);
      }
    }
  }, [router?.query, locationData])

  useEffect(() => {
    const fetchPropertyTypeData = async () => {
      try {
        const response = await callApi({
          api: "/get_property_type",
          method: "GET",
        });
        if (response?.status === 1) {
          setPropertyTypeData(response?.data);
        } else {
          toast.error(response?.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPropertyTypeData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const queryString = Object.entries(filters)
      .filter(([key, value]) => value) 
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");
    if (queryString) {
      router.push(`/project-listing?${queryString}`);
    }
  };

  const setAddress = (place) => {
    setFilters(prev => {
      return {
        ...prev,
        address: place
      }
    })
  }

  return (
    <div>
      <div className="filterHeader">
        <h4> {translation?.filters ||"Filters"}</h4>
        <a className="float-end d-lg-none" id="filter" title="Filter">
          <i className="icon-feather-filter f20"></i>
        </a>
      </div>
      <div className="filter">
        <div className="acc-panel">
          <form id="projectSearchFilter" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="city">
              <Form.Label>{translation?.city ||"City"}</Form.Label>            
              <Select
                isMulti
                name="locations"
                options={locationData}
                value={selectedLocation}
                onChange={handleLocationChange}
                placeholder={translation?.choose_location ||"Choose Location"}
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999, // increase z-index here
                  }),
                }}
              />              
            </Form.Group>
            
            <Locality locality={filters?.address} setLocality={setAddress} />

            <FloatingLabel
              controlId="address"
              label={translation?.address || "Address"}
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="project_name"
                placeholder={translation?.project_name ||"Project Name"}
                value={filters.project_name}
                onChange={handleInputChange}
              />
            </FloatingLabel>

            <FloatingLabel
             controlId="project_name" 
             label={translation?.project_name ||"Project Name"}
             className="mb-3"
             >
              <Form.Select
                name="project_type"
                value={filters.project_type}
                onChange={handleInputChange}
              >
                <option value="">{translation?.select_property_type ||"Select Property Type"}</option>
                {propertyTypeData?.map((property, i) => (
                  <option value={property?.category_id} key={i}>
                    {property?.category_name || `${translation?.not_available ||"Not available"}`}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
             controlId="project_name" 
             label="Property For"
             className="mb-3"
             >
              <Form.Select
                name="project_for"
                value={filters.project_for}
                onChange={handleInputChange}
              >
                <option value="">{translation?.select_property_for ||"Select Property For"}</option>
                <option value="sale">{translation?.for_sale ||"For Sale"}</option>
                <option value="rent">{translation?.for_rent ||"For Rent"}</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
             controlId="project_name" 
             label="Possession Status"
             className="mb-3"
             >
              <Form.Select
                className={`${
                  errors.possession_status ? "is-invalid" : ""
                }`}
                name="possession_status"
                value={filters.possession_status}
                onChange={handleInputChange}
              >
                <option value="">{translation?.select_possession_status ||"Select Possession Status"}</option>
                {possessionData.map((option) => (
                  <option key={option.status_id} value={option.status_id}>
                    {option.status_name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
             controlId="project_name" 
             label="Possession Status"
             className="mb-3"
             >
              <Form.Select
                name="min_price"
                value={filters.min_price}
                onChange={handleInputChange}
              >
                <option value="">{translation?.min_budget ||"Min Budget"}</option>
                <option value="500000">5 Lakh</option>
                <option value="1000000">10 Lakh</option>
                <option value="2000000">20 Lakh</option>
                <option value="5000000">50 Lakh</option>
              </Form.Select>
            </FloatingLabel>

            <FloatingLabel
             controlId="project_name" 
             label="Possession Status"
             className="mb-3"
             >
              <Form.Select
                name="max_price"
                value={filters.max_price}
                onChange={handleInputChange}
              >
                <option value=""> {translation?.max_budget ||"Max Budget"}</option>
                <option value="1000000">10 Lakh</option>
                <option value="2000000">20 Lakh</option>
                <option value="5000000">50 Lakh</option>
                <option value="10000000">1 Cr</option>
              </Form.Select>
            </FloatingLabel>

            <div className="d-grid">
              <button type="submit" className="form-control btn btn-primary">
                {translation?.submit ||"Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilterPage;
