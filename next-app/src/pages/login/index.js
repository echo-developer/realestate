import React from 'react';

const Index = () => {
  return (
    <section className="section authentication-page">
      <div className="container h-100">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="authentication-container mx-auto w-100 bg-primary">
            <div className="row justify-content-center align-items-center">
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
                <form
                  className="authentication-form"
                  autoComplete="off"
                >
                  <h3 className="mb-4">Sign In</h3>

                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder=" "
                      required
                    />
                    <label htmlFor="username" className="floating-label">
                      Username
                    </label>
                  </div>
                  <div className="form-floating mb-4 with-icon-end">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder=" "
                      maxLength="8"
                      required
                      autoComplete="off"
                    />
                    <label htmlFor="password" className="floating-label">
                      Password
                    </label>
                    <a
                      href="#"
                      id="show-hide-pass"
                      title="Show Password"
                      data-placement="top"
                    >
                      <i className="icon-feather-eye-off"></i>
                    </a>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary mb-2">
                      Log In
                    </button>
                  </div>
                  <p className="text-end">
                    <a href="#">Forgot Password?</a>
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
                      Don’t have an account? <a href="#">Register Now</a>
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
