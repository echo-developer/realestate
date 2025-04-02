"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Envelope, Phone, Share, Whatsapp } from 'react-bootstrap-icons';

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userImage, setUserImage] = useState(localStorage.getItem("user_logo"));

  const memberId = GetMemberId();
  const translation = useTranslation();

  useEffect(() => {
    // Fetch the image from localStorage initially
    const storedImage = localStorage.getItem("user_logo");
    if (storedImage) {
      setUserImage(storedImage);
    }

    // Fetch data from API
    if (memberId) {
      fetchUserData();
    }
  }, [memberId ,userImage]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await callApi({
        api: `/my_profile`,
        method: "GET",
        data: {
          user_id: memberId,
        },
      });

      if (response?.status === 1) {
        const user = response.data.user;
        setUserData(response.data);

        // Update the user image and store it in localStorage
        if (user?.image) {
          setUserImage(user.image);
          localStorage.setItem("user_logo", user.image);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the UI instantly when localStorage changes
  const updateImageInUI = (newImage) => {
    setUserImage(newImage);
    localStorage.setItem("user_logo", newImage);
  };

  return (
    <DashboardLayout>
      <div className="col-lg">
        <div className="p-4">
          <h1 className="h3">{translation?.my_profile || "My Profile"}</h1>
          {isLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="card card-agent-page mb-4">
              <div className="row g-0">
                <div className="col-sm-auto col-4">
                  <div className="card-image">
                    <img
                      alt="Profile"
                      className="img-fluid"
                      src={userImage || "assets/images/agents/user.jpg"}
                      onError={(e) =>
                        (e.target.src = "assets/images/agents/user.jpg")
                      }
                    />
                  </div>
                </div>
                <div className="col-sm col-8">
                  <div className="card-body">
                    <div className="card-title">
                      <h4 className="mb-1">
                        {userData?.user?.name || "User"}
                        <i className="icon-img-check ms-2"></i>
                      </h4>
                    </div>

                    <p className="mb-1">
                      <Envelope color="current" size={14} className="me-1" />
                      <b>{userData?.user?.email || "Not available"}</b>
                    </p>
                    <p className="mb-2">
                      <span>
                        <Phone color="current" size={14} className="me-1" />
                        <b>
                          {userData?.user?.phone && userData?.user?.phone !== 0
                            ? `${userData?.user?.phone_code || "+91"}-${
                                userData?.user?.phone
                              }`
                            : "Not available"}
                        </b>
                      </span>
                    </p>
                    <p className="mb-1">
                      <Whatsapp color="current" size={14} className="me-1" />
                      <b>{userData?.user?.whatsapp_no || "Not available"}</b>
                    </p>
                    <p className="mb-2">
                      <i className="icon-feather-pin"></i>{" "}
                      <b>{userData?.user?.address || "Not available"}</b>
                    </p>

                    <div className="d-sm-flex justify-content-between">
                      <div className="social-share-wrap">
                        <a className="btn btn-sm btn-outline-primary w-auto">
                        <i className="bi bi-share me-1"></i> Share
                        </a>
                      </div>
                      <span className="edit-wrap">
                        <Link
                          href={`/profile-edit/${memberId}`}
                          className="btn btn-sm btn-primary"
                        >
                          <i class="bi bi-pencil-square me-1"></i>
                          {translation?.edit || "Edit"}
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Index);
