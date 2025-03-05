"use client";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import { useEffect } from "react";

const PaymentSuccess = () => {
  let creditValue;
  useEffect(() => {
    creditValue = localStorage.getItem("credit");
  }, []);

  return (
    <MainLayout>
      <section className="section payment-success-page">
        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-lg-8 col-12">
              <div className="card border-0 payment-success">
                <div className="card-body text-center">
                  <div className="payment-success-content">
                    <img
                      src="/assets/images/icons/wallet-2.png"
                      alt="payment-success"
                      height="128"
                      width="128"
                      className="mb-3"
                    />
                    <p>Available Credit : {creditValue} AED</p>
                    <h1 className="h3 text-success">Payment Successful!</h1>
                    <p>
                      Thank you for your payment. Your transaction has been
                      successfully completed. You can now access your premium
                      features or manage your purchases from the dashboard.
                    </p>
                    <Link href="/membership" className="btn btn-primary">
                      <i className="icon-line-awesome-shopping-basket"></i>{" "}
                      Continue Shopping
                    </Link>
                    <Link href="/dashboard" className="btn btn-success ms-2">
                      <i className="icon-line-awesome-dashboard"></i> Go to
                      Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default PaymentSuccess;
