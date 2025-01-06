import React from "react";
const EditImageGallery = ({
    flatImageTab,
    activeTab,
    handleTabChange,
    handleFileChange,
    handleDescriptionChange,
    handleRemoveFile,
    inputValue,
    selectedItem,
}) => {
    return (
        <>
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

            <div className="form-field">
                <label className="form-label">Description</label>
                <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Write something about this gallery..."
                    value={inputValue[selectedItem]?.caption || ""}
                    onChange={handleDescriptionChange}
                />
            </div>

            <div className="upload-gallery">
                {inputValue[selectedItem]?.images?.map((fileData, index) => (
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
