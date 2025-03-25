import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResidentialProjectDetails from "@/components/postproject/ResidentialProjectDetails";
import CommercialProjectDetails from "@/components/postproject/CommericalProjectDetails";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";

const Index = () => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const router = useRouter();
  const { project_id } = router.query;
  const [detailsData, setDetailsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const memberId = GetMemberId();
  const translation = useTranslation();
  const [userDetails,setUserDetails]=useState()
  useEffect(() => {
    if (project_id) {
      FetchProjectDetails();
    }
  }, [project_id, memberId]);

  const FetchProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/project-details/${project_id}&user_id=${memberId}`,
        method: "GET",
      });
      if (response && response?.status === 1) {
        setDetailsData(response.data);
        setUserDetails(response?.data?.user_details)
      }
    } catch (error) {
      console.error("response not found");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const addRemoveFav = async (projectId, type) => {
    if (isLogin()) {
      try {
        const res = await callApi({
          api: "/add_my_fav_project",
          method: "POST",
          data: {
            user_id: memberId,
            project_id: projectId,
          },
        });

        if (res && res?.status === 1) {
          toast.success(res?.message);
          if (type === "similar_projects") {
            updateSimilarProjects(projectId);
          } else if(type === "nearby_projects") {
            updateNearByProjects(projectId)
          } else if(type === "other_projects") {
            updateOtherProjects(projectId)
          }
           else {
            setDetailsData((prev) => {
              return {
                ...prev,
                is_favourite: !prev?.is_favourite,
              };
            });
          }
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong");
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const updateSimilarProjects = (id) => {
    const list = detailsData?.similar_projects || [];
    const newList = list?.map((item, i) => {
      if (item?.id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite,
        };
      } else {
        return item;
      }
    });

    setDetailsData((prev) => {
      return {
        ...prev,
        similar_projects: newList,
      };
    });
  };

  const updateNearByProjects = (id) => {
    const list = detailsData?.nearby_projects || [];
    const newList = list?.map((item, i) => {
      if (item?.id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite,
        };
      } else {
        return item;
      }
    });

    setDetailsData((prev) => {
      return {
        ...prev,
        nearby_projects: newList,
      };
    });
  };

  const updateOtherProjects = (id) => {
    const list = detailsData?.other_projects || [];
    const newList = list?.map((item, i) => {
      if (item?.id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite,
        };
      } else {
        return item;
      }
    });

    setDetailsData((prev) => {
      return {
        ...prev,
        other_projects: newList,
      };
    });
  }

  const addFavSimilarProjects = (id) => {
    addRemoveFav(id, "similar_projects");
  };

  const addFavNearByProjects = (id) => {
    addRemoveFav(id, "nearby_projects")
  }

  const addFavOtherProjects = (id) => {
    addRemoveFav(id, "other_projects")
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
        <ResidentialProjectDetails
          detailsData={detailsData}
          loading={loading}
          addRemoveFav={addRemoveFav}
          addFavSimilarProjects={addFavSimilarProjects}
          addFavOtherProjects={addFavOtherProjects}
          addFavNearByProjects={addFavNearByProjects}
          loginCheck={isLogin}
          setShowLoginErrorModal={setShowLoginErrorModal}
          userDetails={userDetails}
        />
      ) : (
        <CommercialProjectDetails
          detailsData={detailsData}
          loading={loading}
          addRemoveFav={addRemoveFav}
          addFavSimilarProjects={addFavSimilarProjects}
          addFavNearByProjects={addFavNearByProjects}
          addFavOtherProjects={addFavOtherProjects}
          loginCheck={isLogin}
          setShowLoginErrorModal={setShowLoginErrorModal}
          userDetails={userDetails}
        />
      )}

      {/* Modal for login error */}
      <Modal
        show={showLoginErrorModal}
        onHide={handleLoginErrorClose}
        centered
        size="lg"
      >
        <Modal.Header>
          <button
            className="btn btn-secondary"
            onClick={handleLoginErrorClose}
            style={{ position: "absolute", left: "15px" }}
          >
            Cancel
          </button>
          <Modal.Title className="mx-auto">Login Required</Modal.Title>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              router?.push("/login");
            }}
            style={{ position: "absolute", right: "15px" }}
          >
            Login
          </button>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Please log in to perform this action.</p>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

export default Index;
