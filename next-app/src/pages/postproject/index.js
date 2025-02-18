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

import { toast } from "react-toastify";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [formData, setFormData] = useState({
    project_details: "",
    project_location: "",
    project_amenity: [],
    project_parking: "",
    project_corner_plot: "",
    project_availability: "",
    project_possession_status: "",
    project_construct_age: "",
    project_currency: "",
    project_expected_price: "",
    project_token_amount: "",
    latitude: "",
    longitude: "",
  });

  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memberId) {
      fetchUserData();
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
                <h1 className="h3">Sell Or Rent Your Project</h1>
                <p>
                  You are posting this project for{" "}
                  <b className="text-green h4">FREE!</b>
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
                        href="#"
                      >
                        Personal Info
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 2 ? "active" : ""
                        }`}
                        href="#"
                      >
                        Project Details
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 3 ? "active" : ""
                        }`}
                        href="#"
                      >
                        Location
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 4 ? "active" : ""
                        }`}
                        href="#"
                      >
                        Features
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 5 ? "active" : ""
                        }`}
                        href="#"
                      >
                        Availability
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          currentStep === 6 ? "active" : ""
                        }`}
                        href="#"
                      >
                        Photos
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

            <aside className="col-lg-4 col-12">
              <div className="card border-0 shadow-1 mt-3 mt-lg-0">
                <div className="card-body">
                  <h3 className="mb-3">How To Find The Right Buyer?</h3>
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
                        <h4>Post your Project Ad</h4>
                        <p>
                          This is some content from a media component. You can
                          replace this with any content and adjust it as needed.
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
                        <h4>Add Quality Photos</h4>
                        <p>
                          This is some content from a media component. You can
                          replace this with any content and adjust it as needed.
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
                        <h4>Add Correct Locality/Address</h4>
                        <p>
                          This is some content from a media component. You can
                          replace this with any content and adjust it as needed.
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
                        <h4>Write a Great Description</h4>
                        <p>
                          This is some content from a media component. You can
                          replace this with any content and adjust it as needed.
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
