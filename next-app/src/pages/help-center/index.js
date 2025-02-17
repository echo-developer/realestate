import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

export default function HelpCenter() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What all can I search on Magicbricks?",
      answer:
        "Magicbricks offers user search for below types: Residential Properties, Commercial Properties, Projects, Agents, Property Services, and more.",
    },
    {
      question: "I am getting too many emails, how can I unsubscribe?",
      answer:
        "It is unfortunate that you are thinking of unsubscribing. To manage your email preferences, please visit your account settings.",
    },
    {
      question: "I had raised a complaint. How to know the status?",
      answer:
        "To know status of your complaint, please click on this link and enter your complaint reference number.",
    },
    {
      question: "I wish to change my User Type. How can I do that?",
      answer:
        "Magicbricks allows one account for one profile. If you have a specific requirement, please contact support.",
    },
    {
      question: "How much brokerage is charged by Magicbricks?",
      answer:
        "Magicbricks doesn't charge any brokerage. We connect you to verified property owners and agents.",
    },
  ];

  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Hero Section */}
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          height: "300px",
          backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGE_URL || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-E7whSjxpQP2HC6QviWtTElLlKHR7Pz.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-50"></div>
        <div className="container text-center text-white position-relative">
          <button className="btn btn-outline-light mb-3">I am a Buyer</button>
          <h1 className="fw-bold">Have Questions? We've Got All the Answers</h1>
          <div className="position-relative mt-4">
            <input
              type="search"
              className="form-control form-control-lg ps-4 pe-5"
              placeholder="Type your question here..."
            />
            <button className="btn btn-danger position-absolute end-0 top-50 translate-middle-y me-2">
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <h2 className="mb-4">Explore Help Topics</h2>
            <div className="list-group mb-4">
              <h4 className="list-group-item bg-secondary text-white">User Profile</h4>
              {["New Registration & Login", "My Activity", "My Profile", "My Requirement", "My Recommendations"].map((item) => (
                <Link key={item} href="#" className="list-group-item list-group-item-action">
                  {item}
                </Link>
              ))}
              <button className="btn btn-link text-danger">Explore More</button>
            </div>
            <div className="list-group">
              <h4 className="list-group-item bg-secondary text-white">MB Features</h4>
              {["What is Propworth?", "All About Property Auctions", "Want to Know About Certified Agents", "Forum for All"].map(
                (item) => (
                  <Link key={item} href="#" className="list-group-item list-group-item-action">
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right Column - FAQs */}
          <div className="col-md-6">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading-${index}`}>
                    <button
                      className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                      type="button"
                      onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                    >
                      {faq.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${index}`}
                    className={`accordion-collapse collapse ${activeIndex === index ? "show" : ""}`}
                  >
                    <div className="accordion-body">{faq.answer}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-link text-danger mt-3">View More</button>
          </div>
        </div>
      </div>
    </div>
  );
}
