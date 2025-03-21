import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/Payment/PaymentForm";
import {ButtonGroup, Modal, Row, Col} from "react-bootstrap";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/utils/withAuth";
import { Paypal, Stripe } from "react-bootstrap-icons";

const stripePromise = loadStripe("pk_test_kEgv3z7UGnLOVlM505HPStbW");

const StripePayment = ({ messageCredit, balance, allLanguageKey }) => {
  const [show, setShow] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("stripe");
  const [isLoading, setIsLoading] = useState(false);

  const planId = localStorage.getItem("planId");
  const PlanPrice = localStorage.getItem("plan_price");

  const handlePaymentOption = () => {
    if (selectedPaymentMethod === "stripe") {
      setShow(true);
    } else {
      alert("Currently only Stripe is integrated");
    }
  };

  console.log(planId ,PlanPrice)

  const handleClose = () => {
    setShow(false);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  return (
    <DashboardLayout>
      <React.Fragment>
        
        <div className="col-lg">
        <section className="section">
          <Row className="justify-content-center">
            <article className="col-xl-6 col-lg-8 col-12">
              <div className="card card-plan">
                <div className="card-body">
                  <h3 className="text-center mb-4">{messageCredit.plan_name}</h3>
                  <hr />
                  <h4 className="d-flex justify-content-between mb-4">
                    <span>{allLanguageKey?.message_credit}</span>
                    <span>{messageCredit.message_credit}</span>
                  </h4>
                  <h4 className="d-flex justify-content-between mb-4">
                    <span>{allLanguageKey?.message_price}</span>
                    <span className="price_container">$ {PlanPrice}</span>
                  </h4>

                  <div className="input-group mb-4">
                    <input
                      type="text"
                      id="coupon_code"
                      name="coupon_code"
                      className="form-control"
                      placeholder={allLanguageKey?.coupon_code}
                    />
                    <button
                      id="couponButton"
                      className="btn btn-warning"
                      onClick={() => alert("Apply coupon function not implemented")}
                    >
                      {allLanguageKey?.apply || "Apply"}
                    </button>
                  </div>

                  <h4>{allLanguageKey?.payment_method}</h4>
                  <ButtonGroup
                    className="btn-group btn-group-light d-flex gap-3 mb-4"
                    role="group"
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="payment_method"
                      id="btnradio1"
                      autoComplete="off"
                      value="paypal"
                      onChange={handlePaymentMethodChange}
                    />
                    <label className="btn btn-outline-light p-3" htmlFor="btnradio1">
                      {/* Removed PayPal image */}
                      <Paypal color="#333" size={36} className="me-2" />
                      <span className="d-block">PayPal</span>
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="payment_method"
                      id="btnradio2"
                      autoComplete="off"
                      value="stripe"
                      onChange={handlePaymentMethodChange}
                    />
                    <label className="btn btn-outline-light p-3" htmlFor="btnradio2">
                      {/* Removed Stripe image */}
                      <Stripe color="#333" size={36} className="me-2" />
                      <span className="d-block">Stripe</span>
                    </label>
                  </ButtonGroup>

                  <div className="d-grid text-center mb-4">
                    <button
                      type="button"
                      id="subscribe_plan"
                      className="btn btn-primary"
                      onClick={handlePaymentOption}
                    >
                      {allLanguageKey?.message_payment_process}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </Row>
        
        </section>
        </div>

        <Modal show={show} onHide={handleClose} className="custom-modal">
          <Modal.Header>
            <button
              onClick={handleClose}
              type="button"
              className="btn-close"
            ></button>
          </Modal.Header>
          <Modal.Body>
            {show && (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  handleClose={handleClose}
                  planId={planId}
                  amount={PlanPrice}
                />
              </Elements>
            )}
          </Modal.Body>
        </Modal>
      </React.Fragment>
    </DashboardLayout>
  );
};

// Static Props (for demonstration)
export async function getStaticProps() {
  const messageCredit = {
    plan_name: "Standard Plan",
    message_credit: 1000,
    price: 10.0,
    plan_id: "12345",
  };
  const balance = 500;
  const allLanguageKey = {
    message_credit: "Message Credit",
    message_price: "Price",
    payment_method: "Payment Method",
    apply: "Apply",
    coupon_code: "Coupon Code",
    message_payment_process: "Proceed with Payment",
  };

  return {
    props: {
      messageCredit,
      balance,
      allLanguageKey,
    },
  };
}

export default withAuth(StripePayment);
