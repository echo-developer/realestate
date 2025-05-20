"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import { useRouter } from "next/router";
import { Project_image } from "../post/PropertyData";
import useTranslation from "@/hooks/useTranslation";

const projectForm6 = ({ formData, setFormData, prevStep }) => {
  const { callApi, isLogin } = AuthUser();
  const router = useRouter();
  const [tabData, setTabData] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [imageTabData, setImageTabData] = useState(Project_image);
  const [editIndex, setEditIndex] = useState(null);
  const [tempCaption, setTempCaption] = useState("");
  const translation = useTranslation();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };
  const Login = isLogin();

  console.log(formData)

    useEffect(() => {
      if (imageTabData.length > 0) {
        setActiveTab(imageTabData[0].key);
      }
    }, [imageTabData]);

  const uploadFiles = async (fileArray) => {
    const updatedTabData = { ...tabData };

    for (const file of fileArray) {
      try {
        const response = await callApi({
          api: `/project-image`,
          method: "UPLOAD",
          data: { images: file },
        });

        if (response && response.status === 1) {
          const uploadedFile = response.files[0];
          const uploadedImageUrl = response.image_url[0];

          if (!updatedTabData[activeTab]) {
            updatedTabData[activeTab] = {
              gallery: activeTab,
              images: [],
            };
          }

          updatedTabData[activeTab].images.push({
            image_name: uploadedFile,
            image_url: uploadedImageUrl,
            caption: "",
          });

        } else {
          console.error("File upload failed.");
        }
      } catch (error) {
        console.error("Error uploading file");
      }
    }

    setTabData(updatedTabData);
  };

  const handleCaptionEdit = (index) => {
    setEditIndex(index);
    setTempCaption(tabData[activeTab]?.images[index]?.caption || "");
  };

  const handleCaptionSave = (index) => {
    const updatedTabData = { ...tabData };
    updatedTabData[activeTab].images[index].caption = tempCaption;
    setTabData(updatedTabData);
    setEditIndex(null);
    setTempCaption("");
  };

  const handleCaptionCancel = () => {
    setEditIndex(null);
    setTempCaption("");
  };

  const handleRemoveFile = (fileIndex) => {
    setTabData((prevTabData) => ({
      ...prevTabData,
      [activeTab]: {
        ...prevTabData[activeTab],
        images: prevTabData[activeTab].images.filter(
          (_, index) => index !== fileIndex
        ),
      },
    }));
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      galleries: Object.values(tabData),
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [tabData, Login]);

  useEffect(() => {
    if (formData.project_type === 1) {
      setImageTabData(Project_image);
    } else if (formData.project_type === 2) {
      setImageTabData(Project_image);
    } else {
      setImageTabData([]);
    }
  }, [formData.project_type]);

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, value);
      }
    });

    try {
      const response = await callApi({
        api: `/project-post`,
        method: "POST",
        data: fd,
      });

      if (response && response.status === 1) {
        toast.success(response.message || "project posted successfully");
        if (Login) {
          router.push("/project-post-success");
        } else {
          router.push("/login");
        }
      } else {
        console.error(response.message || "project post failed");
      }
    } catch (error) {
      console.error("Error posting project");
    }
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  return (
    <div id="step-6">
      {/* Tabs for image categories */}
      <div className="image-tab-content">
        {imageTabData && imageTabData.length > 0 && (
          <ul className="nav nav-underline nav-custom mb-3">
            {imageTabData.map((tab, index) => (
              <li className="nav-item" key={index}>
                <a
                  role="button"
                  className={`nav-link ${
                    activeTab === tab.key ? "active" : ""
                  }`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* File Upload Section */}
      <div className="form-field">
        <div className="upload-area" id="uploadfile">
          <input
            type="file"
            name="fileinput"
            id="fileinput"
            multiple
            onChange={handleFileChange}
            disabled={!activeTab}
          />
          <i className="bi bi-upload"></i>
          <p>
            {translation?.drag || "Drag"} &amp;{" "}
            {translation?.drop_files_here || "drop files here or"}{" "}
            <span className="text-site">{translation?.click || "click"}</span>
            {translation?.to_select_files || "to select files"}
          </p>
        </div>
        <p className="text-help">
          {translation?.accepted_formats ||
            "Accepted formats are .jpg, .gif, .bmp &.png. Maximum size allowed is 20 MB. Minimum dimensions allowed are 600 x 400 pixels."}
        </p>
      </div>

      {/* Image Gallery Section */}
      <div className="upload-gallery">
        {tabData[activeTab]?.images?.map((fileData, index) => (
          <div className="pic" key={index}>
            <img
              src={fileData.image_url}
              alt={`Uploaded Preview ${index + 1}`}
            />
            <p className="small">{fileData.image_name}</p>

            {/* Caption Section */}
            {editIndex === index ? (
              <div className="caption-editor">
                <textarea
                  rows="2"
                  className="form-control mb-2"
                  value={tempCaption}
                  onChange={(e) => setTempCaption(e.target.value)}
                />
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCaptionSave(index);
                  }}
                >
                  {translation?.save || "Save"}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCaptionCancel();
                  }}
                >
                  {translation?.cancel || "Cancel"}
                </button>
              </div>
            ) : (
              <div>
                <p>{fileData.caption || "No caption added."}</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCaptionEdit(index);
                  }}
                >
                  {translation?.edit_caption || "Edit Caption"}
                </button>
              </div>
            )}

            <button
              className="btn btn-trash"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFile(index);
              }}
            >
              <i className="icon-feather-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> {translation?.back || "Back"}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!activeTab}
        >
          {translation?.post_project || "Post Project"}
        </button>
      </div>
    </div>
  );
};

export default projectForm6;
