"use client";
import { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Button} from "react-bootstrap";

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
  const [captionState, setCaptionState] = useState({
    isCaptionEditing: false,
    imageId: "",
    caption: "",
  })
const translation = useTranslation();
  const handleTabChange = (key) => {
    setActiveTab(key);
  }

  // const handleUploadImage = (e) => {
  //     const files = e.target.files;
  //     console.log("files", files);

  //     if (files) {
  //       const newImages = [];

  //       Array.from(files).forEach((file, fileIndex) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const fileData = {
  //             caption: "", 
  //             file: reader.result,
  //           };
  //           newImages.push(fileData); 

  //           if (newImages.length === files.length) {
  //             handleSetImage(newImages); 
  //           }
  //         };
  //         reader.readAsDataURL(file);
  //       });
  //     } else {
  //       console.log('No file selected');
  //     }
  //   };

  const handleUploadImage = async (e) => {
    let imgArr = Array.from(e?.target?.files || []);

    for (const img of imgArr) {
      try {
        const formData = new FormData();
        formData.append("image_key", activeTab);
        formData.append("project_id", projectId);
        formData.append("image", img);

        const response = await callApi({
          api: "/edit-project-image",
          method: "POST",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response && response?.status === 1) {
          handleSetImage(response?.data?.images);
          toast?.success("Image uploaded successfully")
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong");
      }
    }
  };




  const handleDeleteImage = async (imageId) => {
    try {
      const res = await callApi({
        api: "/delete-project-image",
        method: "POST",
        data: {
          image_id: imageId
        }
      })

      if (res && res?.status === 1) {
        handleSetImage(res?.data?.images)
        toast.success("Image deleted succe3ssfully")
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }


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
            images: [...newImages], // Add all new images at once
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


  const handleAddCaption = (imgData) => {
    setCaptionState({
      isCaptionEditing: true,
      imageId: imgData?.id,
    })
  }

  const handleCloseCaption = () => {
    setCaptionState({
      isCaptionEditing: false,
      imageId: "",
      caption: ""
    })
  }

  const handleCaptionChange = (e) => {
    setCaptionState(prev => {
      return {
        ...prev,
        caption: e?.target?.value || ""
      }
    })
  }

  const handleSaveCaption = async () => {


    if(!captionState?.caption || !captionState?.imageId) {
      return;
    } else {
      try {
        const res = await callApi({
          api: "/edit-project-caption",
          method: "POST",
          data: {
            image_id: captionState?.imageId,
            caption: captionState?.caption
          }
        })
  
        if(res && res?.status === 1) {
          const gallery = projectData?.gallery;
          const newGalary = gallery?.map((tab, i) => {
            if(tab?.image_type === activeTab) {
              let imgArr = tab?.images?.map((img) => {
                if(img?.id === captionState?.imageId) {
                  return {
                    ...img,
                    caption: captionState?.caption
                  }
                } else {
                  return img;
                }
              });
              return {
                ...tab,
                images: imgArr
              }
            } else {
              return tab;
            }
          })
          setProjectData(prev => {
            return {
              ...prev,
              gallery: newGalary
            }
          })
          setCaptionState({
            isCaptionEditing: false,
            imageId: "",
            caption: ""
          })
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      }
    }
  }

  const currentTab = projectData?.gallery?.filter((item, i) => item?.image_type === activeTab)[0];



  return (
    <>
      {/* Gallery Tabs */}
      <div className="image-tab-content">
        {flatImageTab && flatImageTab.length > 0 && (
          <ul className="nav nav-underline nav-custom mb-3">
            {flatImageTab.map((tab, index) => (
              <li className="nav-item" key={index}>
                <a role="button"
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
          {translation?.drag || "Drag"} &amp; {translation?.drop_files_here || "drop files here or"}{" "}
            <span className="text-site">{translation?.click || "click"}</span> {translation?.to_select_files || "to select files"}
          </p>
        </div>
        <p className="text-help">
          {translation?.accepted_formats_are || "Accepted formats are .jpg, .gif, .bmp   .png. Maximum size allowed is 20 MB. Minimum dimensions allowed are 600 x 400 pixels."}
        </p>
      </div>
      <div className="upload-gallery">
        {currentTab?.images && currentTab?.images?.map((item, i) => {
          return (
            <div className="pic">
              <img
                src={`${item?.file}`}
                alt="Uploaded Preview"
                className="mb-2"
              />

              <div className="caption-section">
                {captionState?.isCaptionEditing && captionState?.imageId === item?.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      value={captionState?.caption}
                      onChange={handleCaptionChange}
                    />
                    <Button variant="success" size="sm" className="me-2" onClick={handleSaveCaption}>
                      <i className="bi bi-check-circle"></i>
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleCloseCaption}>
                      <i className="bi bi-x-circle"></i>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-help mb-2">{item?.caption || "No caption available"}</p>
                    <Button variant="primary" size="sm" onClick={() => handleAddCaption(item)}>
                      {item?.caption ? "Edit Caption" : "Add Caption"}
                    </Button>
                  </>
                )}

              </div>

              <a role="button" className="btn-trash" onClick={() => handleDeleteImage(item?.id)}>
                <i className="bi bi-trash3-fill"></i>
              </a>
            </div>

          )
        })}
      </div>

    </>
  );
};

export default EditImageGallery;
