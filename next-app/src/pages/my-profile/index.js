"use client";
import React, {useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import withAuth from "@/utils/withAuth";

const index = () => {
  const {callApi ,GetMemberId}=AuthUser();
  const [userData,setUserData]=useState()

  const memberId = GetMemberId();

  useEffect(()=>{
    if(memberId){
      fetchUserData();
    }
  },[memberId])

  const  fetchUserData =async()=>{
    try {
      const response = await callApi({
        api:`/my_profile`,
        method:'GET',
        data:{
          user_id:memberId
        }
      })
      console.log(response)
      if(response && response.success === 1){
        setUserData(response.data)
      }else{
        toast.error(response.message)
      }
    } catch (error) {
      
    }
  }

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1>My Profile</h1>
        </div>
      </div>
      <div className="section profile">
        <div className="container-fluid">
          <div className="row main-row">
            <aside className="col-xl-8 col-lg-8 col-12">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">My Profile</a>
                </li>
              </ol>

              <div className="card card-agent-page mb-4">
                <div className="row g-0">
                  <div className="col-sm-auto col-4">
                    <div className="card-image">
                      <img
                        alt="Profile"
                        className="img-fluid"
                        src= {`${userData?.user?.image || "assets/images/agents/user.jpg"}`}
                      />
                    </div>
                  </div>
                  <div className="col-sm col-8">
                    <div className="card-body">
                      <div className="card-title">
                        <h4 className="mb-1">
                         {userData?.user?.name || "user"}<i className="icon-img-check ms-2"></i>
                        </h4>
                      </div>
                      <p className="mb-1">
                        <i className="icon-feather-map-pins"></i> Email:{" "}
                        <b> {userData?.user?.email || "not available"}</b>
                      </p>
                      <p className="mb-2">
                        <span>
                          <i className="material-icons-outlined"></i> Number:{" "}
                          <b> {userData?.user?.phone_code || "+91"}{"-"}{userData?.user?.phone || "not available"}</b>
                        </span>
                      </p>
                      <div className="d-sm-flex">
                        <div className="social-share-wrap">
                          <a className="btn btn-sm btn-outline-site w-auto">
                            <i className="icon-feather-share-2"></i> Share
                          </a>
                          <div className="share-items">
                            <a
                              className="btn-floating btn btn-tw"
                              title="Share on Facebook"
                            >
                              <i className="icon-brand-facebook-f"></i>
                            </a>
                            <a className="btn-floating btn btn-tw">
                              <i className="icon-brand-twitter"></i>
                            </a>
                            <a
                              className="btn-floating btn btn-tw"
                              title="Share on LinkedIn"
                            >
                              <i className="icon-brand-linkedin-in"></i>
                            </a>
                            <a className="btn-floating btn btn-tw">
                              <i className="icon-brand-whatsapp"></i>
                            </a>
                          </div>
                        </div>
                        <span className="edit-wrap">
                          <Link href={`/profile-edit/${memberId}`} className="btn btn-sm btn-primary" >
                            <i className="icon-feather-edit-3"></i> Edit
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <aside className="col-xl-4 col-lg-4 col-12">
              <div className="sticky-top">
                <div className="sort-by mb-2">
                  <a
                    className="btn me-2 ads-fav"
                    data-act="favourite1"
                    title="Save for Later"
                  >
                    <i className="icon-line-awesome-heart-o"></i>
                  </a>
                  <a
                    className="btn me-2"
                    title="Report this Ad"
                    data-bs-toggle="modal"
                    data-bs-target="#reportModal"
                  >
                    <i className="icon-feather-flag"></i>
                  </a>
                  <a className="btn me-2" title="Print">
                    <i className="icon-feather-printer"></i>
                  </a>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h4>Office Address</h4>
                    <address>
                      <i className="icon-feather-map-pin text-site"></i> UAE
                    </address>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d41679.52785359438!2d88.48371227343004!3d22.57967938036654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3a02758cf3b6a0ab%3A0x154c5e7f95e124b0!2s40%2C%203rd%20floor%2C%20FB%2C%203110%2C%20Rajdanga%20Main%20Rd%2C%20Kolkata%2C%20West%20Bengal%20700107!3m2!1d22.512608!2d88.3972172!5e0!3m2!1sen!2sin!4v1735799683853!5m2!1sen!2sin"
                      width="600"
                      height="315"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Office Location"
                      style={{ border: 0, width: "100%" }}
                    ></iframe>
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

export default withAuth(index);
