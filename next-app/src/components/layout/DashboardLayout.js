"use client";
import React from 'react';
import SideBar from '../sidebar/SideBar';
import Header from '../header/Header';
import MobileFooter from '../addtional/MobileFooter';
import dynamic from 'next/dynamic';

const DashboardLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      <div className="section p-0">
        <div className="container-fluid p-0">
          <div className="d-flex flex-wrap">
            <SideBar />
            <>{children}</>

          </div>
        </div>
      </div>
      <MobileFooter />
    </React.Fragment>
  );
};

export default DashboardLayout;
