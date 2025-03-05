import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import AuthUser from "../Authentication/AuthUser";

const PaymentForm = ({ planId, amount, gift, profileId }) => {
  const { callApi } = AuthUser();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, token } = await stripe.createToken(cardElement);

    let params = {
      amount: amount,
      token: token.id,
      plan_id: planId,
    };

    if (gift === true) {
      params = {
        ...params,
        profile_id: profileId,
        is_gift: 1,
      };
    }

    if (error) {
      setPaymentError(error.message);
    } else {
      try {
        const response = await callApi({
          api: "/make_payment_stripe",
          method: "POST",
          data: params,
        });

        if (response && response.status === "ok") {
          setPaymentSuccess("Payment successful");
          router.push("/payment-success");
        } else {
          toast.error("Payment not successful");
        }
      } catch (error) {
        console.error("Error during payment:", error);
        toast.error("Payment failed");
      }
    }
  };

  return (
    <div className="bodyView">
      <div className="title">
        <h3>RealEstate Membership</h3>
      </div>
      <div className="layoutView contentView">
        <div className="layoutSubview mb-4">
          <div className="loggedBarView">
            <div className="inner">
              <div className="loggedBarContent">
                <span className="prefilledEmail">
                  moin.originatesoft@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="layoutSubview mb-4">
            <div className="layoutView paymentView">
              <div className="layoutSubview">
                <div className="cardPaymentView">
                  <CardElement />
                </div>
              </div>
            </div>
          </div>
          <div className="layoutSubview">
            <div className="buttonsView">
              <div className="button submit">
                <div className="inner d-grid">
                  <button
                    type="submit"
                    id="submitButton"
                    className="btn btn-primary"
                  >
                    Pay ${amount}
                    <div
                      className="spinnerContainer"
                      style={{
                        opacity: 0,
                        display: "none",
                        transition: "none",
                      }}
                    >
                      {/* Spinner SVG */}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        {paymentError && <div className="paymentError">{paymentError}</div>}
        {paymentSuccess && (
          <div className="paymentSuccess">{paymentSuccess}</div>
        )}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const planId = "plan_123";
  const amount = 10.0;
  const gift = false;
  const profileId = "profile_456";

  return {
    props: {
      planId,
      amount,
      gift,
      profileId,
    },
  };
}

export default PaymentForm;
