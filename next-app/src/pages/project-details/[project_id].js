import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResidentialProjectDetails from "@/components/postproject/ResidentialProjectDetails";
import CommercialProjectDetails from "@/components/postproject/CommericalProjectDetails";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import { ShimmerFeaturedGallery } from "react-shimmer-effects";

const Index = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { project_id } = router.query;
  const [detailsData, setDetailsData] = useState({});
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    if (project_id) {
      FetchProjectDetails();
    }
  }, [project_id]);

  const FetchProjectDetails = async () => {
    setLoading(true)
    try {
      const response = await callApi({
        api: `/project-details/${project_id}`,
        method: "GET",
      });
      if (response && response?.status === 1) {
        setDetailsData(response?.data);
      }
    } catch (error) {
      console.error('response not found')
    }finally{
      setLoading(false)
    }
  };
  
  return (
    <MainLayout>
      <Helmet>
        <title>
          Premium Real Estate Project Details | Modern Living & Investment
          Opportunities
        </title>
        <meta
          name="description"
          content="Explore premium real estate project details with modern amenities, prime locations, and excellent investment opportunities. Find your dream home or next property investment today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {detailsData?.project_type === "Residential" ? (
        <ResidentialProjectDetails detailsData={detailsData} loading={loading} />
      ) : (
        // <CommercialProjectDetails detailsData={detailsData} loading={loading}/>
        ''
      )}
    </MainLayout>
  );
};

export default Index;
