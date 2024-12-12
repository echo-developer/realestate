import React from "react";

const PropertySidebar = () => {
  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          <div className="rateStar me-2">
            <i className="icon-line-awesome-star text-warning"></i> <span>3.5/5</span>
          </div>
          <button className="btn me-2 ads-fav" title="Save for Later">
            <i className="icon-line-awesome-heart-o"></i>
          </button>
          <button className="btn me-2" title="Add to Compare">
            <i className="icon-img-compare m-0"></i>
          </button>
          <button className="btn me-2" title="Report this Ad">
            <i className="icon-feather-flag"></i>
          </button>
          <button className="btn me-2" title="Print">
            <i className="icon-feather-printer"></i>
          </button>
          <button className="btn btn-sm btn-outline-primary w-auto">
            <i className="icon-feather-share-2"></i> Share
          </button>
        </div>

        <div className="card border-0 shadow-1 mb-3 text-center">
          <div className="card-body">
            <div className="mb-3">
              <img
                src="assets/images/agents/agent-6.jpg"
                alt="Agent image"
                height="84"
                width="84"
                className="rounded-circle"
              />
            </div>
            <h4>Contact Owner</h4>
            <h5>
              Sunil <span>+91 26********</span>
            </h5>
            <div className="d-grid">
              <button className="btn btn-primary">Get Phone Number</button>
            </div>
          </div>
        </div>

        <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
          <h4 className="mb-0">Download Brochure</h4>
          <a href="">
            <img src="assets/images/icons/brochure.png" alt="Download Brochure" height="32" />
          </a>
        </div>

        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="user-profile align-items-center">
              <div className="mb-3">
                <img
                  src="assets/images/agents/agent-2.jpg"
                  alt="Agent image"
                  height="84"
                  width="84"
                  className="rounded-circle"
                />
              </div>
              <div>
                <h4>
                  Millan Mathew{" "}
                  <i
                    className="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h4>
                <p className="mb-0">
                  <i>400+ Buyer served</i>
                </p>
                <div className="star-rating" data-rating="3.5">
                  <span className="star"></span>
                  <span className="star"></span>
                  <span className="star"></span>
                  <span className="star half"></span>
                  <span className="star empty"></span>
                </div>
                <p className="text-muted">Real Estate Agent</p>
                <p>
                  <i className="icon-feather-map-pin text-site"></i> A.C Sarkar Road, Ariadaha, PS Belghoria, Dakshineswar, Kolkata - North 24 Parganas District, West Bengal
                </p>

                <ul className="p-0">
                  <li className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Operating Since:</span> <span>2010</span>
                  </li>
                  <li className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Properties For Sale:</span> <span>320</span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">Properties For Rent:</span> <span>150</span>
                  </li>
                </ul>
                <div className="d-grid">
                  <button className="btn btn-primary">Contact Agent</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Top Agents In This Locality</h4>
            <div className="d-flex align-items-center mb-3">
              <img
                src="assets/images/agents/agent-9.jpg"
                alt="Agent image"
                height="64"
                width="64"
                className="rounded-circle"
              />
              <div className="flex-grow-1 ps-3">
                <h5 className="mb-0">
                  <a href="">Udaya Singh</a>{" "}
                  <i
                    className="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h5>
                <p className="mb-0 text-muted">Udaya Real Estate</p>
                <p className="mb-2">
                  <i className="icon-line-awesome-star text-warning"></i>{" "}
                  <span className="text-muted">4.3 Rating</span>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-2">
              <img
                src="assets/images/agents/agent-12.jpg"
                alt="Agent image"
                height="64"
                width="64"
                className="rounded-circle"
              />
              <div className="flex-grow-1 ps-3">
                <h5 className="mb-0">
                  <a href="">Myra Seikh</a>{" "}
                  <i
                    className="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h5>
                <p className="mb-0 text-muted">Myra Real Estate</p>
                <p className="mb-2">
                  <i className="icon-line-awesome-star text-warning"></i>{" "}
                  <span className="text-muted">4.3 Rating</span>
                </p>
              </div>
            </div>
            <a href="">
              View All Agents <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>

        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Looking For A Property</h4>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" placeholder=" " required />
              <label htmlFor="">Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="input-group mb-3">
              <div className="btn-group bootstrap-select input-group-btn fit-width">
                <button
                  type="button"
                  className="btn dropdown-toggle btn-default"
                  data-bs-toggle="dropdown"
                  role="button"
                  title="IND +91"
                >
                  <span className="filter-option pull-left">IND +91</span>&nbsp;
                  <span className="bs-caret">
                    <span className="caret"></span>
                  </span>
                </button>
                <div className="dropdown-menu open" role="combobox">
                  <ul className="dropdown-menu inner" role="listbox">
                    <li data-original-index="0" className="selected">
                      <a className="">
                        <span className="text">IND +91</span>
                      </a>
                    </li>
                    <li data-original-index="1">
                      <a className="">
                        <span className="text">+81</span>
                      </a>
                    </li>
                    <li data-original-index="2">
                      <a className="">
                        <span className="text">+71</span>
                      </a>
                    </li>
                    <li data-original-index="3">
                      <a className="">
                        <span className="text">+61</span>
                      </a>
                    </li>
                    <li data-original-index="4">
                      <a className="">
                        <span className="text">+51</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <select className="selectpicker" data-width="fit" tabIndex="-98">
                  <option>IND +91</option>
                  <option>+81</option>
                  <option>+71</option>
                  <option>+61</option>
                  <option>+51</option>
                </select>
              </div>
              <div className="form-floating">
                <input
                  type="number"
                  className="form-control"
                  placeholder=" "
                  id="phone"
                  required
                />
                <label htmlFor="phone">Phone Number</label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default PropertySidebar;
