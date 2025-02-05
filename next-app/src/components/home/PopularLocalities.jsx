"use client";
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';

const PopularLocalities = () => {
  const { callApi } = AuthUser();
  const [activeTab, setActiveTab] = useState(null);
  const [cityTabs, setCityTabs] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const localities = [
    { name: 'Rajarhat', image: 'assets/images/company/company-10.jpg', priceRange: '$34,999 - $39,999', reviews: 204 },
    { name: 'Newtown', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$30,000 - $35,000', reviews: 150 },
    { name: 'EM Bypass', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$25,000 - $30,000', reviews: 120 },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };


  const getCityTabs = async () => {
    try {
      const res = await callApi({
        api: "/get_property_cities",
        method: "GET"
      })
      if (res && res?.status === 1) {
        setCityTabs(res?.data);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }


  useEffect(() => {
    getCityTabs();
  }, [])


  useEffect(() => {
    if (cityTabs?.length > 0) {
      setActiveTab(cityTabs[0]);
    }
  }, [cityTabs?.length])


  useEffect(() => {
    if (activeTab) {
      const getProjectList = async () => {
        try {
          const res = await callApi({
            api: `/project_list_by_city?city_id=${activeTab?.city_id  || 1}`,
            method: "GET"
          })

          if (res && res?.status === 1) {
            setProjectList(res?.data);
          }
        } catch (error) {
          console.error(error?.message || "Something went wrong")
        }
      }


      getProjectList();
    }
  }, [activeTab])

  return (
    <section className="section">
      <div className="container-fluid">
        <div className="row gx-3">
          <aside className="col-xl-3 col-lg-4 col-12">
            <div className="card card-v-agent h-100">
              <div className="card-body d-flex align-items-center">
                <div className="Name">
                  <h2>Explore</h2>
                  <h3 className="mb-0">Popular Localities in Kolkata</h3>
                </div>
              </div>
            </div>
          </aside>
          <aside className="col-xl-9 col-lg-8 col-12">
            <div className="card h-100">
              <div className="card-header p-0">
                <ul className="nav nav-underline nav-fill">
                  {cityTabs?.length > 0 && cityTabs.map((locality, index) => (
                    <li className="nav-item" key={index} onClick={() => setActiveTab(locality)}>
                      <a className={`nav-link ${activeTab?.name === locality?.name ? "active" : ""}`} role="button">
                        {locality?.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                {projectList?.length > 0 && (
                  <Carousel
                    responsive={responsive}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    arrows={false}
                    infinite={true}
                    keyBoardControl={true}
                    containerClass="carousel-container"
                    itemClass="px-3"
                  >
                    {/* {localities.map((locality, index) => (
                    <div key={index} className="card card-city">
                      <div className="card-body">
                        <div className="d-flex">
                          <img
                            src={locality.image}
                            alt={locality.name}
                            height="64"
                            width="64"
                            className="rounded-circle"
                          />
                          <div className="flex-grow-1 ps-3">
                            <h4>
                              {locality.name}, Block C02, Apartment <a href=""><i className="bi bi-box-arrow-up-right"></i></a>
                            </h4>
                            <h5>{locality.priceRange}</h5>
                            <p>
                              <i className="bi bi-star-fill text-warning"></i> 4.0 &nbsp; | &nbsp; {locality.reviews} Reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))} */}
                    {projectList?.map((project, i) => {
                      const firstImage = project?.gallery?.length > 0 ? project?.gallery[0]?.images[0] : "";
                      return (
                        <div key={i} className="card card-city">
                          <div className="card-body">
                            <div className="d-flex">
                              <img
                                src={firstImage?.file}
                                alt="Locality Name"
                                height="64"
                                width="64"
                                className="rounded-circle"
                              />
                              <div className="flex-grow-1 ps-3">
                                <h4>
                                  {project?.project_name}
                                  <a href=""><i className="bi bi-box-arrow-up-right"></i></a>
                                </h4>
                                <h5>$500,000 - $800,000</h5>
                                <p>
                                  {project?.stars && (
                                    <>
                                      <i className="bi bi-star-fill text-warning"></i> {project.stars} &nbsp; | &nbsp; {project.reviews}
                                    </>
                                  )}

                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                      )
                    })}
                  </Carousel>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PopularLocalities;
