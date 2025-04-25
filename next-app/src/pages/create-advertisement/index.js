import DashboardLayout from '@/components/layout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import AuthUser from '@/components/Authentication/AuthUser'
import { useAuth } from '@/context/AuthProvider';
import OtpField from '@/components/otp/OtpField'
import { toast } from "react-toastify";
import useTranslation from '@/hooks/useTranslation'

const CreateAdvertisement = () => {
  const { callApi } = AuthUser();
  const translation = useTranslation();
  const [cityList, setCityList] = useState([])
  const [localityList, setLocalityList] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [emailTimer, setEmailTimer] = useState(0);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpValid, setOtpValid] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [validatedOtp, setValidatedOtp] = useState("");


  useEffect(() => {
    FetchCityData();
    fetchPagesList();
  }, [])

  useEffect(() => {
    let interval = null;

    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);

    }
    if (emailTimer == 0) {
      setShowOtpField(false);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);


  const FetchCityData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_cities`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setCityList(response.data)
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  };

  const fetchLocalityData = async (city_id) => {
    try {
      const res = await callApi({
        api: `/locality-list`,
        method: "GET",
        data: {
          city_id: city_id
        }
      })
      if (res && res?.status == 1) {
        setLocalityList(res?.data || []);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }

  const fetchPagesList = async () => {
    try {
      const res = await callApi({
        api: `/get-ads-pages`,
        method: "GET",
      })
      if (res && res?.status == 1) {
        setPagesList(res?.data || []);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }

  const getPosition = async (selectedPage) => {
    try {
      const res = await callApi({
        api: `/get-ads-position/${selectedPage}`,
        method: "GET"
      })
      if (res && res?.status == 1) {
        setPositionList(res?.data || []);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }

  const uploadImage = async (e, setFieldValue) => {
    const file = e.target?.files[0];
    setUploadedImageUrl("");
    try {
      const res = await callApi({
        api: `/upload-advertisement-banner`,
        method: "UPLOAD",
        data: {
          images: file
        }
      })

      if (res && res?.status == 1) {
        setFieldValue('banner_image', res?.files?.[0]);
        setUploadedImageUrl(res?.image_url?.[0])
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    phone_code: '+1', // default value
    phone: '',
    city_id: '',
    locality_id: '',
    page: '',
    position: '',
    duration: '',
    has_banner: false,
    banner_image: null,
    otp: ''
  }

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone_code: Yup.string().required('Phone code is required'),
    phone: Yup.number()
      .typeError('Must be a number')
      .required('Phone number is required')
      .test('len', 'Must be exactly 10 digits', val => val && val.toString().length === 10),
    city_id: Yup.number().typeError('Must be a number').required('City is required'),
    locality_id: Yup.number().typeError('Must be a number').required('Locality is required'),
    page: Yup.string().required('Page is required'),
    position: Yup.string().required('Position is required'),
    duration: Yup.string().required('Duration is required'),
    has_banner: Yup.boolean(),
    // banner_image: Yup.mixed()
    //   .when('has_banner', {
    //     is: true,
    //     then: Yup.mixed()
    //       .required('Banner image is required')
    //       .test(
    //         'fileFormat',
    //         'Unsupported Format',
    //         value => value && ['image/jpg', 'image/jpeg', 'image/png'].includes(value.type)
    //       )
    //       .test(
    //         'fileSize',
    //         'File too large (max 2MB)',
    //         value => value && value.size <= 2000000
    //       )
    //   }),
    // otp: Yup.number().typeError('Must be a number').required('OTP is required')
  })

  const handleSendOTP = async (email, setFieldError) => {
    let response;
    if (!email) return;


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(prev => {
        return {
          ...prev,
          email: "Invalid Email Format"
        }
      })
      return;
    } else {
      setFieldError(prev => {
        return {
          ...prev,
          email: ""
        }
      })
    }


    try {
      response = await callApi({
        api: `/send_otp_to_verify_email`,
        method: "UPLOAD",
        data: {
          email: email,
        },
      });
      if (response && response.status == 1) {
        setShowOtpField(true);
        setEmailTimer(60);
        toast.success(response?.message || "OTP Send Successfully");
      } else {
        setFieldError(prev => {
          return {
            ...prev,
            email: response.message || ""
          }
        })
      }
    } catch (error) {
      console.error(response?.message || "Data Not Found");
    }
  }

  // Form submission handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {


    try {
      const res = await callApi({
        api: `/save-advertisement-request`,
        method: "UPLOAD",
        data: {
          ...values
        }
      })
      if(res && res?.status == 1) {
        resetForm();
        toast.success('Your Request For Advertisement submitted successfully');
      }
    } catch (error) {
      console.error(error?.message || "Something Went Wrong")
    } finally {
      setSubmitting(false)
    }
  }


  // Mock data
  const phoneCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+971', country: 'UAE' }
  ]
  const durations = [7, 15, 30, 60]



  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Create Advertisement</h3>

        <div className="card shadow-sm">
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue, errors, setFieldError, isValid, dirty }) => {
                useEffect(() => {
                  if (values?.city_id) {
                    fetchLocalityData(values.city_id)
                  }
                }, [values?.city_id])

                // useEffect(() => {
                //   if (values?.banner_image) {
                //     uploadImage(values.banner_image, setFieldValue);
                //   }
                // }, [values?.banner_image])

                useEffect(() => {
                  if (values?.page) {
                    getPosition(values.page)
                  }
                }, [values?.page])

                useEffect(() => {
                  if(validatedOtp) {
                    setFieldValue('otp', validatedOtp)
                  }
                }, [validatedOtp])
                useEffect(() => {
                  if(values?.has_banner == 'false') {
                    setFieldValue('banner_image', "")
                  }
                }, [values?.has_banner])
                return (
                  <Form>
                    <div className="row">
                      {/* Personal Information */}
                      <div className="col-md-6">
                        <h5 className="mb-3">Personal Information</h5>

                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Full Name</label>
                          <Field
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="John Doe"
                          />
                          <ErrorMessage name="name" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3 position-relative">
                          <label htmlFor="email" className="form-label">Email</label>
                          <div className="position-relative">
                            <Field
                              type="email"
                              name="email"
                              className="form-control pe-5"
                              placeholder="john@example.com"
                              readOnly={isOtpValid}

                            />
                            {!isOtpValid && values?.email && (
                              <button
                                type="button"
                                className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-2"
                                style={{ transform: 'translateY(-50%)' }}
                                onClick={() => handleSendOTP(values?.email, setFieldError)}
                                disabled={emailTimer > 0}
                              >
                                {emailTimer > 0
                                  ? `Resend in ${emailTimer}s`
                                  : translation?.send_otp || "Send OTP"}
                              </button>
                            )}
                          </div>
                          <ErrorMessage name="email" component="div" className="text-danger small" />
                        </div>
                        {showOtpField && (
                          <OtpField setOtpValid={setOtpValid} setShowOtpField={setShowOtpField} email={values?.email} setValidatedOtp={setValidatedOtp} />
                        )}

                        <div className="row">
                          <div className="col-4">
                            <div className="mb-3">
                              <label htmlFor="phone_code" className="form-label">Country Code</label>
                              <Field as="select" name="phone_code" className="form-select">
                                {phoneCodes.map(({ code, country }) => (
                                  <option key={code} value={code}>
                                    {code} ({country})
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage name="phone_code" component="div" className="text-danger small" />
                            </div>
                          </div>
                          <div className="col-8">
                            <div className="mb-3">
                              <label htmlFor="phone" className="form-label">Phone Number</label>
                              <Field
                                type="number"
                                name="phone"
                                className="form-control"
                                placeholder="1234567890"
                              />
                              <ErrorMessage name="phone" component="div" className="text-danger small" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advertisement Details */}
                      <div className="col-md-6">
                        <h5 className="mb-3">Advertisement Details</h5>

                        <div className="mb-3">
                          <label htmlFor="city_id" className="form-label">City</label>
                          <Field as="select" name="city_id" className="form-select">
                            <option value="">
                              select an options
                            </option>
                            {cityList?.length > 0 && cityList?.map((city, i) => {
                              return (
                                <option key={i} value={city?.city_id}>
                                  {city.name || "Not Available"}
                                </option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="city_id" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="locality_id" className="form-label">Locality</label>
                          {/* <Field 
                          type="number" 
                          name="locality_id" 
                          className="form-control" 
                          placeholder="Locality ID" 
                        /> */}
                          <Field as="select" name="locality_id" className="form-select">
                            <option value="">
                              select an option
                            </option>
                            {localityList?.length > 0 && localityList?.map((locality, i) => {
                              return (
                                <option key={i} value={locality?.locality_id}>
                                  {locality?.locality_name || "Not Available"}
                                </option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="locality_id" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="page" className="form-label">Page</label>
                          <Field as="select" name="page" className="form-select">
                            <option value="">Select a page</option>
                            {pagesList?.length > 0 && pagesList?.map((page, i) => {
                              return (
                                <option key={i} value={page.slug}>{page.name}</option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="page" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="position" className="form-label">Position</label>
                          <Field as="select" name="position" className="form-select">
                            <option value="">Select position</option>
                            {/* {positions.map(position => (
                            <option key={position} value={position}>{position}</option>
                          ))} */}
                            {positionList?.length > 0 && positionList?.map((position, i) => {
                              return (
                                <option key={i} value={position?.name}>{position?.name || "Not Available"}</option>
                              )
                            })}
                          </Field>
                          <ErrorMessage name="position" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="duration" className="form-label">Duration</label>
                          <Field as="select" name="duration" className="form-select">
                            <option value="">Select duration</option>
                            {durations.map(duration => (
                              <option key={duration} value={duration}>{duration}</option>
                            ))}
                          </Field>
                          <ErrorMessage name="duration" component="div" className="text-danger small" />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Do You Have Banner?</label>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="has_banner"
                              id="has_banner_yes"
                              value="true"
                              className="form-check-input"
                            />
                            <label htmlFor="has_banner_yes" className="form-check-label">Yes</label>
                          </div>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="has_banner"
                              id="has_banner_no"
                              value="false"
                              className="form-check-input"
                            />
                            <label htmlFor="has_banner_no" className="form-check-label">No</label>
                          </div>
                          <ErrorMessage name="has_banner" component="div" className="text-danger small" />
                        </div>

                        {values?.has_banner == "true" && (
                          <div className="mb-3">
                            <label htmlFor="image" className="form-label">Banner Image</label>
                            <input
                              type="file"
                              name="image"
                              className="form-control"
                              // accept="image/jpeg, image/png"
                              onChange={(e) => {
                                uploadImage(e, setFieldValue)
                              }}
                            />
                            <ErrorMessage name="banner_image" component="div" className="text-danger small" />
                            <div className="form-text">Accepted formats: JPEG, PNG (Max 2MB)</div>
                          </div>
                        )}

                        {/* <div className="mb-3">
                          <label htmlFor="otp" className="form-label">OTP</label>
                          <Field
                            type="number"
                            name="otp"
                            className="form-control"
                            placeholder="Enter OTP"
                          />
                          <ErrorMessage name="otp" component="div" className="text-danger small" />
                        </div> */}
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        // disabled={!isValid || !dirty || isSubmitting}
                        disabled={!isValid}
                      >
                        {isSubmitting ? 'Submitting...' : 'Create Advertisement'}
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateAdvertisement