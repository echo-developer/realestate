import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import Image from 'next/image'

const Advertisements = ({ page, position }) => {
  const { callApi } = AuthUser();
  const [adsData, setAdsData] = useState([]);

  const fetchAdvertiseData = async () => {
    try {
      const response = await callApi({
        api: `/get-advertisements`,
        method: "UPLOAD", // Change to GET instead of UPLOAD
        data: { page, position },
      });

      if (response?.status === 1) {
        setAdsData(response.data);
      }
    } catch (error) {
      console.error("Error fetching advertisements:", error);
    }
  };

  useEffect(() => {
    fetchAdvertiseData();
  }, [page, position]);

  return (
    <div>
      {adsData?.length > 0 ? (
        adsData.map((ad) => (
          <a href={ad.ad_url} key={ad.advertisement_id} target="_blank" rel="noopener noreferrer">
            <picture>
              {/* Mobile Image */}
              <source media="(max-width: 768px)" srcSet={ad.ad_image_mobile} />
              {/* Desktop Image */}
              <Image
  src={ad.ad_image}
  alt={`Advertisement ${ad.advertisement_id}`}
  width={0}
  height={0}
  sizes="100vw"
  style={{ width: "100%", height: "auto" }}
  unoptimized
  loading="lazy"
/>
            </picture>
          </a>
        ))
      ) : (
        <p>No ads available</p>
      )}
    </div>
  );
};

export default Advertisements;
