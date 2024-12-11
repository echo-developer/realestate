"use client"
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import {
    flat_image_tab,
    agricultural_image_tab,
} from "./PropertyData";

const Step6Form = ({ formData, setFormData, prevStep }) => {
    const { callApi } = AuthUser();

    const [tabData, setTabData] = useState({});
    const [activeTab, setActiveTab] = useState("bedroom");
    const [imageTabData, setImageTabData] = useState(flat_image_tab);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            uploadFiles(files);
        }
    };

    useEffect(() => {
        console.log("Property Type:", formData.propertyType);
        console.log("Image Tab Data:", imageTabData);
    }, [formData.propertyType, imageTabData]);

    const uploadFiles = async (fileArray) => {
        const updatedTabData = { ...tabData };

        for (const file of fileArray) {
            try {
                const response = await callApi({
                    api: `/image-upload`,
                    method: "UPLOAD",
                    data: {
                        images: file,
                    },
                });

                if (response && response.status === 1) {
                    const uploadedFile = response.files[0];
                    const uploadedImageUrl = response.image_url[0];
                    updatedTabData[activeTab] = {
                        ...updatedTabData[activeTab],
                        files: [
                            ...(updatedTabData[activeTab]?.files || []),
                            { uploadedFile, uploadedImageUrl },
                        ],
                        description:
                            updatedTabData[activeTab]?.description || "",
                    };

                    toast.success("File Uploaded Successfully");
                } else {
                    toast.error("File upload failed.");
                }
            } catch (error) {
                toast.error("Error uploading file");
            }
        }

        setTabData(updatedTabData);
    };

    const handleDescriptionChange = (e) => {
        setTabData((prevTabData) => ({
            ...prevTabData,
            [activeTab]: {
                ...prevTabData[activeTab],
                description: e.target.value,
            },
        }));
    };

    const handleRemoveFile = (fileIndex) => {
        setTabData((prevTabData) => ({
            ...prevTabData,
            [activeTab]: {
                ...prevTabData[activeTab],
                files: prevTabData[activeTab].files.filter(
                    (_, index) => index !== fileIndex
                ),
            },
        }));
    };

    useEffect(() => {
        setFormData({
            ...formData,
            files: tabData[activeTab]?.files || [],
            description: tabData[activeTab]?.description || "",
        });
    }, [tabData, activeTab]);

    useEffect(() => {
        if (formData.propertyType === "flat") {
            setImageTabData(flat_image_tab);
        } else if (formData.propertyType === "agriculture_image_type") {
            setImageTabData(agricultural_image_tab);
        } else {
            setImageTabData([]);
        }
    }, [formData.propertyType]);

    const handleSubmit = async () => {
        console.log(formData)
        const fd = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            fd.append(key, value);
        });

        Object.keys(tabData).forEach((tabKey) => {
            const currentTabData = tabData[tabKey];

            if (currentTabData?.files?.length > 0) {
                currentTabData.files.forEach((fileData) => {
                    fd.append(`${tabKey}_files[]`, fileData.uploadedFile);
                });
            }

            if (currentTabData?.description) {
                fd.append(`${tabKey}_description`, currentTabData.description);
            }
            fd.append(`${tabKey}_activeTab`, tabKey);
        });


        try {
            const response = await callApi({
                api: `/property-post`,
                method: "POST",
                data: fd,
            });

            if (response && response.status === 1) {
                toast.success("Property posted successfully");
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
            <div className="image-tab-content">
                {imageTabData && imageTabData.length > 0 && (
                    <ul className="nav nav-underline nav-custom">
                        {imageTabData.map((tab, index) => (
                            <li className="nav-item" key={index}>
                                <a
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
                    />
                    <i className="bi bi-upload"></i>
                    <p>
                        Drag &amp; drop file here or
                        <span className="text-site">click</span> to select file
                    </p>
                </div>
                <p className="text-help">
                    Accepted formats are .jpg, .gif, .bmp &amp; .png. Maximum
                    size allowed is 20 MB. Minimum dimension allowed 600*400
                    Pixel
                </p>
            </div>

            {/* Description Section */}
            <div className="form-field">
                <label className="form-label">Description</label>
                <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Write something..."
                    value={tabData[activeTab]?.description || ""}
                    onChange={handleDescriptionChange}
                />
            </div>

            {/* Image Gallery Section */}
            <div className="upload-gallery">
                {tabData[activeTab]?.files?.map((fileData, index) => (
                    <div className="pic" key={index}>
                        <img
                            src={fileData.uploadedImageUrl} 
                            alt={`Uploaded Preview ${index + 1}`}
                        />
                        <p>{fileData.uploadedFile}</p>{" "}
                        {/* Display the filename */}
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

            {/* Navigation Buttons */}
            <div className="d-grid columns-2">
                <button
                    type="button"
                    className="btn btn-secondary btn-back-6"
                    onClick={prevStep}
                >
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary btn-next-6"
                    onClick={handleSubmit}
                >
                    Post Property
                </button>
            </div>
        </div>
    );
};

export default Step6Form;
