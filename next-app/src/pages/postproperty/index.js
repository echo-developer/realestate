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
    });
    const [userData, setUserData] = useState();
   
    const [currentStep, setCurrentStep] = useState(1);

    

    useEffect(() => {
        if (memberId) {
            fetchUserData();
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
            console.log(response);
            if (response && response.success === 1) {
                setUserData(response.data);
            } else {
                toast.error( response.message);
            }
        } catch (error) {
            toast.error( response.message);
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
            <div className="section post-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <aside className="col-lg-8 col-12">
                            <div className="d-sm-flex justify-content-between mb-3">
                                <h1 className="h3">
                                    Sell Or Rent Your Property
                                </h1>
                                <p>
                                    You are posting this property for{" "}
                                    <b className="text-green h4">FREE!</b>
                                </p>
                            </div>
                            <div className="card border-0 post-form">
                                <div className="card-header pb-0">
                                    <ul className="nav nav-underline mb-0 gap-5 d-flex">
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 1
                                                        ? "active"
                                                        : ""
                                                }`}
                                                href="#"
                                            >
                                                Personal Info
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 2
                                                        ? "active"
                                                        : ""
                                                }`}
                                                href="#"
                                            >
                                                Property Details
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 3
                                                        ? "active"
                                                        : ""
                                                }`}
                                                href="#"
                                            >
                                                Location
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 4
                                                        ? "active"
                                                        : ""
                                                }`}
                                                href="#"
                                            >
                                                Features
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 5
                                                        ? "active"
                                                        : ""
                                                }`}
                                                href="#"
                                            >
                                                Availability
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a
                                                className={`nav-link ${
                                                    currentStep === 6
                                                        ? "active"
                                                        : ""
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
                        <aside className="col-lg-4 col-12">
                            <div className="card border-0 shadow-1 mt-3 mt-lg-0">
                                <div className="card-body">
                                    <h3 className="mb-3">
                                        How To Find The Right Buyer?
                                    </h3>
                                    <div className="ad-post-points">
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src="assets/images/icons/17678554.png"
                                                    alt="Icon"
                                                    height="48"
                                                    width="48"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ps-3">
                                                <h4>Post your Property Ad</h4>
                                                <p>
                                                    This is some content from a
                                                    media component. You can
                                                    replace this with any
                                                    content and adjust it as
                                                    needed.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src="assets/images/icons/13434917.png"
                                                    alt="Icon"
                                                    height="48"
                                                    width="48"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ps-3">
                                                <h4>Add Quality Photos</h4>
                                                <p>
                                                    This is some content from a
                                                    media component. You can
                                                    replace this with any
                                                    content and adjust it as
                                                    needed.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex mb-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src="assets/images/icons/9094158.png"
                                                    alt="Icon"
                                                    height="48"
                                                    width="48"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ps-3">
                                                <h4>
                                                    Add Correct Locality/Address
                                                </h4>
                                                <p>
                                                    This is some content from a
                                                    media component. You can
                                                    replace this with any
                                                    content and adjust it as
                                                    needed.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src="assets/images/icons/10209854.png"
                                                    alt="Icon"
                                                    height="48"
                                                    width="48"
                                                />
                                            </div>
                                            <div className="flex-grow-1 ps-3">
                                                <h4>
                                                    Write a Great Description
                                                </h4>
                                                <p>
                                                    This is some content from a
                                                    media component. You can
                                                    replace this with any
                                                    content and adjust it as
                                                    needed.
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
