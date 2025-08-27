"use client";
import React from 'react';
import SideBar from '../sidebar/SideBar';
import dynamic from 'next/dynamic';
import useIsMobile from '@/hooks/useIsMobile';
const Header = dynamic(() => import('../header/Header'), { ssr: false })
const MobileFooter = dynamic(() => import('../addtional/MobileFooter'), {ssr: false})

const DashboardLayout = ({ children }) => {
  const isMobile = useIsMobile();
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
      {isMobile && <MobileFooter />}
    </React.Fragment>
  );
};

export default DashboardLayout;
