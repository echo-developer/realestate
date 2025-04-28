"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Accordion } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";

const FAQ = () => {
  const { callApi } = AuthUser();
  const [faqList, setFaqList] = useState([]);
  const [activeKey, setActiveKey] = useState(null); // for controlling open/close manually if needed

  useEffect(() => {
    const getFaqList = async () => {
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
      }
    };
    getFaqList();
  }, []);

  const translation = useTranslation();

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 fw-bold">
            {translation?.faq || "Frequently Asked Questions"}
          </h1>
        </div>
      </div>

      <section className="section">
        <div className="container">

          {faqList.length > 0 ? (
            faqList.map((category, catIndex) => (
              <div key={category.id} className="mb-5">
                <h3 className="mb-3">{category.name}</h3>

                <Accordion defaultActiveKey={`${catIndex}-0`}>
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
            ))
          ) : (
            <p>No FAQs available right now.</p>
          )}

        </div>
      </section>
    </MainLayout>
  );
};

export default FAQ;
