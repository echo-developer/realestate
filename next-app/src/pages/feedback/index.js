"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import MainLayout from "@/components/layout/MainLayout";

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setFeedbackList([values, ...feedbackList]);
      alert("Feedback submitted successfully!");
      resetForm();
    },
  });

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Feedback</h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-3 border rounded"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <textarea
            name="message"
            placeholder="Your Feedback"
            className="w-full p-3 border rounded h-28"
            onChange={formik.handleChange}
            value={formik.values.message}
          ></textarea>
          {formik.touched.message && formik.errors.message && (
            <p className="text-red-500 text-sm">{formik.errors.message}</p>
          )}

          <button type="submit" className="bg-blue-500 text-white p-3 rounded w-full">
            Submit Feedback
          </button>
        </form>

        {feedbackList.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Recent Feedback</h3>
            <div className="space-y-4">
              {feedbackList.map((feedback, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold">{feedback.name}</h4>
                  <p className="text-sm text-gray-500">{feedback.email}</p>
                  <p className="text-gray-700 mt-2">{feedback.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FeedbackPage;
