"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import Step2Form from "@/components/post/Step2Form";
import MainLayout from "@/components/layout/MainLayout";
import Step3Form from "@/components/post/Step3Form";
import Step4Form from "@/components/post/Step4Form";
import Step5Form from "@/components/post/Step5Form";
import Step6Form from "@/components/post/Step6Form";
import Step1Form from "@/components/post/Step1Form";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import useTranslation from '@/hooks/useTranslation';


const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [formData, setFormData] = useState({
    propertyDetails: "",
    location: "",
    property_amenity: "",
    parking_availability: "",
    corner_plot: "",
    availability: "",
    possession_status: "",
    construct_age: "",
    currency: "",
    expected_price: "",
    token_amount: "",
    project_id: "",
    latitude: "",
    longitude: "",
    unit_type: "sqft",
    uid: memberId,
    project_property_type:"individual"
  });
  const translation = useTranslation();

  const [userData, setUserData] = useState();

  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (memberId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uid: memberId,
      }));

      fetchUserData();
      setCurrentStep(2);
    }
  }, [memberId]);

  const fetchUserData = async () => {
    try {
      const response = await callApi({
        api: `/get_user_data`,
        method: "GET",
        data: {
          member_id: memberId,
        },
      });
      if (response && response.success === 1) {
        setUserData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>{translation?.post_your_property || "Post Your Property for Sale or Rent | RealEstate"}</title>
        <meta
          name="description"
          content="List your property for sale or rent on RealEstate. Reach thousands of potential buyers or renters and get the best price for your property. Start posting today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="section post-page">
        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-lg-8 col-12">
              <div className="d-sm-flex justify-content-between mb-3">
                <h1 className="h3">{translation?.sell_or_rent || "Sell Or Rent Your Property"}</h1>
                <p>
                {translation?.posting_for || "You are posting this property for"}{" "}
                  <b className="text-green h4"> {translation?.free || "FREE!"}</b>
                </p>
              </div>
              <div className="card border-0 post-form">
                <div className="card-header pb-0">
                  <ul className="nav nav-underline mb-0 gap-5 d-flex">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 1 ? "active" : ""
                        }`}
                      >
                        {translation?.personal_info || "Personal Info"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 2 ? "active" : ""
                        }`}
                      >
                        {translation?.property_details || "Property Details"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 3 ? "active" : ""
                        }`}
                      >
                        {translation?.location || "Location"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 4 ? "active" : ""
                        }`}
                      >
                        {translation?.features || "Features"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 5 ? "active" : ""
                        }`}
                      >
                        {translation?.availability || "Availability"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 6 ? "active" : ""
                        }`}
                      >
                        {translation?.photos || "Photos"}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="card-body">
                  <form>
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                      <Step1Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        userData={userData}
                        memberId={memberId}
                      />
                    )}

                    {/* Step 2: Property Details */}
                    {currentStep === 2 && (
                      <Step2Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                      <Step3Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 4: Features */}
                    {currentStep === 4 && (
                      <Step4Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 5: Availability */}
                    {currentStep === 5 && (
                      <Step5Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 6: Photos */}
                    {currentStep === 6 && (
                      <Step6Form
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}
                  </form>
                </div>
              </div>
            </aside>
            <aside className="col-lg-4 col-12 d-none d-lg-block">
              <div className="card border-0 shadow-1 mt-3 mt-lg-0">
                <div className="card-body">
                  <h3 className="mb-3">{translation?.find_buyer || "How To Find The Right Buyer?"}</h3>
                  <div className="ad-post-points">
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src="/assets/images/icons/17678554.png"
                          alt="Icon"
                          height="48"
                          width="48"
                        />
                      </div>
                      <div className="flex-grow-1 ps-3">
                        <h4>{translation?.post_ad || "Post your Property Ad"}</h4>
                        <p>
                        {translation?.media_content || "This is some content from a media component. You can replace this with any content and adjust it as needed."}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src="/assets/images/icons/13434917.png"
                          alt="Icon"
                          height="48"
                          width="48"
                        />
                      </div>
                      <div className="flex-grow-1 ps-3">
                        <h4>{translation?.add_quality_photos || "Add Quality Photos"}</h4>
                        <p>
                        {translation?.media_content || "This is some content from a media component. You can replace this with any content and adjust it as needed."}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src="/assets/images/icons/9094158.png"
                          alt="Icon"
                          height="48"
                          width="48"
                        />
                      </div>
                      <div className="flex-grow-1 ps-3">
                        <h4>{translation?.add_correct_address || "Add Correct Locality/Address"}</h4>
                        <p>
                        {translation?.media_content || "This is some content from a media component. You can replace this with any content and adjust it as needed."}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="/assets/images/icons/10209854.png"
                          alt="Icon"
                          height="48"
                          width="48"
                        />
                      </div>
                      <div className="flex-grow-1 ps-3">
                        <h4>{translation?.write_great_description || "Write a Great Description"}</h4>
                        <p>
                        {translation?.media_content || "This is some content from a media component. You can replace this with any content and adjust it as needed."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
