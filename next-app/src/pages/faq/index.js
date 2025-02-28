import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqs = [
  {
    question: "What are the steps to buying a property?",         
    answer:
      "The process includes searching for a property, getting pre-approved for a mortgage, making an offer, signing a contract, and closing the deal.",
  },
  {
    question: "Do I need a real estate agent?",
    answer:
      "While not mandatory, a real estate agent can help navigate the buying or selling process and negotiate the best deal.",
  },
  {
    question: "What is a mortgage pre-approval?",
    answer:
      "A pre-approval is a lender's estimate of how much you can borrow. It helps in setting a budget and making competitive offers.",
  },
  {
    question: "How much should I save for a down payment?",
    answer:
      "Typically, a down payment is between 10-20% of the property's price, but some loans allow for lower percentages.",
  },
  {
    question: "What are closing costs?",
    answer:
      "Closing costs include fees for inspections, title searches, legal paperwork, and loan processing. They usually range from 2-5% of the home price.",
  },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg cursor-pointer bg-gray-50"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </div>
              {openIndex === index && (
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FaqPage;
