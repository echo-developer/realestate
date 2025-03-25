"use client"
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Accordion } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";

const FAQ = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">{translation?.faq || 'Frequently Asked Questions'}</h2>

        <Accordion defaultActiveKey="0">
          {/* Question 1 */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>{translation?.buying_steps_question || 'What are the steps to buying a property?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.buying_steps_answer_the || 'The key steps include: determining your budget, getting mortgage pre-approval, finding a real estate agent, searching for a home, making an offer, and closing the deal.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 2 */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>{translation?.real_estate_agent_question || 'Do I need a real estate agent?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.real_estate_agent_answer || 'While not required, a real estate agent can help navigate the market, negotiate deals, and handle paperwork, making the process easier and more efficient.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 3 */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>{translation?.mortgage_preapproval_question || 'What is a mortgage pre-approval?'}</Accordion.Header>
            <Accordion.Body>
             {translation?.mortgage_preapproval_answer || 'A mortgage pre-approval is a lender\'s estimate of how much you can borrow based on your income, credit score, and financial history.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 4 */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>{translation?.down_payment_question || 'How much should I save for a down payment?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.down_payment_answer || 'Typically, you should aim for at least 20% of the home\'s price, though some loans allow as low as 3-5%.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 5 */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>{translation?.closing_costs_question || 'What are closing costs?'}</Accordion.Header>
            <Accordion.Body>
             {translation?.closing_costs_answer || 'Closing costs include fees for loan processing, title insurance, taxes, and legal documentation, typically ranging from 2-5% of the home\'s price.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 6 - New */}
          <Accordion.Item eventKey="5">
            <Accordion.Header>{translation?.homebuying_duration_question || 'How long does the home-buying process take?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.homebuying_duration_answer || 'The entire process can take anywhere from 30 to 90 days, depending on financing, inspections, and market conditions.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 7 - New */}
          <Accordion.Item eventKey="6">
            <Accordion.Header>{translation?.homeowners_insurance_question || 'What is homeowners insurance, and do I need it?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.homeowners_insurance_answer || 'Homeowners insurance protects your property against damage and liabilities. Lenders typically require it before approving a mortgage.'}
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 8 - New */}
          <Accordion.Item eventKey="7">
            <Accordion.Header>{translation?.escrow_account_question || 'What is an escrow account?'}</Accordion.Header>
            <Accordion.Body>
            {translation?.escrow_account_answer || 'An escrow account holds funds for property taxes and insurance, ensuring they are paid on time.'}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default FAQ;
