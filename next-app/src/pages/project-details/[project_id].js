import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResidentialProjectDetails from "@/components/postproject/ResidentialProjectDetails";
import CommercialProjectDetails from "@/components/postproject/CommericalProjectDetails";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify"

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
  const { project_id } = router.query;
  const [detailsData, setDetailsData] = useState({});
  const [loading,setLoading] = useState(true);
  const memberId = GetMemberId();
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

  const addRemoveFav = async (projectId, type) => {
    try {
      const res = await callApi({
        api: "/add_my_fav_project",
        method: "POST",
        data: {
          user_id: memberId,
          project_id: projectId
        }
      })

      if(res && res?.status === 1) {
        toast.success(res?.message)
        if(type === "similar_projects") {
          updateSimilarProjects(projectId);
        } else {
          setDetailsData(prev => {
            return {
              ...prev,
              is_favourite: !prev?.is_favourite
            }
          })
        }
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }

  }

  const updateSimilarProjects = (id) => {
    const list = detailsData?.similar_projects || [];
    const newList = list?.map((item, i) => {
      if(item?.id == id) {
        return {
          ...item,
          is_favorite: !item?.is_favorite
        }
      } else {
        return item;
      }
    })

    setDetailsData(prev => {
      return {
        ...prev,
        similar_projects: newList
      }
    })
  }

  const addFavSimilarProjects = (id) => {
    addRemoveFav(id, "similar_projects")
  }
  
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
        <ResidentialProjectDetails detailsData={detailsData} loading={loading} addRemoveFav={addRemoveFav} addFavSimilarProjects={addFavSimilarProjects} />
      ) : (
        <CommercialProjectDetails detailsData={detailsData} loading={loading} addRemoveFav={addRemoveFav} addFavSimilarProjects={addFavSimilarProjects}/>
      )}
    </MainLayout>
  );
};

export default Index;
