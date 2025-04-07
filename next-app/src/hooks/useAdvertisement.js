"use client";
import React, { useState, useEffect } from "react";
import AuthUser from "@/components/Authentication/AuthUser";

const useAdvertisement = (page, position, city, category) => {
  const { callApi } = AuthUser();
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvertisementData = async () => {
      setLoading(true);
      setError(null);
      let data = {
        page, position, city
      }

      if(category) {
        data.category = category
      }
      try {
        const response = await callApi({
          api: `/get-advertisements`,
          method: "UPLOAD",
          data: data,
        });

        if (response?.status === 1) {
          setAdsData(response.data);
        } else {
          setAdsData([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisementData();
  }, [page, position, city, category]);

  const logAdClick = async (advertisement_id, ad_url) => {
    try {
      await callApi({
        api: "/add-advertisement-view",
        method: "UPLOAD",
        data: {
          advertisement_id: advertisement_id,
        },
      });
      window.open(ad_url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error logging ad click:", error);
      window.open(ad_url, "_blank", "noopener,noreferrer");
    }
  };

  return { adsData, loading, error, logAdClick };
};

export default useAdvertisement;
