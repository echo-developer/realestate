"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./home.css";
import dynamic from "next/dynamic";

import { useAuth } from "@/context/AuthProvider";
import useFetch from "@/hooks/useFetch";
import useTranslation from "@/hooks/useTranslation";
// import BannerFormRent from "./BannerFormRent";
import BannerFormSell from "./BannerFormSell";
import BannerFormRent from "./BannerFormRent";
import BannerFormProject from "./BannerFormProject";
// import BannerFormProject from "./BannerFormProject";
// const BannerFormRent = dynamic(() => import('./BannerFormRent'), { ssr: false });
// const BannerFormSell = dynamic(() => import('./BannerFormSell'), { ssr: false });
// const BannerFormProject = dynamic(() => import('./BannerFormProject'), { ssr: false });

const BannerForm = ({ handleClickOutside, dropdownState, setDropdownState, setIsOverlayVisible }) => {
    const router = useRouter();
    const translation = useTranslation();
    const { currency, defaultCity } = useAuth();
    const [selectedTab, setSelectedTab] = useState("sale");
    const [selectedPropertyType, setSelectedPropertyType] = useState("1");
    const [selectedPropertyFor, setSelectedPropertyFor] = useState("1");
    const [gender, setGender] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [error, setError] = useState("");
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");
    const [subBudget1Dropdown, setSubBudget1Dropdown] = useState(false);
    const [subBudget2Dropdown, setSubBudget2Dropdown] = useState(false);
    const [bedroom, setBedroom] = useState([]);
    const [bathroom, setBathroom] = useState([]);
    const [kitchens, setKitchens] = useState([]);
    const [selectedLocality, setSelectedLocality] = useState(null);
    const { data: PropertyTypeData = [] } = useFetch({ api: `/get_property_type` });
    const url = selectedPropertyType ? `/get_property_for/${selectedPropertyType}` : null;
    const { data: PropertyForData = [] } = useFetch({ api: url, deps: [selectedPropertyType]});


    const toggleDropdown = (key) => {
        setDropdownState(prevState => {
            const newState = { ...prevState };
            if (!newState[key]) {
                newState[key] = true;
                setIsOverlayVisible(true); // Show overlay when dropdown is open
            } else {
                newState[key] = false;
                setIsOverlayVisible(false); // Hide overlay when dropdown is closed
            }

            // Close other dropdowns when one is opened
            Object.keys(newState).forEach(k => {
                if (k !== key) newState[k] = false;
            });

            return newState;
        });
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        setSelectedPropertyType("1");
        setSelectedPropertyFor("1");
        setMaxBudget("");
        setMinBudget("")
        setSelectedLocality(null);
    };

    const onSelectLocality = (locality) => {
        setSelectedLocality(locality)
    }

    const handleBud1InputClick = (amount) => {
        setMinBudget(amount);
        setSubBudget1Dropdown((prevState) => !prevState);
    };

    const handleBud2InputClick = (amount) => {
        setMaxBudget(amount);
        setSubBudget2Dropdown((prevState) => !prevState);
    };

    const toggleSizeDropdown = (isOpen) => {
    }

    const resetSizes = () => {
        setMinSize("");
        setMaxSize("");
    };

    const applySizes = () => {
    };

    const resetSelection = () => {
        setBedroom([]);
        setBathroom([]);
        setKitchens([]);
    };

    const applySelection = () => {
    };

    const displayPropertyTyep = () => {
        let str = "";
        if (selectedPropertyType) {
            const category = PropertyTypeData?.find(
                (item) => item.category_id === Number(selectedPropertyType)
            );
            if (category) {
                str = category.category_name;
            }
        }
        if (selectedPropertyFor) {
            const subCategory = PropertyForData?.find(
                (item) => item?.sub_category_id === Number(selectedPropertyFor)
            );
            if (subCategory) {
                str += str ? ` - ${subCategory.sub_category_name}` : subCategory.sub_category_name;
            }
        }
        return str || "Residential";
    };

    const budgetOptions = [50000, 100000, 200000, 300000, 500000];


    const handleMinChange = (e) => {
        const value = e.target.value;
        setMinBudget(value);
        if (maxBudget && Number(value) > Number(maxBudget)) {
            setError("Min budget cannot be greater than max budget.");
        } else {
            setError("");
        }
        setSubBudget1Dropdown(false);
    };

    const handleMaxChange = (e) => {
        const value = e.target.value;
        setMaxBudget(value);
        if (minBudget && Number(value) < Number(minBudget)) {
            setError("Max budget cannot be less than min budget.");
        } else {
            setError("");
        }
        setSubBudget2Dropdown(false);
    };

    const handleBedRoomChange = (value) => {
        setBedroom((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const handleBathChange = (value) => {
        setBathroom((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };
    const handleKitchenChange = (value) => {
        setKitchens((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const resetBudget = () => {
        setMinBudget("");
        setMaxBudget("");
        setError("");
    };

    const applyBudget = () => {
        if (!error) {
        }
    };

    const getDisplayText = () => {
        if (minBudget && maxBudget) return `${currency}${minBudget} - ${currency}${maxBudget}`;
        if (minBudget) return `Min: ${currency}${minBudget}`;
        if (maxBudget) return `Max: ${currency}${maxBudget}`;
        return translation?.select_budget || "Select Budget";
    };

    const getDisplayAreaText = () => {
        if (minSize && maxSize) return `${minSize} - ${maxSize}`;
        if (minSize) return `Min: ${minSize}`;
        if (maxSize) return `Max: ${maxSize}`;
        return translation?.area_sqft || "Area (sqft)";
    };

    const handlePropertyTypeChange = (eventKey, e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPropertyType(eventKey);

        setTimeout(() => {
            setPropertyTypeDropDown(true);
        }, 0);
    };

    const handleReset = () => {
        setSelectedPropertyType("");
        setSelectedPropertyFor("");
    };

    const handlePropertyForChange = (selectedValue) => {
        setSelectedPropertyFor(selectedValue);
    };

    const handleSearch = () => {
        const url = buildSearchUrl();
        router.push(url);
    };

    const handleProjectSearch = () => {
        const updatedFilters = {};

        const objectToQueryString = (obj) => {
            return Object.entries(obj)
                .map(
                    ([key, value]) =>
                        `${key}=${encodeURIComponent(JSON.stringify(value ?? ""))}`
                )
                .join("&");
        };

        if (selectedLocality) {
            updatedFilters.locality = selectedLocality;
        }

        if (selectedPropertyType) {
            updatedFilters.project_type = selectedPropertyType;
        }

        if (minBudget) {
            updatedFilters.min_price = minBudget;
        }

        if (maxBudget) {
            updatedFilters.max_price = maxBudget;
        }


        const queryString = objectToQueryString(updatedFilters);
        const url = `/project-listing?${queryString}`;
        window.location.href = url;
    }

    const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const displayBedsBathKitchen = () => {
        const beds = bedroom || [];
        const baths = bathroom || [];
        const kits = kitchens || [];

        // Convert arrays to a comma-separated string if they have values
        const bedsText = beds.length > 0 ? `${beds.join(", ")} Beds` : "";
        const bathsText = baths.length > 0 ? `${baths.join(", ")} Baths` : "";
        const kitchensText = kits.length > 0 ? `${kits.join(", ")} Kits` : "";

        // Combine all values with a separator
        const selections = [bedsText, bathsText, kitchensText]
            .filter(Boolean)
            .join(" / ");

        return (
            selections ||
            `${translation?.beds_baths_kitchens || "Select Beds, Baths & Kitchens"}`
        );
    };

    const buildSearchUrl = () => {
        const params = {};

        if (selectedTab) params.post_for = selectedTab;

        if (gender) params.gender = gender;
        if (selectedLocality) {
            params.locality = JSON.stringify(selectedLocality);
        }
        if (selectedPropertyType) params.property_type = selectedPropertyType;
        if (selectedPropertyFor) params.property_for = selectedPropertyFor;
        if (minBudget) params.min_budget = minBudget;
        if (maxBudget) params.max_budget = maxBudget;
        if (bedroom && bedroom.length > 0)
            params.bedrooms = JSON.stringify(bedroom);
        if (bathroom && bathroom.length > 0)
            params.bathroom = JSON.stringify(bathroom);
        if (kitchens && kitchens.length > 0)
            params.kitchens = JSON.stringify(kitchens);

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value)
        );

        const queryString = new URLSearchParams(filteredParams).toString();

        let searchData = {};

        if (minSize && maxSize) {
            searchData = {
                ...searchData,
                min_carpet: minSize,
                max_carpet: maxSize,
            };
        }

        return `/property-listing?${queryString}${Object.keys(searchData).length
            ? `&searchData=${JSON.stringify(searchData)}`
            : ""
            }`;
    };


    return (
        <div className="search-form">
            <ul
                className="nav nav-pills nav-justified"
                id="pills-tab"
                role="tablist"
            >
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${selectedTab === "sale" ? "active" : ""
                            }`}
                        onClick={() => handleTabChange("sale")}
                        type="button"
                        role="tab"
                    >
                        {translation?.buy || "Buy"}
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${selectedTab === "rent" ? "active" : ""
                            }`}
                        onClick={() => handleTabChange("rent")}
                        type="button"
                        role="tab"
                    >
                        {translation?.rent || "Rent"}
                    </button>
                </li>

                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${selectedTab === "projects" ? "active" : ""
                            }`}
                        onClick={() => handleTabChange("projects")}
                        type="button"
                        role="tab"
                    >
                        {translation?.projects || "Projects"}
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="pills-tabContent">
                {selectedTab === "sale" && (
                    <BannerFormSell 
                        onSelectLocality={onSelectLocality}
                        defaultCity={defaultCity}
                        toggleDropdown={toggleDropdown}
                        dropdownState={dropdownState}
                        displayPropertyTyep={displayPropertyTyep}
                        selectedPropertyType={selectedPropertyType}
                        handlePropertyTypeChange={handlePropertyTypeChange}
                        PropertyTypeData={PropertyTypeData}
                        PropertyForData={PropertyForData}
                        selectedPropertyFor={selectedPropertyFor}
                        handlePropertyForChange={handlePropertyForChange}
                        handleReset={handleReset}
                        handleClickOutside={handleClickOutside}
                        translation={translation}
                        getDisplayText={getDisplayText}
                        minBudget={minBudget}
                        handleMinChange={handleMinChange}
                        subBudget1Dropdown={subBudget1Dropdown}
                        setSubBudget1Dropdown={setSubBudget1Dropdown}
                        budgetOptions={budgetOptions}
                        handleBud1InputClick={handleBud1InputClick}
                        maxBudget={maxBudget}
                        handleMaxChange={handleMaxChange}
                        subBudget2Dropdown={subBudget2Dropdown}
                        setSubBudget2Dropdown={setSubBudget2Dropdown}
                        handleBud2InputClick={handleBud2InputClick}
                        error={error}
                        resetBudget={resetBudget}
                        applyBudget={applyBudget}
                        getDisplayAreaText={getDisplayAreaText}
                        toggleSizeDropdown={toggleSizeDropdown}
                        minSize={minSize}
                        setMinSize={setMinSize}
                        maxSize={maxSize}
                        setMaxSize={setMaxSize}
                        resetSizes={resetSizes}
                        applySizes={applySizes}
                        displayBedsBathKitchen={displayBedsBathKitchen}
                        bedrooms={bedrooms}
                        bedroom={bedroom}
                        handleBedRoomChange={handleBedRoomChange}
                        bathroom={bathroom}
                        handleBathChange={handleBathChange}
                        kitchens={kitchens}
                        handleKitchenChange={handleKitchenChange}
                        resetSelection={resetSelection}
                        applySelection={applySelection}
                        handleSearch={handleSearch}
                    />
                )}

                 {selectedTab === "rent" && (
                        <BannerFormRent 
                            onSelectLocality={onSelectLocality}
                            PropertyTypeData={PropertyTypeData}
                            PropertyForData={PropertyForData}
                            defaultCity={defaultCity}
                            toggleDropdown={toggleDropdown}
                            dropdownState={dropdownState}
                            displayPropertyTyep={displayPropertyTyep}
                            selectedPropertyType={selectedPropertyType}
                            handlePropertyTypeChange={handlePropertyTypeChange}
                            selectedPropertyFor={selectedPropertyFor}
                            handlePropertyForChange={handlePropertyForChange}
                            handleReset={handleReset}
                            handleClickOutside={handleClickOutside}
                            getDisplayText={getDisplayText}
                            minBudget={minBudget}
                            handleMinChange={handleMinChange}
                            subBudget1Dropdown={subBudget1Dropdown}
                            setSubBudget1Dropdown={setSubBudget1Dropdown}
                            handleBud1InputClick={handleBud1InputClick}
                            maxBudget={maxBudget}
                            handleMaxChange={handleMaxChange}
                            subBudget2Dropdown={subBudget2Dropdown}
                            setSubBudget2Dropdown={setSubBudget2Dropdown}
                            handleBud2InputClick={handleBud2InputClick}
                            error={error}
                            resetBudget={resetBudget}
                            getDisplayAreaText={getDisplayAreaText}
                            toggleSizeDropdown={toggleSizeDropdown}
                            minSize={minSize}
                            setMinSize={setMinSize}
                            maxSize={maxSize}
                            setMaxSize={setMaxSize}
                            resetSizes={resetSizes}
                            displayBedsBathKitchen={displayBedsBathKitchen}
                            bedrooms={bedrooms}
                            bedroom={bedroom}
                            handleBedRoomChange={handleBedRoomChange}
                            bathroom={bathroom}
                            handleBathChange={handleBathChange}
                            kitchens={kitchens}
                            handleKitchenChange={handleKitchenChange}
                            resetSelection={resetSelection}
                            applySelection={applySelection}
                            handleSearch={handleSearch}
                            translation={translation}    
                            budgetOptions={budgetOptions}
                            />
                      )} 


                 {selectedTab === "projects" && (
                        <BannerFormProject 
                            onSelectLocality={onSelectLocality}
                            defaultCity={defaultCity}
                            toggleDropdown={toggleDropdown}
                            dropdownState={dropdownState}
                            displayPropertyTyep={displayPropertyTyep}
                            selectedPropertyType={selectedPropertyType}
                            handlePropertyTypeChange={handlePropertyTypeChange}
                            PropertyTypeData={PropertyTypeData}
                            handleReset={handleReset}
                            translation={translation}
                            handleClickOutside={handleClickOutside}
                            getDisplayText={getDisplayText}
                            minBudget={minBudget}
                            handleMinChange={handleMinChange}
                            setSubBudget1Dropdown={setSubBudget1Dropdown}
                            subBudget1Dropdown={subBudget1Dropdown}
                            budgetOptions={budgetOptions}
                            handleBud1InputClick={handleBud1InputClick}
                            maxBudget={maxBudget}
                            handleMaxChange={handleMaxChange}
                            setSubBudget2Dropdown={setSubBudget2Dropdown}
                            subBudget2Dropdown={subBudget2Dropdown}
                            handleBud2InputClick={handleBud2InputClick}
                            error={error}
                            resetBudget={resetBudget}
                            applyBudget={applyBudget}
                            handleProjectSearch={handleProjectSearch}
                        />
                      )} 
            </div>
        </div>
    )
}

export default BannerForm
