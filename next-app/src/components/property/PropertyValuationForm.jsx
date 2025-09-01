"use client";
import React from "react";
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Card,
    Spinner
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import useFetch from "@/hooks/useFetch";
import { parkingOptions, facingOptions } from "../post/PropertyData"
import { useAuth } from "@/context/AuthProvider";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
    property_type: Yup.string().required("Property type is required"),
    carpet_area: Yup.number()
        .typeError("Must be a number")
        .positive("Must be positive")
        .required("Carpet area is required"),
    bedrooms: Yup.number().min(0, "Invalid").required("Required"),
    bathrooms: Yup.number().min(0, "Invalid").required("Required"),
    age_of_property: Yup.number().min(0, "Invalid").required("Required"),
    furnishing_status: Yup.string().required("Select furnishing status"),
    address: Yup.string().required("Address is required"),
    parking: Yup.string().required("Select parking option"),
    floor_number: Yup.number().min(0, "Invalid").nullable(),
    facing: Yup.string().required("Select facing direction"),
    amenities: Yup.array(),
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10-digit phone")
        .required("Phone is required"),
});

const initialValues = {
    property_type: "",
    carpet_area: "",
    bedrooms: "",
    bathrooms: "",
    age_of_property: "",
    furnishing_status: "",
    address: "",
    parking: "",
    floor_number: "",
    facing: "",
    amenities: [],
    name: "",
    email: "",
    phone: "",
};

const PropertyValuationForm = ({ translation, show, onHide }) => {
    const { userData } = useAuth();
    const { callApi } = AuthUser();
    const { data: propertyTypeList, loading: propertyTypeLoading } = useFetch({ api: "/get_property_type" });
    const { data: propertyFurnishList, loading: propertyFurnishLoading } = useFetch({ api: "/get_property_furnish" });
    const { data: amenityList, loading: amenityLoading } = useFetch({ api: "/get_property_amnity" })


    const handleSubmit = async (values, { resetForm }, callApi, onHide) => {
        try {
            const res = await callApi({
                api: "/get_property_valuation",
                method: "POST",
                data: { ...values }
            });
    
            if (res && res?.status === 1) {
                resetForm();
                onHide();
                toast.success("Valuation Request sent successfully.");
            }
        } catch (error) {
            console.error(error?.message || "Something went wrong");
        }
    };    


    const amenityOptions = amenityList && amenityList?.map((item) => ({
        key: String(item.amenity_id),
        name: item.amenity_name,
        image: item.image,
    })) || [];


    const handleCheckboxChange = (e, setFieldValue, values) => {
        const { value, checked } = e.target;
        if (checked) {
            setFieldValue("amenities", [...values.amenities, value]);
        } else {
            setFieldValue(
                "amenities",
                values.amenities.filter((val) => val !== value)
            );
        }
    };


    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {translation?.property_valuation || "Property Valuation"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Card className="mb-3">
                    <Card.Body>
                        <h3 className="mb-4">
                            {translation?.free_advice ||
                                "Get Advice on your Property Valuation requirement"}
                        </h3>

                        <Formik
                         enableReinitialize
                         initialValues={{
                             property_type: "",
                             carpet_area: "",
                             bedrooms: "",
                             bathrooms: "",
                             age_of_property: "",
                             furnishing_status: "",
                             address: "",
                             parking: "",
                             floor_number: "",
                             facing: "",
                             amenities: [],
                             name: userData?.name || "",
                             email: userData?.email || "",
                             phone: userData?.phone || "",
                         }}
                            validationSchema={validationSchema}
                            onSubmit={(values, formikHelpers) =>
                                handleSubmit(values, formikHelpers, callApi, onHide)
                            }
                        >
                            {({
                                handleSubmit,
                                handleChange,
                                values,
                                errors,
                                touched,
                                setFieldValue
                            }) => (
                                <Form noValidate onSubmit={handleSubmit}>

                                    <h5 className="mt-4 mb-3">{translation?.your_details || "Your Details"}</h5>
                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>{translation?.name || "Name"}</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    readOnly={!!userData}
                                                    isInvalid={touched.name && !!errors.name}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.name}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>{translation?.email || "Email"}</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={values.email}
                                                    readOnly={!!userData}
                                                    onChange={handleChange}
                                                    isInvalid={touched.email && !!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>{translation?.phone || "Phone"}</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    readOnly={!!userData}
                                                    isInvalid={touched.phone && !!errors.phone}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.phone}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {/* Property Type + Carpet Area */}
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.property_type || "Property Type"}</Form.Label>
                                                <Form.Select
                                                    name="property_type"
                                                    value={values.property_type}
                                                    onChange={handleChange}
                                                    isInvalid={touched.property_type && !!errors.property_type}
                                                >
                                                    <option value="">Select</option>
                                                    {propertyTypeList &&
                                                        propertyTypeList?.length > 0 &&
                                                        propertyTypeList?.map((item) => (
                                                            <option value={item?.category_id}>{item?.category_name}</option>
                                                        ))}

                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.property_type}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.carpet_area || "Carpet Area"} (sq.ft)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="carpet_area"
                                                    value={values.carpet_area}
                                                    onChange={handleChange}
                                                    isInvalid={touched.carpet_area && !!errors.carpet_area}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.carpet_area}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Bedrooms + Bathrooms */}
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.bedrooms || "Bedrooms"}</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="bedrooms"
                                                    value={values.bedrooms}
                                                    onChange={handleChange}
                                                    isInvalid={touched.bedrooms && !!errors.bedrooms}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.bedrooms}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.bathrooms || "Bathrooms"}</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="bathrooms"
                                                    value={values.bathrooms}
                                                    onChange={handleChange}
                                                    isInvalid={touched.bathrooms && !!errors.bathrooms}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.bathrooms}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Age + Furnishing */}
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.property_age || "Age of Property (In Years)"}</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="age_of_property"
                                                    value={values.age_of_property}
                                                    onChange={handleChange}
                                                    isInvalid={touched.age_of_property && !!errors.age_of_property}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.age_of_property}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.furnished_status || "Furnishing Status"}</Form.Label>
                                                <Form.Select
                                                    name="furnishing_status"
                                                    value={values.furnishing_status}
                                                    onChange={handleChange}
                                                    isInvalid={touched.furnishing_status && !!errors.furnishing_status}
                                                >
                                                    <option value="">Select</option>
                                                    {propertyFurnishList &&
                                                        propertyFurnishList?.length > 0 &&
                                                        propertyFurnishList?.map((item) => (
                                                            <option value={item?.furnish_id}>{item?.furnish_name}</option>
                                                        ))}

                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.furnishing_status}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Address */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>{translation?.address || "Address"}</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            isInvalid={touched.address && !!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    {/* Parking + Floor */}
                                    <Row className="mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.parking || "Parking"}</Form.Label>
                                                <Form.Select
                                                    name="parking"
                                                    value={values.parking}
                                                    onChange={handleChange}
                                                    isInvalid={touched.parking && !!errors.parking}
                                                >
                                                    <option value="">Select</option>
                                                    {parkingOptions?.map((item, i) => {
                                                        return <option key={i} value={item.key}>{item.value}</option>;
                                                    })}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.parking}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>{translation?.facing || "Facing Direction"}</Form.Label>
                                                <Form.Select
                                                    name="facing"
                                                    value={values.facing}
                                                    onChange={handleChange}
                                                    isInvalid={touched.facing && !!errors.facing}
                                                >
                                                    <option value="">Select</option>
                                                    {facingOptions?.map((item, i) => {
                                                        return <option key={i} value={item?.key}>{item?.value}</option>
                                                    })}
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.facing}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">{translation?.amenities || "Amenities"}</Form.Label>
                                        <div style={{ maxHeight: "200px", overflowY: "auto", overflowX: "hidden" }}>
                                            <Row className="mb-3">
                                                {amenityLoading && (
                                                    <div className="d-flex justify-content-center w-100 my-3">
                                                    <Spinner animation="border" role="status" style={{ width: "2.5rem", height: "2.5rem" }}>
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                </div>
                                                )}
                                                {amenityOptions?.length > 0 &&
                                                    amenityOptions?.map((opt) => (
                                                        <Col
                                                            key={opt.key}
                                                            xs={6}
                                                            md={4}
                                                            className="d-flex align-items-center mb-2"
                                                        >
                                                            <Form.Check
                                                                id={`amenity-${opt.key}`}
                                                                type="checkbox"
                                                                name="amenities"
                                                                value={opt.key}
                                                                label={opt.name}
                                                                checked={values.amenities.includes(opt.key)}
                                                                onChange={(e) => handleCheckboxChange(e, setFieldValue, values)}
                                                            />
                                                        </Col>
                                                    ))}
                                            </Row>
                                        </div>
                                    </Form.Group>


                                    {/* Submit */}
                                    <Button variant="primary" type="submit" className="w-100">
                                        {translation?.get_valuation || "Get Valuation"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Modal.Body>
        </Modal>
    );
};

export default PropertyValuationForm;
