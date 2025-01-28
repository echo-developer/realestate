"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { BsPlusLg, BsClock, BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import Aos from "aos";
import "aos/dist/aos.css";

const Timeline = () => {
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    FetchTimeLineData();
    Aos.init();
    Aos.refresh();
  }, []);

  const FetchTimeLineData = async () => {
    try {
      const response = await callApi({
        api: "/enquery_timeline",
        method: "GET",
        data: {
          enquery_id: "1",
        },
      });

      if (response && response.status === 1) {
        setTimelineData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error fetching timeline data.");
    }
  };

  console.log("time line componer ran")

  const getStatusTitle = (status) => {
    switch (status) {
      case 1:
        return "No response";
      case 2:
        return "Date confirmation";
      case 3:
        return "Show interest";
      case 4:
        return "Visit site";
      default:
        return "Unknown status";
    }
  };

  return (
    <DashboardLayout>
      <div className="container">
        <div className="row">
          <aside className="col-lg col-12">
            <div className="p-4">
              <h1 className="h4 text-primary">Property CRM</h1>

              <ul className="nav mb-3 gap-4">
                <li className="nav-item">
                  <a className="nav-link" href="/property-crm">
                    CRM Lead Details
                  </a>
                </li>
                <li className="nav-item nav-underline">
                  <a className="nav-link active" href={`/property-crm-timeline`}>
                    Timeline
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/property-crm-calender`}>
                    Scheduled
                  </a>
                </li>
              </ul>

              <div className="d-flex align-items-center justify-content-end mb-4">
                <Button variant="primary" onClick={handleShow}>
                  Add New Data <BsPlusLg />
                </Button>
              </div>

              {/* <div className="timeline-container">
                {timelineData.map((step, index) => {
                  const statusTitle = getStatusTitle(step.enquery_status);
                  const direction = index % 2 === 0 ? "right" : "left"; 

                  return (
                    <div className={`row gx-lg-5 align-items-center timeline _${direction}`} key={index}>
                      <aside className={`col-lg col-12 ${direction === "right" ? "text-end" : "text-start"}`}>
                        <div className="timeline-box">
                          <div className="_body">
                            <h5 className="_title">{statusTitle}:</h5>
                            <div className="_details">
                              <h5>{step.remarks}</h5>
                            </div>
                          </div>
                        </div>
                      </aside>
                      <aside className="col-lg col-12 text-center">
                        <span className="timeline-badge bg-secondary-subtle text-dark">
                          <BsClock /> {new Date(step.action_taken_on).toLocaleString()}
                          <span className="arrow-icon text-primary">
                            {direction === "right" ? <BsChevronDoubleRight /> : <BsChevronDoubleLeft />}
                          </span>
                        </span>
                      </aside>
                      <aside className="col-lg col-12"></aside>
                    </div>
                  );
                })}
              </div> */}
              <div className="timeline-container">
                <div className="row gx-lg-5 align-items-center timeline _end" data-aos="fade-left">
                  <aside className="col-lg col-12 order-lg-3">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">No response:</h5>
                        <div className="_details">
                          <h5>Call:</h5>
                          <p>Call him but he was busy.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-2">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-right"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-1"></aside>
                </div>
                <div className="row gx-lg-5 align-items-center timeline _start" data-aos="fade-right">
                  <aside className="col-lg col-12 text-end">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">Date confirmation:</h5>
                        <div className="_details">
                          <h5>Fixed a date:</h5>
                          <p>He called us and gave a date to visit the office.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-left"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12"></aside>
                </div>
                <div className="row gx-lg-5 align-items-center timeline _end" data-aos="fade-left">
                  <aside className="col-lg col-12 order-lg-3">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">No response:</h5>
                        <div className="_details">
                          <h5>Call:</h5>
                          <p>Call him but he was busy.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-2">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-right"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-1"></aside>
                </div>
                <div className="row gx-lg-5 align-items-center timeline _start" data-aos="fade-right">
                  <aside className="col-lg col-12 text-end">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">Show interest:</h5>
                        <div className="_details">
                          <h5>Show interest:</h5>
                          <p>Call us and show interest to visit the site.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-left"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12"></aside>
                </div>
                <div className="row gx-lg-5 align-items-center timeline _end" data-aos="fade-left">
                  <aside className="col-lg col-12 order-lg-3">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">Visit site:</h5>
                        <div className="_details">
                          <h5>About property:</h5>
                          <p>Visited site, willing to take time to know more details about the site.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-2">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-right"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12 text-center order-lg-1"></aside>
                </div>
                <div className="row gx-lg-5 align-items-center timeline _start" data-aos="fade-right">
                  <aside className="col-lg col-12 text-end">
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">Final confirmation:</h5>
                        <div className="_details">
                          <h5>Return call:</h5>
                          <p>See all papers and documents. Give a final confirmation. He will call us.</p>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <i className="bi bi-clock"></i> 12/11/2024 10:12 am
                      <span className="arrow-icon text-primary">
                        <svg className="bi" width="24" height="24" fill="currentColor" role="img">
                          <use xlinkHref="bootstrap-icons.svg#chevron-double-left"></use>
                        </svg>
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12"></aside>
                </div>
              </div>

            </div>
          </aside>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CRMEnquiry />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Timeline;

{/* <>
<aside class="col-lg col-12">
        <div class="p-4">
        <h1 class="h4 text-primary">Property CRM</h1>

        <ul class="nav nav-underline mb-3 gap-4">
          <li class="nav-item">
            <a class="nav-link" href="#">CRM Lead Details</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#">Timeline</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Scheduled</a>
          </li>
        </ul> 
        <div class="d-flex align-items-center justify-content-end mb-4">
          
          <a href="javascript:void(0)" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#readmoreModal">Add New Data <i class="bi bi-plus-lg"></i></a>
        </div>
        <div class="timeline-container">
          <div class="row gx-lg-5 align-items-center timeline _end">
            <aside class="col-lg col-12 order-lg-3">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">No response:</h5>
                  <div class="_details">
                    <h5>Call: </h5>
                    <p>Call him but he was busy.</p>
                  </div>
                </div>
              </div>        
            </aside>
            <aside class="col-lg col-12 text-center order-lg-2">
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am        
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-right"></use>
                  </svg>
                </span>
              </span>
            </aside>
            <aside class="col-lg col-12 text-center order-lg-1"> </aside>                    
          </div>
          <div class="row gx-lg-5 align-items-center timeline _start">
            <aside class="col-lg col-12 text-end">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">Date confirmation:</h5>
                  <div class="_details">
                    <h5>Fixed a date:</h5>
                    <p>He call us and give a date to visit office</p>
                  </div>
                </div>
              </div>        
            </aside>          
            <aside class="col-lg col-12 text-center">                            
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-left"></use>
                  </svg>
                </span>
              </span>    
            </aside>
            <aside class="col-lg col-12"> </aside>          
          </div>     
          <div class="row gx-lg-5 align-items-center timeline _end">
            <aside class="col-lg col-12 order-lg-3">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">No response:</h5>
                  <div class="_details">
                    <h5>Call: </h5>
                    <p>Call him but he was busy.</p>
                  </div>
                </div>
              </div>        
            </aside>
            <aside class="col-lg col-12 text-center order-lg-2">
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-right"></use>
                  </svg>
                </span>
              </span>                    
            </aside>
            <aside class="col-lg col-12 text-center order-lg-1"> </aside>                    
          </div>
          <div class="row gx-lg-5 align-items-center timeline _start">
            <aside class="col-lg col-12 text-end">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">Show interest:</h5>
                  <div class="_details">
                    <h5>Show interest:</h5>
                    <p>Call us and show interest to visit site</p>
                  </div>
                </div>
              </div>        
            </aside>          
            <aside class="col-lg col-12 text-center">                            
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-left"></use>
                  </svg>
                </span>
              </span>    
            </aside>
            <aside class="col-lg col-12"> </aside>          
          </div>
          <div class="row gx-lg-5 align-items-center timeline _end">
            <aside class="col-lg col-12 order-lg-3">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">Visit site:</h5>
                  <div class="_details">
                    <h5>About property:</h5>
                    <p>Visited site, willing to take time for know more details about the site.</p>
                  </div>
                </div>
              </div>        
            </aside>
            <aside class="col-lg col-12 text-center order-lg-2">
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-right"></use>
                  </svg>
                </span>
              </span>                    
            </aside>
            <aside class="col-lg col-12 text-center order-lg-1"> </aside>                    
          </div>
          <div class="row gx-lg-5 align-items-center timeline _start">
            <aside class="col-lg col-12 text-end">
              <div class="timeline-box">
                <div class="_body">
                  <h5 class="_title">Final confirmation:</h5>
                  <div class="_details">
                    <h5>Return call:</h5>
                    <p>See all papers and documents. Give a final confirmation. He will call us</p>
                  </div>
                </div>
              </div>        
            </aside>          
            <aside class="col-lg col-12 text-center">                            
              <span class="timeline-badge bg-secondary-subtle text-dark"><i class="bi bi-clock"></i> 12/11/2024 10:12 am
                <span class="arrow-icon text-primary">
                  <svg class="bi" width="24" height="24" fill="currentColor" role="img">
                    <use xlink:href="bootstrap-icons.svg#chevron-double-left"></use>
                  </svg>
                </span>
              </span>    
            </aside>
            <aside class="col-lg col-12"> </aside>          
          </div>  
        </div>                 
      </div></aside>
</> */}
