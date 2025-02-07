"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const TextEditor = ({ formData, setFormData }) => {

  useEffect(() => {
    if (!formData.description) {
      setFormData((prev) => ({ ...prev, description: "" }));
    }
  }, [formData, setFormData]);

  const handleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2,3,4,5,6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="editor-container">
      <ReactQuill
        value={formData.description || ""}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder="Start typing here..."
      />
    </div>
  );
};

export default TextEditor;
