"use client"
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Accordion } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";

const FAQ = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 fw-bold">{translation?.faq || 'Frequently Asked Questions'}</h1>                      
        </div>
      </div>
      <section className="section">
      <div className="container">
        <Accordion defaultActiveKey="0">
          {/* Question 1 */}
          <Accordion.Item eventKey="0">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.buying_steps_question || 'What are the steps to buying a property?'}</Accordion.Header>
            <Accordion.Body>
              <p className="ps-4">{translation?.buying_steps_answer_the || 'The key steps include: determining your budget, getting mortgage pre-approval, finding a real estate agent, searching for a home, making an offer, and closing the deal.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 2 */}
          <Accordion.Item eventKey="1">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.real_estate_agent_question || 'Do I need a real estate agent?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.real_estate_agent_answer || 'While not required, a real estate agent can help navigate the market, negotiate deals, and handle paperwork, making the process easier and more efficient.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 3 */}
          <Accordion.Item eventKey="2">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.mortgage_preapproval_question || 'What is a mortgage pre-approval?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.mortgage_preapproval_answer || 'A mortgage pre-approval is a lender\'s estimate of how much you can borrow based on your income, credit score, and financial history.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 4 */}
          <Accordion.Item eventKey="3">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.down_payment_question || 'How much should I save for a down payment?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.down_payment_answer || 'Typically, you should aim for at least 20% of the home\'s price, though some loans allow as low as 3-5%.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 5 */}
          <Accordion.Item eventKey="4">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.closing_costs_question || 'What are closing costs?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.closing_costs_answer || 'Closing costs include fees for loan processing, title insurance, taxes, and legal documentation, typically ranging from 2-5% of the home\'s price.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 6 - New */}
          <Accordion.Item eventKey="5">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.homebuying_duration_question || 'How long does the home-buying process take?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.homebuying_duration_answer || 'The entire process can take anywhere from 30 to 90 days, depending on financing, inspections, and market conditions.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 7 - New */}
          <Accordion.Item eventKey="6">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.homeowners_insurance_question || 'What is homeowners insurance, and do I need it?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.homeowners_insurance_answer || 'Homeowners insurance protects your property against damage and liabilities. Lenders typically require it before approving a mortgage.'}</p>
            </Accordion.Body>
          </Accordion.Item>

          {/* Question 8 - New */}
          <Accordion.Item eventKey="7">
            <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.escrow_account_question || 'What is an escrow account?'}</Accordion.Header>
            <Accordion.Body>
            <p className="ps-4">{translation?.escrow_account_answer || 'An escrow account holds funds for property taxes and insurance, ensuring they are paid on time.'}</p>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      </section>
    </MainLayout>
  );
};

export default FAQ;
