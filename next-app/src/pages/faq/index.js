
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Accordion } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";

const FAQ = () => {
  const { callApi } = AuthUser();
  const [faqList, setFaqList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState(null); 

  useEffect(() => {
    const getFaqList = async () => {
      setLoading(true);
      try {
        const res = await callApi({
          api: `/faq-lists`,
          method: "GET",
        });
        if (res && res?.status == 1) {
          setFaqList(res?.data);
        }
      } catch (error) {
        console.error(error?.message || "Something Went wrong");
      } finally {
        setLoading(false);
      }
    };
    getFaqList();
  }, []);

  const translation = useTranslation();

  const handleAccordionToggle = (key) => {
    // Toggle the active state of the accordion
    setActiveKey(prevKey => (prevKey === key ? null : key));
  };

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 fw-bold">
            {translation?.faq || "Frequently Asked Questions"}
          </h1>
        </div>
      </div>

      {loading && (
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          width: "100%", 
        }}
        className="d-flex justify-content-center align-items-center w-100"
      >
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">
            {translation?.loading ||
              "Loading...."}{" "}
          </span>
        </div>
      </div>
      )}

      <section className="section">
        <div className="container">
          {!loading && faqList.length > 0 && faqList.map((category, catIndex) => (
            <div key={category.id} className="mb-5">
              <h3 className="mb-3">{category.name}</h3>

              <Accordion activeKey={activeKey} onSelect={handleAccordionToggle}>
                {category.faq_list.map((faq, faqIndex) => (
                  <Accordion.Item
                    eventKey={`${catIndex}-${faqIndex}`}
                    key={faq.faq_id}
                  >
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          ))}
          {!loading && faqList.length === 0 && <p>No FAQs available right now.</p>}
        </div>
      </section>
    </MainLayout>
  );
};

export default FAQ;
