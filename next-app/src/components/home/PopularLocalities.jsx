"use client";
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';
import Link from 'next/link';
 

const PopularLocalities = ({translation}) => {
  const { callApi } = AuthUser();
  const [activeTab, setActiveTab] = useState('');
  const [projectListData, setProjectListData] = useState(null);

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };




  useEffect(() => {
    if (projectListData) {
      const key = Object.keys(projectListData)[0];
      setActiveTab(key);
    }
  }, [projectListData])


  useEffect(() => {
    const getProjectList = async () => {
      try {
        const res = await callApi({
          api: `/project_list_by_city`,
          method: "GET"
        })
        if (res && res?.status === 1) {
          setProjectListData(res?.data);

        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      }
    }


    getProjectList();
  }, [])




  return (
    <section className="section pb-0">
      <div className="container-fluid">
        <div className="row gx-3">
          <aside className="col-xl-3 col-lg-4 col-12">
            <div className="card h-100-mb-3">
              <div className="card-body d-flex align-items-center">
                <div className="Name">
                  <h2>{translation?.explore || "Explore"}</h2>
                  <h3 className="mb-0">{translation?.popular_localities ? `${translation?.popular_localities} in ${activeTab?.name}` : `Popular Localities in ${activeTab?.name}`}</h3>
                </div>
              </div>
            </div>
          </aside>
          <aside className="col-xl-9 col-lg-8 col-12">
            <div className="card h-100-mb-3">
              <div className="card-header p-0">
                <ul className="nav nav-underline nav-fill">
                  {projectListData && Object.keys(projectListData).map((key, i) => {
                    return (
                      <li className="nav-item" key={i} onClick={() => setActiveTab(key)}>
                        <a className={`nav-link ${activeTab === key ? "active" : ""}`} role="button">
                          {key}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="card-body px-2">
                {projectListData?.[activeTab] && projectListData?.[activeTab]?.length > 0 ? (
                  <Carousel
                    responsive={responsive}
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    arrows={true}
                    infinite={true}
                    keyBoardControl={true}
                    containerClass="carousel-container pb-0"
                    itemClass="px-2"
                  >
                    {projectListData[activeTab]?.map((project, i) => {
                      const firstImage = project?.gallery?.length > 0 ? project?.gallery[0]?.images[0] : "";
                      return (
                        <div key={i} className="card card-city">
                          <div className="card-body">
                            <div className="d-flex align-items-center">
                              <img
                                src={firstImage?.file}
                                alt="Locality Name"
                                height="64"
                                width="64"
                                className="rounded-circle"
                                loading="lazy"
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
                  <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" loading="lazy"/>
                  <p className='text-muted'>{translation?.no_record_founds || "No Record Founds"}</p>
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
