"use client";
import { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const EditImageGallery = ({
    flatImageTab,
    inputValue,
    selectedItem,
    projectData,
    projectId,
    setProjectData
}) => {

    const { callApi } = AuthUser();
    const [activeTab, setActiveTab] = useState(flatImageTab?.[0]?.key || "");

    const handleTabChange = (key) => {
        setActiveTab(key);
    }

    const handleUploadImage = (e) => {
        const files = e.target.files;
        console.log("files", files);
      
        if (files) {
          // Create an array to hold the image data for all files
          const newImages = [];
      
          // Loop through each file and process it
          Array.from(files).forEach((file, fileIndex) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const fileData = {
                caption: "", // Add caption logic here if needed
                file: reader.result,
              };
              newImages.push(fileData); // Collecting the images in an array
      
              // Once all files are processed, call handleSetImage
              if (newImages.length === files.length) {
                handleSetImage(newImages); // Pass the entire array of images
              }
            };
            reader.readAsDataURL(file);
          });
        } else {
          console.log('No file selected');
        }
      };
      
      const handleSetImage = (newImages) => {
        const existingTab = projectData?.gallery?.find(
          (item) => item?.image_type === activeTab
        );
      
        // If the active tab exists, append the new images
        if (existingTab) {
          const newGalaryArr = projectData?.gallery?.map((item) => {
            if (item?.image_type === activeTab) {
              return {
                ...item,
                images: [...item?.images, ...newImages], // Add all new images at once
              };
            } else {
              return item;
            }
          });
      
          setProjectData((prev) => {
            return {
              ...prev,
              gallery: newGalaryArr,
            };
          });
        } else {
          // If the active tab doesn't exist, create a new object with the activeTab and the new images
          const newTab = {
            image_type: activeTab,
            images: newImages, // Add all the new images in the images array
          };
      
          // Append the new tab to the gallery
          setProjectData((prev) => {
            return {
              ...prev,
              gallery: [...prev?.gallery, newTab],
            };
          });
        }
      };
      
    const handleDeleteImage = (index) => {
        console.log("handle delete iamge index", );
    }
      



    const currentTab = projectData?.gallery?.filter((item, i) => item?.image_type === activeTab)[0];



    return (
        <>
            {/* Gallery Tabs */}
            <div className="image-tab-content">
                {flatImageTab && flatImageTab.length > 0 && (
                    <ul className="nav nav-underline nav-custom">
                        {flatImageTab.map((tab, index) => (
                            <li className="nav-item" key={index}>
                                <a
                                    className={`nav-link ${activeTab === tab.key ? "active" : ""
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

            {/* File Upload Area */}
            <div className="form-field">
                <div className="upload-area" id="uploadfile">
                    <input
                        type="file"
                        name="fileinput"
                        id="fileinput"
                        multiple
                        onChange={handleUploadImage}
                    />
                    <i className="bi bi-upload"></i>
                    <p>
                        Drag &amp; drop files here or{" "}
                        <span className="text-site">click</span> to select files
                    </p>
                </div>
                <p className="text-help">
                    Accepted formats are .jpg, .gif, .bmp &amp; .png. Maximum
                    size allowed is 20 MB. Minimum dimensions allowed are 600 x
                    400 pixels.
                </p>
            </div>
            <div className="upload-gallery">
                {currentTab?.images && currentTab?.images?.map((item, i) => {
                    return (
                        <div className="pic">
                            <img
                                src={`${item?.file}`}
                                alt="Uploaded Preview"
                            />

                            <div className="caption-section">
                                <p>No caption available</p>
                                <button className="btn btn-primary btn-sm">
                                    Add Caption
                                </button>
                            </div>

                            <a href="#" className="btn-trash">
                                <i className="icon-feather-trash"></i>
                            </a>
                        </div>

                    )
                })}
            </div>

        </>
    );
};

export default EditImageGallery;
