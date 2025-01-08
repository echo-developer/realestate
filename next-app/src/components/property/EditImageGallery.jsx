"use client";
import { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const EditImageGallery = ({
    flatImageTab,
    inputValue,
    selectedItem,
    propertyData,
    propertyId,
}) => {
    const { callApi } = AuthUser();
    const [activeTab, setActiveTab] = useState(flatImageTab?.[0]?.key || "");
    const [tabData, setTabData] = useState({});
    const [inputState, setInputState] = useState(inputValue);

    const galleryData = Array.isArray(inputState?.galleries)
        ? inputState.galleries.find((gallery) => gallery.gallery === activeTab)
        : null;

    const correctPath = (url) => {
        const unescapedUrl = url?.replace(/\\/g, "/");
        return unescapedUrl?.replace(/([^:])\/{2,}/g, "$1/");
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    const uploadFiles = async (fileArray) => {
        const updatedTabData = { ...tabData };

        for (const file of fileArray) {
            try {
                const formData = new FormData();
                formData.append("image_key", activeTab);
                formData.append("property_id", propertyId);
                formData.append("image", file);

                const response = await callApi({
                    api: `/property_image_upload`,
                    method: "POST",
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response && response.status === 1) {
                    const uploadedFile = response.data.images[0];
                    const uploadedImageUrl = correctPath(
                        response.data.image_url
                    );

                    if (!updatedTabData[activeTab]) {
                        updatedTabData[activeTab] = {
                            gallery: activeTab,
                            caption: "",
                            images: [],
                        };
                    }

                    const newImage = {
                        image_name: uploadedFile.filename,
                        image_url: uploadedImageUrl,
                    };

                    updatedTabData[activeTab].images.push(newImage);

                    // Update the property.galleries field
                    setInputState((prevState) => ({
                        ...prevState,
                        galleries: prevState.galleries.map((gallery) =>
                            gallery.gallery === activeTab
                                ? {
                                      ...gallery,
                                      images: [
                                          ...(gallery.images || []),
                                          newImage,
                                      ],
                                  }
                                : gallery
                        ),
                    }));

                    toast.success("File Uploaded Successfully");
                } else {
                    toast.error(response?.message || "File upload failed.");
                }
            } catch (error) {
                console.error("Upload Error:", error);
                toast.error("Error uploading file");
            }
        }

        setTabData(updatedTabData);
    };

    const handleRemoveFile = (index) => {
        const updatedImages = [...(tabData[activeTab]?.images || [])];
        const removedImage = updatedImages.splice(index, 1);

        setTabData((prevData) => ({
            ...prevData,
            [activeTab]: {
                ...prevData[activeTab],
                images: updatedImages,
            },
        }));

        // Update the property.galleries field
        setInputState((prevState) => ({
            ...prevState,
            galleries: prevState.galleries.map((gallery) =>
                gallery.gallery === activeTab
                    ? {
                          ...gallery,
                          images: gallery.images.filter(
                              (image) =>
                                  image.image_name !==
                                  removedImage[0]?.image_name
                          ),
                      }
                    : gallery
            ),
        }));

        toast.success("Image removed successfully");
    };

    const handleCaptionChange = (e) => {
        const newCaption = e.target.value;
        setInputState((prevState) => ({
            ...prevState,
            galleries: prevState.galleries.map((gallery) =>
                gallery.gallery === activeTab
                    ? { ...gallery, caption: newCaption }
                    : gallery
            ),
        }));
    };

    const combinedGalleryData = [
        ...(galleryData?.images || []),
        ...(tabData[activeTab]?.images || []),
    ];

    return (
        <>
            {/* Gallery Tabs */}
            <div className="image-tab-content">
                {flatImageTab && flatImageTab.length > 0 && (
                    <ul className="nav nav-underline nav-custom">
                        {flatImageTab.map((tab, index) => (
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

            {/* File Upload Area */}
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

            {/* Description Textarea */}
            <div className="form-field">
                <label className="form-label">Description</label>
                <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Write something about this gallery..."
                    value={galleryData?.caption || ""}
                    onChange={handleCaptionChange}
                />
            </div>

            {/* Gallery Images Display */}
            <div className="upload-gallery">
                {combinedGalleryData.map((fileData, index) => (
                    <div className="pic" key={index}>
                        <img
                            src={fileData.image_url}
                            alt={`Uploaded Preview ${index + 1}`}
                        />
                        <p>{fileData.image_name}</p>
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
        </>
    );
};

export default EditImageGallery;
