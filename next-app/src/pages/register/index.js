import React from 'react';

const Index = () => {
  return (
    <section className="section authentication-page">
      <div className="container h-100">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="authentication-container mx-auto w-100 bg-primary">
            <div className="row">
              <aside className="col-lg-6 col-12 text-white">
                <img
                  src="assets/images/authentication.png"
                  alt="Authentication"
                  className="img-fluid auth"
                />
                <h1>Welcome!</h1>
                <h4>Things you can do with this account</h4>
                <ul className="list list-1 list-get">
                  <li>Post one Single Property for FREE</li>
                  <li>Set property alerts for your requirement</li>
                  <li>Get accessed by over 1 Lakh buyers</li>
                  <li>Showcase your property as Rental, PG or for Sale</li>
                  <li>Get instant queries over Phone, Email and SMS</li>
                  <li>Performance in search &amp; Track responses &amp; views online</li>
                  <li>Add detailed property information &amp; multiple photos per listing</li>
                </ul>
              </aside>
              <aside className="col-lg-6 col-12">
                <form className="authentication-form" autoComplete="off">
                  <h3 className="mb-3">Sign Up</h3>
                  <label className="form-label d-block">Register as a/an</label>
                  <div className="btn-group btn-group-light d-flex mb-3" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="owner"
                      autoComplete="off"
                      defaultChecked
                    />
                    <label className="btn btn-outline-light" htmlFor="owner">
                      <img src="assets/images/icons/owner.png" alt="" height="32" width="32" /> Owner
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="agent"
                      autoComplete="off"
                    />
                    <label className="btn btn-outline-light" htmlFor="agent">
                      <img src="assets/images/icons/agent.png" alt="" height="32" width="32" /> Agent
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="userType"
                      id="builder"
                      autoComplete="off"
                    />
                    <label className="btn btn-outline-light" htmlFor="builder">
                      <img src="assets/images/icons/builder.png" alt="" height="32" width="32" /> Builder
                    </label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder=""
                      required
                    />
                    <label htmlFor="username" className="floating-label">Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder=""
                      required
                    />
                    <label htmlFor="email" className="floating-label">Email</label>
                  </div>

                  <div className="form-floating mb-3 with-icon-end">
                    <input
                      type="password"
                      id="current-password"
                      className="form-control"
                      placeholder=""
                      required
                      autoComplete="off"
                    />
                    <label htmlFor="current-password" className="floating-label">Password</label>
                    <a href="#" id="show-hide-pass" title="Show Password" data-placement="top">
                      <i className="icon-feather-eye-off"></i>
                    </a>
                  </div>
                  <div className="form-field">
                    <div className="input-group">
                      <div className="btn-group bootstrap-select input-group-btn" style={{ width: '80px' }}>
                        <button
                          type="button"
                          className="btn dropdown-toggle btn-default"
                          data-bs-toggle="dropdown"
                          role="button"
                          title="+91"
                        >
                          <span className="filter-option pull-left">+91</span>&nbsp;
                          <span className="bs-caret">
                            <span className="caret"></span>
                          </span>
                        </button>
                        <div className="dropdown-menu open" role="combobox">
                          <ul className="dropdown-menu inner" role="listbox">
                            <li className="selected">
                              <a tabIndex="0" role="option">
                                <span className="text">+91</span>
                              </a>
                            </li>
                            <li>
                              <a tabIndex="0" role="option">
                                <span className="text">+71</span>
                              </a>
                            </li>
                            <li>
                              <a tabIndex="0" role="option">
                                <span className="text">+81</span>
                              </a>
                            </li>
                            <li>
                              <a tabIndex="0" role="option">
                                <span className="text">+30</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <input type="text" className="form-control" placeholder="Mobile Number" />
                    </div>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary mb-2">Sign Up</button>
                  </div>

                  <p>
                    <small>
                      By signing up you agree to our{' '}
                      <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>.
                    </small>
                  </p>

                  <div className="social-login-separator">
                    <span>OR LOGIN WITH</span>
                  </div>

                  <div className="social-login-buttons">
                    <button type="button" className="btn btn-outline-primary btn-fb">
                      <span>Facebook</span>
                    </button>
                    <button type="button" className="btn btn-outline-success btn-google">
                      <span>Google</span>
                    </button>
                    <button type="button" className="btn btn-outline-secondary btn-apple">
                      <span>Apple</span>
                    </button>
                  </div>

                  <p className="text-center">
                    <small>
                      Already have an account? <a href="/login">Login Now</a>
                    </small>
                  </p>
                </form>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
