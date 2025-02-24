"use client";
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';
import Link from 'next/link';

const PopularLocalities = () => {
  const { callApi } = AuthUser();
  const [activeTab, setActiveTab] = useState(null);
  const [cityTabs, setCityTabs] = useState([]);
  const [projectList, setProjectList] = useState([]);

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
          <aside className="col-xl-3 col-lg-4 col-12 mb-3">
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
              <div className="card-body px-2">
                {projectList?.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    arrows={true}
                    infinite={true}
                    keyBoardControl={true}
                    containerClass="carousel-container"
                    itemClass="px-2"
                  >
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
                                  <Link target='_blank' href={`project-details/${project?.slug}`}><i className="bi bi-box-arrow-up-right" target="_blank"></i></Link>
                                </h4>
                                <h5>{project?.budget}</h5>
                                <p>
                                  {project?.stars && (
                                    <>
                                      <i className="bi bi-star-fill text-warning"></i> {project?.stars} &nbsp; | &nbsp; {project?.reviews}
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
                ):(                  
                  <>
                  <div className='text-center'>
                  <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" />
                  <p className='text-muted'>No Record Founds</p>
                  </div>
                  </>                                    
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
