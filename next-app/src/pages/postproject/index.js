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
  BuildingsFill,
  PersonBadgeFill,
  HourglassSplit,
  FileTextFill,
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
  Building,
  Hash,
  CheckCircle,
  MapPin
} from "lucide-react";

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
      icon: <HouseFill className="text-primary" />,
      text: "Select whether you are posting for Rent or Sale.",
    },
    {
      icon: <BuildingsFill className="text-primary" />,
      text: "Choose the correct project type: Residential, Commercial, or Agricultural.",
    },
    {
      icon: <PersonBadgeFill className="text-primary" />,
      text: "Enter the developer's name for authenticity.",
    },
    {
      icon: <HourglassSplit className="text-primary" />,
      text: "Specify the developer's years of experience.",
    },
    {
      icon: <FileTextFill className="text-primary" />,
      text: "Write a detailed property description highlighting key features.",
    },
    {
      icon: <GeoAltFill className="text-primary" />,
      text: "Ensure the location and address details are accurate.",
    },
    {
      icon: <PatchCheckFill className="text-primary" />,
      text: "Mention if the property is an individual unit or part of a project.",
    },
    {
      icon: <BookmarkFill className="text-primary" />,
      text: "Choose a project name from suggestions for added credibility.",
    },
    {
      icon: <FileEarmarkCheckFill className="text-primary" />,
      text: "Indicate the ownership type: Freehold or Leasehold.",
    },
    {
      icon: <ClipboardCheckFill className="text-primary" />,
      text: "Review all provided details to ensure completeness and accuracy.",
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
      text: "Add the project name to offer clear identification for buyers.",
    },
    {
      icon: <FileEarmarkTextFill className="text-primary" />,
      text: "Write a detailed project description highlighting key features and nearby amenities.",
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
      icon: <Ruler className="text-primary" />,
      text: "Specify the occupied area in square feet for precise information.",
    },
    {
      icon: <Building2 className="text-primary" />,
      text: "Provide the total area, including common and exclusive spaces.",
    },
    {
      icon: <Building className="text-primary" />,
      text: "Mention the tower number for easy identification in multi-tower projects.",
    },
    {
      icon: <Hash className="text-primary" />,
      text: "Specify the unit number to precisely identify the property.",
    },
    {
      icon: <Car className="text-primary" />,
      text: "Mention available parking spaces for cars or bikes.",
    },
    {
      icon: <Compass className="text-primary" />,
      text: "Specify the property’s facing direction (e.g., East, West) for Vastu preferences.",
    },
    {
      icon: <CheckCircle className="text-primary" />,
      text: "List the amenities available (e.g., Gym, Pool, Clubhouse) to attract buyers.",
    },
    {
      icon: <Landmark className="text-primary" />,
      text: "State if the property faces the main road for better visibility and accessibility.",
    },
    {
      icon: <Layers className="text-primary" />,
      text: "Provide the floor number and total floors to clarify the building structure.",
    },
    {
      icon: <MapPin className="text-primary" />,
      text: "Specify the exact property location for better understanding.",
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
  const points = stepKeyPoints[currentStep]?.slice(0, 10) || [];

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
                <h1 className="h3">
                  {" "}
                  {translation?.sell_or_rent_project ||
                    "Sell Or Rent Your Project"}{" "}
                </h1>
                <p>
                  {translation?.posting_for ||
                    "You are posting this project for"}{" "}
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
                  <h3 className="mb-3">Key Points to Remember</h3>
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
    </MainLayout>
  );
};

export default withAuth(Index);
