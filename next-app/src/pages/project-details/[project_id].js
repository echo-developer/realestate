import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResidentialProjectDetails from "@/components/postproject/ResidentialProjectDetails";
import CommercialProjectDetails from "@/components/postproject/CommericalProjectDetails";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { project_id } = router.query;
  const [detailsData, setDetailsData] = useState({});

  console.log(project_id);

  useEffect(() => {
    if (project_id) {
      FetchProjectDetails();
    }
  }, [project_id]);

  const FetchProjectDetails = async () => {
    try {
      const response = await callApi({
        api: `/project-details/${project_id}`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setDetailsData(response.data);
      }
    } catch (error) {}
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

      {detailsData.project_type === "Residential" ? (
        <ResidentialProjectDetails detailsData={detailsData} />
      ) : (
        <CommercialProjectDetails detailsData={detailsData} />
      )}
    </MainLayout>
  );
};

export default Index;
