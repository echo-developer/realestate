import React from "react";

const SocialMediaLinks = ({ socialLinks, setSocialLinks }) => {
  const handleChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  const addMoreLinks = () => {
    setSocialLinks([...socialLinks, { name: "", url: "" }]);
  };

  const removeLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
  };

  return (
    <div>
      {socialLinks.map((link, index) => (
        <div key={index} className="row mb-3">
          {/* Social Media Name */}
          <div className="col-md-5">
            <input
              type="text"
              name={`name_${index}`}
              className="form-control"
              placeholder="Social Media Name"
              value={link.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
          </div>

          {/* Social Media URL */}
          <div className="col-md-5">
            <input
              type="url"
              name={`url_${index}`}
              className="form-control"
              placeholder="Social Media URL"
              value={link.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
            />
          </div>

          {/* Remove Button (Hidden for the first link) */}
          {index > 0 && (
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeLink(index)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add More Button */}
      <button type="button" className="btn btn-primary" onClick={addMoreLinks}>
        Add More
      </button>
    </div>
  );
};

export default SocialMediaLinks;
