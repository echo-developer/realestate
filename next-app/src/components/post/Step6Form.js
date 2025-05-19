"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import { useRouter } from "next/router";
import { flat_image_tab, Commerical_image_tab, defalut_img_tab } from "./PropertyData";
import useTranslation from "@/hooks/useTranslation";


const Step6Form = ({ formData, setFormData, prevStep }) => {
  const { callApi, isLogin } = AuthUser();
  const router = useRouter();
  const [tabData, setTabData] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [imageTabData, setImageTabData] = useState(flat_image_tab);
  const translation = useTranslation();


  useEffect(() => {
    if (formData.property_type === 1) {
      setImageTabData(flat_image_tab);
    } else if (formData.property_type === 2) {
      setImageTabData(Commerical_image_tab);
    } else {
      setImageTabData(defalut_img_tab);
    }
  }, [formData.property_type]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  useEffect(() => {
    if (imageTabData.length > 0) {
      setActiveTab(imageTabData[0].key);
    }
  }, [imageTabData]);
  

  const Login = isLogin();

  const uploadFiles = async (fileArray) => {
    const updatedTabData = { ...tabData };

    for (const file of fileArray) {
      try {
        const response = await callApi({
          api: `/image-upload`,
          method: "UPLOAD",
          data: { images: file },
        });

        if (response && response.status === 1) {
          const uploadedFile = response?.files[0];
          const uploadedImageUrl = response?.image_url[0];

          if (!updatedTabData[activeTab]) {
            updatedTabData[activeTab] = {
              gallery: activeTab,
              caption: "",
              images: [],
            };
          }

          updatedTabData[activeTab].images.push({
            image_name: uploadedFile,
            image_url: uploadedImageUrl,
          });

          // toast.success("File Uploaded Successfully");
        } else {
          console.error("File upload failed.");
        }
      } catch (error) {
        console.error("Error uploading file");
      }
    }

    setTabData(updatedTabData);
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;

    setTabData((prevTabData) => ({
      ...prevTabData,
      [activeTab]: {
        ...prevTabData[activeTab],
        gallery: activeTab,
        caption: description,
        images: prevTabData[activeTab]?.images || [],
      },
    }));
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
  }, [tabData, Login]);

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
        api: `/property-post`,
        method: "POST",
        data: fd,
      });

      if (response && response.status === 1) {
        toast.success("Property posted successfully");
        if (Login) {
          router.push("/post-success");
        } else {
          router.push("/login");
        }
      } else {
        toast.error("Property post failed");
      }
    } catch (error) {
      toast.error("Error posting property");
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
          {translation?.drag || "Drag"} &amp; {translation?.drop_files_here || "drop files here or"}{" "}
            <span className="text-site">{translation?.click || "click"}</span> {translation?.to_select_files || "to select files"}
          </p>
        </div>
        <p className="text-help">
        {translation?.accepted_formats || ""}
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
            <a
              href="#"
              className="btn-trash"
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFile(index);
              }}
            >
              <i className="icon-feather-trash"></i>
            </a>
          </div>
        ))}
      </div>

      {/* Description Section */}
      <div className="form-field">
        <label className="form-label">{translation?.description || "Description"} </label>
        <textarea
          rows="3"
          className="form-control"
          placeholder={translation?.write_something_about_gallery || "Write something about this gallery..."} 
          value={tabData[activeTab]?.caption || ""}
          onChange={handleDescriptionChange}
        />
      </div>

      

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={prevStep}
        >
          <i className="bi bi-arrow-left"></i>{translation?.back || "Back"} 
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!activeTab}
        >
         {translation?.post_property || "Post Property"} 
        </button>
      </div>
    </div>
  );
};

export default Step6Form;
