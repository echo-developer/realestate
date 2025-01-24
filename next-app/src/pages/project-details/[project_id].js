import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResidentialProjectDetails from "@/components/postproject/ResidentialProjectDetails";
import CommercialProjectDetails from "@/components/postproject/CommericalProjectDetails";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";

const Index = () => {
    const { callApi } = AuthUser();
    const router = useRouter();
    const { project_id } = router.query;
    const [detailsData, setDetailsData] = useState({});

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
            {detailsData.project_type === "Residential" ? (
                 <ResidentialProjectDetails detailsData={detailsData}/>
            ) : (
                <CommercialProjectDetails detailsData={detailsData}/>
            )}
        </MainLayout>
    );
};

export default Index;
