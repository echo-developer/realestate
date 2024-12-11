"use client"
import React from 'react';
import SideBar from '../sidebar/SideBar';
import Header from '../header/Header';

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
    </React.Fragment>
  );
};

export default DashboardLayout;
