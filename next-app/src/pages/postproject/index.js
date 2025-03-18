"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import MainLayout from "@/components/layout/MainLayout";
import ProjectForm1 from "@/components/postproject/projectForm1";
import ProjectForm2 from "@/components/postproject/projectForm2";
import ProjectForm3 from "@/components/postproject/projectForm3";
import ProjectForm4 from "@/components/postproject/projectForm4";
import ProjectForm5 from "@/components/postproject/projectForm5";
import ProjectForm6 from "@/components/postproject/projectForm6";
import { Helmet } from "react-helmet-async";
import withAuth from "@/utils/withAuth";
import ProgressBar from "@/components/addtional/ProgressBar";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";


const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [formData, setFormData] = useState({
    project_amenity: [],
    latitude: "",
    longitude: "",
    unit_type: "sqft",
    uid: memberId || "",
  });

  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const translation = useTranslation();


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
    setLoading(true);
    try {
      const response = await callApi({
        api: `/get_user_data`,
        method: "GET",
        data: { member_id: memberId },
      });

      if (response && response.success === 1) {
        setUserData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
        <title>
        Post Your Real Estate Project | Share Your Development with Buyers
        </title>
        <meta
          name="description"
          content="List your real estate project on RealEstate to attract potential investors and buyers. Showcase your development’s features, pricing, and location. Get your project noticed today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="section post-page">
        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-lg-8 col-12">
              <div className="d-sm-flex justify-content-between mb-3">
                <h1 className="h3"> {translation?.sell_or_rent_project || "Sell Or Rent Your Project"} </h1>
                <p>
                {translation?.posting_for || "You are posting this project for"} {" "}
                  <b className="text-green h4">{translation?.free || "FREE"}</b>
                </p>
              </div>
              <ProgressBar step={currentStep} totalSteps={6} />
              <div className="card border-0 post-form">
                <div className="card-header pb-0">
                  <ul className="nav nav-underline mb-0 gap-5 d-flex">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 2 ? "active" : ""
                        }`}
                        href="#"
                      >
                        {translation?.project_details || "Project Details"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 3 ? "active" : ""
                        }`}
                        href="#"
                      >
                       {translation?.location || "Location"} 
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 4 ? "active" : ""
                        }`}
                        href="#"
                      >
                        {translation?.features || "Features"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 5 ? "active" : ""
                        }`}
                        href="#"
                      >
                        {translation?.availability || "Availability"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 6 ? "active" : ""
                        }`}
                        href="#"
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
                      <ProjectForm1
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        userData={userData}
                        memberId={memberId}
                        loading={loading}
                      />
                    )}

                    {/* Step 2: Project Details */}
                    {currentStep === 2 && (
                      <ProjectForm2
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 3: Location */}
                    {currentStep === 3 && (
                      <ProjectForm3
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 4: Features */}
                    {currentStep === 4 && (
                      <ProjectForm4
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 5: Availability */}
                    {currentStep === 5 && (
                      <ProjectForm5
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                      />
                    )}

                    {/* Step 6: Photos */}
                    {currentStep === 6 && (
                      <ProjectForm6
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
                  <h3 className="mb-3">{translation?.find_buyer || "How To Find The Right Buyer?"} </h3>
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
                        <h4>{translation?.post_project_ad || "Post your Project Ad"} </h4>
                        <p>
                        {translation?.media_content_4 || " Advertise your project effectively by highlighting key details like location, features, pricing, and amenities. Use compelling descriptions, high-quality visuals, and accurate specifications to attract buyers or investors. Ensure transparency, mention completion timelines, and emphasize unique selling points to maximize engagement and generate strong interest in your project."}
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
                        {translation?.media_conten_5 || "TEnhance your project ad with high-quality photos showcasing design, amenities, interiors, and surroundings. Clear, well-lit images attract buyers and investors, highlighting key features and unique aspects. Use multiple angles, professional staging, and high resolution for a polished presentation, increasing interest and credibility for better engagement and faster deals."}
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
                        {translation?.media_content_6 || "Ensure your project ad includes the correct locality and address for easy identification. Accurate location details enhance credibility, attract serious buyers, and improve search visibility. Mention nearby landmarks, roads, and essential facilities like schools, hospitals, and markets to highlight convenience and accessibility, making your project more appealing to potential investors"}
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
                        {translation?.media_content_7 || "Create a compelling project description by highlighting key features, location advantages, modern amenities, and unique selling points. Use engaging language to showcase design, quality, and lifestyle benefits. Mention connectivity, nearby landmarks, green spaces, and future growth potential to attract buyers and investors, ensuring maximum interest and a successful project launch"}
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

export default withAuth(Index);
