import React from "react";
import { Row, Col, Dropdown, Nav, ButtonGroup, Button, Form } from "react-bootstrap";
import Locality from "../Locality/Locality";

const BannerFormSell = ({
    onSelectLocality,
    defaultCity,
    toggleDropdown,
    dropdownState,
    displayPropertyTyep,
    selectedPropertyType,
    handlePropertyTypeChange,
    PropertyTypeData,
    PropertyForData,
    selectedPropertyFor,
    handlePropertyForChange,
    handleReset,
    handleClickOutside,
    translation,
    getDisplayText,
    minBudget,
    handleMinChange,
    subBudget1Dropdown,
    setSubBudget1Dropdown,
    budgetOptions,
    handleBud1InputClick,
    maxBudget,
    handleMaxChange,
    subBudget2Dropdown,
    setSubBudget2Dropdown,
    handleBud2InputClick,
    error,
    resetBudget,
    applyBudget,
    getDisplayAreaText,
    toggleSizeDropdown,
    minSize,
    setMinSize,
    maxSize,
    setMaxSize,
    resetSizes,
    applySizes,
    displayBedsBathKitchen,
    bedrooms,
    bedroom,
    handleBedRoomChange,
    bathroom,
    handleBathChange,
    kitchens,
    handleKitchenChange,
    resetSelection,
    applySelection,
    handleSearch,
}) => {
    return (
        <div
            className="tab-pane fade active show"
            id="pills-rent"
            role="tabpanel"
        >
            <div className="row gx-3">
                <Col lg={6}>
                    <Locality onSelectLocality={onSelectLocality} city={defaultCity} />
                </Col>

                <Col lg={6}
                    data-id="parent"
                    onClick={() => toggleDropdown('property_type')}
                >
                    <Dropdown
                        className="select-dropdown d-grid mb-3"
                        show={dropdownState?.property_type}
                    >
                        <Dropdown.Toggle
                            className="btn-form-control"
                            id="dropdown-basic"
                        >
                            {displayPropertyTyep()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-3 pt-0">

                            <div className="form-field">
                                <Nav
                                    variant="underline"
                                    activeKey={selectedPropertyType}
                                    onSelect={handlePropertyTypeChange}
                                >
                                    {PropertyTypeData && PropertyTypeData?.map((type) => (
                                        <Nav.Item key={type.category_id}>
                                            <Nav.Link
                                                role="button"
                                                eventKey={type.category_id}
                                            >
                                                {type.category_name}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </div>

                            <div className="scrollY mb-3">
                                <ButtonGroup className="btn-group-light hide-tick d-flex flex-wrap">
                                    {PropertyForData && PropertyForData?.map(
                                        (property, index) => (
                                            <div
                                                key={property.sub_category_id}
                                                className="me-2 mb-2"
                                            >
                                                <input
                                                    type="radio"
                                                    className="btn-check"
                                                    name="propertyForGroup"
                                                    id={`propertyFor-${index}`}
                                                    value={property.sub_category_id}
                                                    checked={
                                                        selectedPropertyFor ===
                                                        property.sub_category_id
                                                    }
                                                    onChange={() =>
                                                        handlePropertyForChange(
                                                            property.sub_category_id
                                                        )
                                                    }
                                                    readOnly={false}
                                                />
                                                <label
                                                    className="btn btn-outline-light btn-sm"
                                                    htmlFor={`propertyFor-${index}`}
                                                >
                                                    {property.sub_category_name}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </ButtonGroup>
                            </div>

                            <div className="d-flex justify-content-between">
                                <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                    }}
                                >
                                    {translation?.reset || "Reset"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                    }}
                                >
                                    {translation?.done || "Done"}
                                </Button>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                <Col lg={4} sm={6}
                    data-id="parent"
                    onClick={() => toggleDropdown('budget')}
                >
                    <Dropdown
                        className="select-dropdown d-grid mb-3"
                        show={dropdownState?.budget}
                    >
                        <Dropdown.Toggle
                            className="btn-form-control"
                            id="budget-dropdown"
                        >
                            {getDisplayText()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-3 shadow bg-white rounded">
                            <Row className="gx-2">
                                <Col className="col-6">
                                    <Form.Group className="dropdown minMax">
                                        <Form.Label>
                                            {translation?.min || "Min"}
                                        </Form.Label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="00"
                                            value={minBudget}
                                            onChange={handleMinChange}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent the dropdown from closing
                                                setSubBudget1Dropdown(true);
                                            }}
                                        />
                                        <Dropdown.Menu
                                            style={{
                                                display: subBudget1Dropdown
                                                    ? "block"
                                                    : "none",
                                                marginTop: "32px",
                                            }}
                                        >
                                            {budgetOptions.map((amount) => (
                                                <Dropdown.Item
                                                    key={amount}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation()
                                                        handleBud1InputClick(amount)
                                                    }
                                                    }
                                                >
                                                    ${amount}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Form.Group>
                                </Col>

                                <Col className="col-6">
                                    <Form.Group className="dropdown minMax">
                                        <Form.Label>
                                            {translation?.max || "Max"}
                                        </Form.Label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="00"
                                            value={maxBudget}
                                            onChange={handleMaxChange}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault()
                                                setSubBudget2Dropdown(true);
                                            }}
                                        />
                                        <Dropdown.Menu
                                            style={{
                                                display: subBudget2Dropdown
                                                    ? "block"
                                                    : "none",
                                                marginTop: "32px",
                                            }}
                                        >
                                            {budgetOptions.map((amount) => (
                                                <Dropdown.Item
                                                    key={amount}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation()
                                                        handleBud2InputClick(amount)
                                                    }
                                                    }
                                                >
                                                    ${amount}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {error && (
                                <div className="text-danger mt-2">
                                    {error}
                                </div>
                            )}

                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetBudget();
                                    }}
                                >
                                    {translation?.reset || "Reset"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        applyBudget();
                                        handleClickOutside();
                                    }}
                                    disabled={!!error}
                                >
                                    {translation?.done || "Done"}
                                </Button>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                <Col lg={4} sm={6} onClick={() => toggleDropdown('area_size')}>
                    <Dropdown
                        show={dropdownState?.area_size}
                        onToggle={toggleSizeDropdown}
                        className="select-dropdown d-grid mb-3"
                    >
                        <Dropdown.Toggle className="btn-form-control">
                            {getDisplayAreaText()}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-3 shadow bg-white rounded">
                            <Row className="gx-2">
                                <Col>
                                    <Form.Label>
                                        {translation?.min || "Min"}
                                    </Form.Label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder={translation?.min || "Min"}
                                        value={minSize}
                                        onChange={(e) =>
                                            setMinSize(e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label>
                                        {translation?.max || "Max"}
                                    </Form.Label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder={translation?.max || "Max"}
                                        value={maxSize}
                                        onChange={(e) =>
                                            setMaxSize(e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-between mt-3">
                                <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetSizes();
                                    }}
                                >
                                    {translation?.reset || "Reset"}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                        applySizes();
                                    }}
                                >
                                    {translation?.done || "Done"}
                                </Button>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>

                <Col lg={4} sm={6} onClick={() => toggleDropdown('bed_bath')}>
                    {selectedPropertyType !== "2" && (
                        <Dropdown
                            className="select-dropdown d-grid mb-3"
                            show={dropdownState?.bed_bath}
                        >
                            <Dropdown.Toggle className="btn-form-control">
                                {displayBedsBathKitchen()}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="shadow bg-white rounded">
                                <div className="scrollY p-3">
                                    <div className="mb-3">
                                        <label className="fw-bold mb-2">
                                            {translation?.beds || "Beds"}
                                        </label>
                                        <ButtonGroup className="btn-group-light hide-tick d-flex gap-2">
                                            {bedrooms.map((bedroomItem, index) => (
                                                <React.Fragment
                                                    key={`bedroom-${index}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        id={`bedroom-${index}`}
                                                        className="btn-check"
                                                        value={bedroomItem}
                                                        onChange={() =>
                                                            handleBedRoomChange(bedroomItem)
                                                        }
                                                        checked={bedroom.includes(
                                                            bedroomItem
                                                        )}
                                                    />
                                                    <label
                                                        className="btn btn-outline-light btn-sm"
                                                        htmlFor={`bedroom-${index}`}
                                                    >
                                                        {bedroomItem}
                                                    </label>
                                                </React.Fragment>
                                            ))}
                                        </ButtonGroup>
                                    </div>

                                    <div className="mb-3">
                                        <label className="fw-bold mb-2">
                                            {translation?.baths || "Baths"}
                                        </label>
                                        <ButtonGroup className="btn-group-light hide-tick d-flex gap-2">
                                            {[1, 2, 3, 4, 5, 6, 7, "8+"].map(
                                                (bath, index) => (
                                                    <div key={`bathroom-${index}`}>
                                                        <input
                                                            type="checkbox"
                                                            id={`bathroom-${index}`}
                                                            className="btn-check"
                                                            value={bath}
                                                            onChange={() =>
                                                                handleBathChange(bath)
                                                            }
                                                            checked={bathroom?.includes(
                                                                bath
                                                            )}
                                                        />
                                                        <label
                                                            className="btn btn-outline-light btn-sm"
                                                            htmlFor={`bathroom-${index}`}
                                                        >
                                                            {bath}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </ButtonGroup>
                                    </div>

                                    <div>
                                        <label className="fw-bold mb-2">
                                            {translation?.kitchens || "Kitchens"}
                                        </label>
                                        <ButtonGroup className="btn-group-light hide-tick d-flex gap-2">
                                            {[1, 2, 3, 4, 5].map(
                                                (kitchen, index) => (
                                                    <div key={`kitchen-${index}`}>
                                                        <input
                                                            type="checkbox"
                                                            id={`kitchen-${index}`}
                                                            className="btn-check"
                                                            value={kitchen}
                                                            onChange={() =>
                                                                handleKitchenChange(kitchen)
                                                            }
                                                            checked={kitchens?.includes(
                                                                kitchen
                                                            )}
                                                        />
                                                        <label
                                                            className="btn btn-outline-light btn-sm"
                                                            htmlFor={`kitchen-${index}`}
                                                        >
                                                            {kitchen}
                                                        </label>
                                                    </div>
                                                )
                                            )}
                                        </ButtonGroup>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between p-3">
                                    <Button
                                        size="sm"
                                        variant="outline-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resetSelection();
                                        }}
                                    >
                                        {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            applySelection();
                                            handleClickOutside();
                                        }}
                                    >
                                        {translation?.done || "Done"}
                                    </Button>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </Col>
            </div>

            <div className="d-grid d-sm-block text-center">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSearch()}
                >
                    {translation?.search || "Search"}
                </button>
            </div>
        </div>
    )
};


export default BannerFormSell;