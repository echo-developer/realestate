import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import AuthUser from "../Authentication/AuthUser";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Invalid email address.").required("Email is required."),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be a 10-digit number.")
        .required("Phone number is required."),
    date: Yup.string().required("Preferred date is required."),
    time: Yup.string().required("Preferred time is required."),
});

export default function SiteVisitModal({
    siteVisitModal,
    setSiteVisitModal,
    handleSiteVisit,
    loggedInUser = {}, 
    property_id
}) {
    const { callApi } = AuthUser();

    const handleSubmitForm = async (values, { setSubmitting, resetForm }) => {
        try {
            const res = await callApi({
                api: '/property-site-visit',
                method: 'UPLOAD',
                data: {
                    ...values,
                    property_id: property_id
                }
            })
            if (res && res.status == 1) {
                resetForm();
                setSiteVisitModal(false);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const initialValues = {
        name: loggedInUser?.name || "",
        email: loggedInUser?.email || "",
        phone: loggedInUser?.phone || "",
        date: "",
        time: "",
    };

    return (
        <Modal show={siteVisitModal} onHide={() => setSiteVisitModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Schedule a Site Visit</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmitForm}
                    enableReinitialize // Important to update if loggedInUser changes
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Your Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.name && !!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.email && !!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.phone && !!errors.phone}
                                />
                                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={values.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.date && !!errors.date}
                                />
                                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Preferred Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="time"
                                    value={values.time}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.time && !!errors.time}
                                />
                                <Form.Control.Feedback type="invalid">{errors.time}</Form.Control.Feedback>
                            </Form.Group>

                            <div className="text-end">
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Schedule Visit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}
