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
import useTranslation from "@/hooks/useTranslation";
import ProgressBar from "@/components/addtional/ProgressBar";
import {
  PersonFill,
  EnvelopeFill,
  TelephoneFill,
  LockFill,
  ShieldLockFill,
  ExclamationTriangleFill,
  BellFill,
  CheckCircleFill,
  BriefcaseFill,
  HouseDoorFill,
  BuildingFill,
  GeoAltFill,
  PatchCheckFill,
  FileEarmarkCheckFill,
  BookmarkFill,
  GraphUpArrow,
  HouseFill,
  MapFill,
  ClipboardCheckFill,
  CompassFill,
  PinMapFill,
  FileEarmarkTextFill,
  BookmarkCheckFill,
} from "react-bootstrap-icons";
import {
  Home,
  Bed,
  Ruler,
  Building2,
  Compass,
  Layers,
  Landmark,
  Hammer,
  Sofa,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  DollarSign,
  Wallet,
  BadgeDollarSign,
  Globe,
  ImagePlus,
  Bath,
  Tv,
  FileText,
  BedDouble,
  Utensils,
  Car,
} from "lucide-react";
import NoCreditModal from "@/components/addtional/NoCreditModal";

const stepKeyPoints = {
  1: [
    {
      icon: <PersonFill className="text-primary" />,
      text: "Provide your full name as per official documents.",
    },
    {
      icon: <EnvelopeFill className="text-primary" />,
      text: "Use a valid and accessible email address for communication.",
    },
    {
      icon: <TelephoneFill className="text-primary" />,
      text: "Ensure your phone number is correct for verification.",
    },
    {
      icon: <LockFill className="text-primary" />,
      text: "Create a strong password using a combination of characters.",
    },
    {
      icon: <ShieldLockFill className="text-primary" />,
      text: "Enable two-factor authentication (2FA) if available for added security.",
    },
    {
      icon: <ExclamationTriangleFill className="text-primary" />,
      text: "Avoid using common passwords that are easy to guess.",
    },
    {
      icon: <BellFill className="text-primary" />,
      text: "Keep your contact information updated for receiving notifications.",
    },
    {
      icon: <CheckCircleFill className="text-primary" />,
      text: "Double-check your name, email, and phone number for typos.",
    },
    {
      icon: <ClipboardCheckFill className="text-primary" />,
      text: "Use a professional email address instead of a temporary one.",
    },
    {
      icon: <ShieldLockFill className="text-primary" />,
      text: "Secure your password using a password manager if necessary.",
    },
  ],
  2: [
    {
      icon: <HouseDoorFill className="text-primary" />,
      text: "Choose whether you are posting your property for Rent or Sale.",
    },
    {
      icon: <BuildingFill className="text-primary" />,
      text: "Select the correct property type (Residential, Commercial, Agricultural).",
    },
    {
      icon: <GeoAltFill className="text-primary" />,
      text: "Provide accurate property subtype details (e.g., Apartment, Villa, Office Space).",
    },
    {
      icon: <PatchCheckFill className="text-primary" />,
      text: "Mention if your property is an Individual Property or part of a Project.",
    },
    {
      icon: <BookmarkFill className="text-primary" />,
      text: "Select the project name from suggestions if available for added credibility.",
    },
    {
      icon: <FileEarmarkCheckFill className="text-primary" />,
      text: "Indicate the ownership type (Freehold or Leasehold).",
    },
    {
      icon: <GraphUpArrow className="text-primary" />,
      text: "Ensure the property usage is correctly classified (Residential, Commercial, Industrial).",
    },
    {
      icon: <HouseDoorFill className="text-primary" />,
      text: "Highlight any unique selling points such as scenic views or premium location.",
    },
    {
      icon: <FileEarmarkCheckFill className="text-primary" />,
      text: "Provide accurate legal status details, including any RERA registration.",
    },
    {
      icon: <ClipboardCheckFill className="text-primary" />,
      text: "Review all information to ensure accuracy and avoid listing issues.",
    },
  ],
  3: [
    {
      icon: <GeoAltFill className="text-primary" />,
      text: "Ensure the city name is accurate to help buyers find your property easily.",
    },
    {
      icon: <MapFill className="text-primary" />,
      text: "Provide the correct locality name for improved search visibility.",
    },
    {
      icon: <HouseFill className="text-primary" />,
      text: "Mention the complete address with street name, number, and any landmarks.",
    },
    {
      icon: <BuildingFill className="text-primary" />,
      text: "Add the building name to offer clear identification for buyers.",
    },
    {
      icon: <FileEarmarkTextFill className="text-primary" />,
      text: "Write a detailed property description highlighting key features and nearby amenities.",
    },
    {
      icon: <CompassFill className="text-primary" />,
      text: "Verify the pinned map location to ensure accuracy and convenience for visitors.",
    },
    {
      icon: <PinMapFill className="text-primary" />,
      text: "Include nearby landmarks like schools, hospitals, and transport hubs.",
    },
    {
      icon: <ClipboardCheckFill className="text-primary" />,
      text: "Avoid abbreviations or incomplete addresses to prevent confusion.",
    },
    {
      icon: <BookmarkCheckFill className="text-primary" />,
      text: "Specify floor number, block name, or wing if applicable.",
    },
    {
      icon: <PatchCheckFill className="text-primary" />,
      text: "Double-check spelling and ensure correct city, locality, and address details.",
    },
  ],
  4: [
    {
      icon: <Home className="text-primary" />,
      text: "Specify the unit type (e.g., Apartment, Villa, Independent House).",
    },
    {
      icon: <BedDouble className="text-primary" />,
      text: "Provide the number of bedrooms to accurately describe your property.",
    },
    {
      icon: <Bath className="text-primary" />,
      text: "Mention the number of bathrooms for better buyer insight.",
    },
    {
      icon: <Utensils className="text-primary" />,
      text: "Ensure to include kitchen availability and type (e.g., Modular, Traditional).",
    },
    {
      icon: <Ruler className="text-primary" />,
      text: "Provide the exact carpet area in sq. ft. for transparency.",
    },
    {
      icon: <Building2 className="text-primary" />,
      text: "Include the super area if applicable, which covers common spaces.",
    },
    {
      icon: <Compass className="text-primary" />,
      text: "Specify the property’s facing direction (e.g., East, West) for Vastu preferences.",
    },
    {
      icon: <Car className="text-primary" />,
      text: "Mention available parking spaces for cars or bikes.",
    },
    {
      icon: <Layers className="text-primary" />,
      text: "Provide the floor number and total floors to clarify the building structure.",
    },
    {
      icon: <Landmark className="text-primary" />,
      text: "State if it's a corner plot or has additional visibility advantages.",
    },
    {
      icon: <Hammer className="text-primary" />,
      text: "Indicate whether construction is allowed and applicable regulations.",
    },
    {
      icon: <Sofa className="text-primary" />,
      text: "Clearly define the furnishing status (e.g., Fully Furnished, Semi-Furnished, Unfurnished).",
    },
  ],
  5: [
    {
      icon: <CalendarCheck size={24} className="text-primary" />,
      text: "Specify the possession type (e.g., Ready to Move, Under Construction).",
    },
    {
      icon: <CalendarDays size={24} className="text-primary" />,
      text: "Provide the expected possession month to give buyers clarity.",
    },
    {
      icon: <CalendarRange size={24} className="text-primary" />,
      text: "Mention the possession year for accurate timelines.",
    },
    {
      icon: <DollarSign size={24} className="text-primary" />,
      text: "State the expected price of the property clearly.",
    },
    {
      icon: <Wallet size={24} className="text-primary" />,
      text: "Provide the token amount required for booking.",
    },
    {
      icon: <BadgeDollarSign size={24} className="text-primary" />,
      text: "Mention any additional payment details or negotiation flexibility.",
    },
    {
      icon: <Globe size={24} className="text-primary" />,
      text: "Specify the preferred currency for payment (e.g., INR, USD, EUR).",
    },
  ],
  6: [
    {
      icon: <Landmark size={24} className="text-primary" />,
      text: "Upload high-quality images of the property’s exterior view.",
    },
    {
      icon: <Home size={24} className="text-primary" />,
      text: "Showcase the interiors to highlight the living space and design.",
    },
    {
      icon: <Tv size={24} className="text-primary" />,
      text: "Add images of the living room to provide a view of the common area.",
    },
    {
      icon: <Bath size={24} className="text-primary" />,
      text: "Include images of bathrooms to reflect the amenities and condition.",
    },
    {
      icon: <Bed size={24} className="text-primary" />,
      text: "Provide bedroom images showing size, lighting, and furniture.",
    },
    {
      icon: <ImagePlus size={24} className="text-primary" />,
      text: "Add a variety of angles and perspectives for better presentation.",
    },
    {
      icon: <FileText size={24} className="text-primary" />,
      text: "Provide relevant image descriptions to describe what is displayed.",
    },
  ],
};

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [remainingData, setRemainingData] = useState();
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [formData, setFormData] = useState({
    propertyDetails: "",
    location: "",
    property_amenity: "",
    parking_availability: "",
    corner_plot: "",
    availability: "",
    possession_status: "",
    construct_age: "",
    expected_price: "",
    token_amount: "",
    project_id: "",
    latitude: "",
    longitude: "",
    unit_type: "sqft",
    uid: memberId,
    project_property_type: "individual",
    launch_date: "",
  });
  const translation = useTranslation();

  const [userData, setUserData] = useState();

  const [currentStep, setCurrentStep] = useState(1);
  const points = stepKeyPoints[currentStep]?.slice(0, 10) || [];

  const fetchRemainPosting = async () => {
    try {
      const response = await callApi({
        api: `/get_remaining_value`,
        method: "GET",
        data: {
          user_id: memberId,
        },
      });
      if (response && response.status === 1) {
        setRemainingData(response.remaining_listings_allowed);
        setShowCreditModal(false);
      } else {
        setRemainingData(response.remaining_listings_allowed);
        setShowCreditModal(true);

      }
    } catch (error) { }
  };

  const handleCloseCreditModal = () => {
    setShowCreditModal(false);
  };

  const handleShowCreditModal = () => {
    setShowCreditModal(true);
  };

  useEffect(() => {
    if (memberId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        uid: memberId,
      }));
      fetchRemainPosting();
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
        setUserData(response.data?.user);
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
        <title>
          {translation?.post_your_property ||
            "Post Your Property for Sale or Rent | RealEstate"}
        </title>
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
                <h1 className="h3">
                  {translation?.sell_or_rent || "Sell Or Rent Your Property"}
                </h1>

                <p>
                  {remainingData > 0 ? (
                    <>
                      {translation?.posting_for || "You are posting this property for"}{" "}
                      <b className="text-green h4">
                        {translation?.free || "FREE!"}
                      </b>
                    </>
                  ) : ""}

                </p>
              </div>
              <ProgressBar step={currentStep} totalSteps={6} />

              <div className="card border-0 post-form">
                <div className="card-header pb-0">
                  <ul className="nav nav-underline mb-0 gap-5 d-flex">
                    <li className="nav-item">
                      {!memberId && (
                        <a
                          className={`nav-link ${currentStep === 1 ? "active" : ""
                            }`}
                        >
                          {translation?.personal_info || "Personal Info"}
                        </a>
                      )}
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${currentStep === 2 ? "active" : ""
                          }`}
                      >
                        {translation?.property_details || "Property Details"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${currentStep === 3 ? "active" : ""
                          }`}
                      >
                        {translation?.location || "Location"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${currentStep === 4 ? "active" : ""
                          }`}
                      >
                        {translation?.features || "Features"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${currentStep === 5 ? "active" : ""
                          }`}
                      >
                        {translation?.availability || "Availability"}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${currentStep === 6 ? "active" : ""
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
                        remainingData={remainingData}
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
                  <h3 className="mb-3">{translation?.key_points_remember || "Key Points to Remember"}</h3>
                  <div className="ad-post-points">
                    {points.map((item, index) => (
                      <div className="d-flex mb-3" key={index}>
                        <div className="">{item.icon}</div>
                        <div className="flex-grow-1 ps-3">
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      {showCreditModal && (
        <NoCreditModal show={showCreditModal} onHide={handleCloseCreditModal} />
      )}
    </MainLayout>
  );
};

export default Index;
