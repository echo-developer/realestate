import React from "react";
import {
    Row,
    Col,
    Dropdown,
    Nav,
    Button,
    Form
} from "react-bootstrap";
import Locality from "../Locality/Locality";

const BannerFormProject = ({
    onSelectLocality,
    defaultCity,
    toggleDropdown,
    dropdownState,
    displayPropertyTyep,
    selectedPropertyType,
    handlePropertyTypeChange,
    PropertyTypeData = [],
    handleReset,
    translation,
    handleClickOutside,
    getDisplayText,
    minBudget,
    handleMinChange,
    setSubBudget1Dropdown,
    subBudget1Dropdown,
    budgetOptions = [],
    handleBud1InputClick,
    maxBudget,
    handleMaxChange,
    setSubBudget2Dropdown,
    subBudget2Dropdown,
    handleBud2InputClick,
    error,
    resetBudget,
    applyBudget,
    handleProjectSearch
}) => {
    return (
        <div
            className="tab-pane fade active show"
            id="pills-rent"
            role="tabpanel"
        >
            <div className="row gx-3">
                <div className="col-lg-6 col-12">
                    <Locality onSelectLocality={onSelectLocality} city={defaultCity} />
                </div>
                <Col
                    className="col-lg-6 col-12"
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

                        <Dropdown.Menu className="p-3">
                            <div className="form-field">
                                <Nav
                                    variant="underline"
                                    activeKey={selectedPropertyType}
                                    onSelect={handlePropertyTypeChange}
                                >
                                    {PropertyTypeData?.map((type) => (
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

                            <div className="d-flex justify-content-between mt-3">
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

            </div>
            <div className="row gx-3">
                <Col lg={4} sm={6} data-id="parent" onClick={() => toggleDropdown('budget')}>
                    <Dropdown className="select-dropdown d-grid mb-3" show={dropdownState?.budget}>
                        <Dropdown.Toggle className="btn-form-control" id="budget-dropdown">
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
                                                e.stopPropagation();
                                                setSubBudget1Dropdown(true);
                                            }}
                                        />
                                        <Dropdown.Menu
                                            style={{
                                                display: subBudget1Dropdown ? "block" : "none",
                                                marginTop: "32px",
                                            }}
                                        >
                                            {budgetOptions.map((amount) => (
                                                <Dropdown.Item
                                                    key={amount}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleBud1InputClick(amount);
                                                    }}
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
                                                e.preventDefault();
                                                setSubBudget2Dropdown(true);
                                            }}
                                        />
                                        <Dropdown.Menu
                                            style={{
                                                display: subBudget2Dropdown ? "block" : "none",
                                                marginTop: "32px",
                                            }}
                                        >
                                            {budgetOptions.map((amount) => (
                                                <Dropdown.Item
                                                    key={amount}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleBud2InputClick(amount);
                                                    }}
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
            </div>

            <div className="d-grid d-sm-block text-center">
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleProjectSearch()}
                >
                    {translation?.search || "Search"}
                </button>
            </div>
        </div>
    )
}

export default BannerFormProject
