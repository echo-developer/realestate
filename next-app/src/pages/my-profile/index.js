"use client";
import React, {useState, useEffect } from "react";
import Link from "next/link";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import DashboardLayout from "@/components/layout/DashboardLayout";
const index = () => {
  const {callApi ,GetMemberId}=AuthUser();
  const [userData,setUserData]=useState()

  const memberId = GetMemberId();
const translation = useTranslation();
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
      if(response && response.status === 1){
        setUserData(response.data)
      }else{
        toast.error(response.message)
      }
    } catch (error) {
      
    }
  }

  return (
    <DashboardLayout>
      {/* <div className="short-banner">
        <div className="container">
          
        </div>
      </div> */}
      <div className="col-lg">
        <div className="p-4">
        <h1 className="h3">{translation?.my_profile || "My Profile"}</h1>
          
            
              {/* <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">{translation?.dashboard || "Dashboard"}</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">{translation?.my_profile || "My Profile"}</a>
                </li>
              </ol> */}

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
                        <i className="icon-feather-mail"></i> {translation?.email || "Email:"}{" "}
                        <b> {userData?.user?.email || "not available"}</b>
                      </p>
                      <p className="mb-2">
                        <span>
                          <i className="icon-feather-phone"></i> {translation?.number || "Number:"}{" "}
                            <b>{(userData?.user?.phone && userData?.user?.phone !== 0) ? `${userData?.user?.phone_code || "+91"}-${userData?.user?.phone}` : "not available"}</b>
                        </span>
                      </p>
                      <div className="d-sm-flex justify-content-between">
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
                            <i className="icon-feather-edit-3"></i> {translation?.edit || "Edit:"}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      

             
          
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(index);
