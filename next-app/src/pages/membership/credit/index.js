import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/Payment/PaymentForm";
import { ButtonGroup, Modal, Row, Col, Form, Button, Card } from "react-bootstrap";
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
  const PlanValidate = localStorage.getItem("plan_validate");
  const PlanName = localStorage.getItem("plan_name");

  const handlePaymentOption = () => {
    if (selectedPaymentMethod === "stripe") {
      setShow(true);
    } else {
      alert("Currently only Stripe is integrated");
    }
  };


  console.log(PlanValidate)
 
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
            <Col xxl={5} xl={6} lg={8}>
              <Card className="border-0 shadow-sm card-plan mb-3">
                <Card.Header>
                  <h3 className="text-center mb-0">{PlanName ||"Standard"} Plan</h3>
                </Card.Header>
                <Card.Body>                                    
                  <div className="d-flex justify-content-between mb-3">
                    <h5>{allLanguageKey?.plan_validity || "Plan Validity"}</h5>
                    <h4>{PlanValidate || 30} Days</h4>
                  </div>
                  <div className="d-flex justify-content-between mb-4">
                    <h5>{allLanguageKey?.message_price}</h5>
                    <h4 className="price_container">$ {PlanPrice}</h4>
                  </div>

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

                  <h5>{allLanguageKey?.payment_method}</h5>
                  <ButtonGroup
                    className="btn-group btn-group-light gap-3 mb-4"
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
                    <label className="btn btn-outline-light" htmlFor="btnradio1">                 
                      <img src="/assets/images/paypal.png" alt="Paypal" height={64} width={128} />
                      {/* <span className="d-block">PayPal</span> */}
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
                    <label className="btn btn-outline-light" htmlFor="btnradio2">
                      <img src="/assets/images/stripe.png" alt="Stripe" height={64} width={128} />
                      {/* <span className="d-block">Stripe</span> */}
                    </label>
                  </ButtonGroup>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      id="subscribe_plan"
                      onClick={handlePaymentOption}
                    >
                      {allLanguageKey?.message_payment_process}
                    </Button>
                  </div>
                  
                </Card.Body>
              </Card>
              <Row>
                <Col lg>
                  <img src="/assets/images/credit-cards.png" alt="SSL" height={150} className="img-fluid" />                
                </Col>
                <Col lg="auto">
                  <img src="/assets/images/ssl-secure-badge.png" alt="SSL" height={128} width={170} />
                </Col>
              </Row>
            </Col>
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
