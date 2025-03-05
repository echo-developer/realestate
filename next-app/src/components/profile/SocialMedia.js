import React from "react";
import useTranslation from "@/hooks/useTranslation";
const SocialMediaLinks = ({ socialLinks, setSocialLinks }) => {
  const handleChange = (key, field, value) => {
    setSocialLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.key === key ? { ...link, [field]: value } : link
      )
    );
  };
const translation = useTranslation();
  const generateNewKey = () => {
    return `social_${socialLinks.length + 1}`; 
  };

  const addMoreLinks = () => {
    setSocialLinks([
      ...socialLinks,
      { key: generateNewKey(), name: "", url: "" },
    ]);
  };

  const removeLink = (key) => {
    setSocialLinks(socialLinks.filter((link) => link.key !== key));
  };

  return (
    <div>
      {socialLinks.map((link) => (
        <div key={link.key} className="row mb-3">
          {/* Social Media Name */}
          <div className="col-md-5">
            <input
              type="text"
              name={`name_${link.key}`}
              className="form-control"
              placeholder={translation?.social_media_name || "Social Media Name"}
              value={link.name}
              onChange={(e) => handleChange(link.key, "name", e.target.value)}
            />
          </div>

          {/* Social Media URL */}
          <div className="col-md-5">
            <input
              type="url"
              name={`url_${link.key}`}
              className="form-control"
              placeholder={translation?.social_media_url || "Social Media URL"}
              value={link.url}
              onChange={(e) => handleChange(link.key, "url", e.target.value)}
            />
          </div>

          {/* Remove Button (Hidden for the first link) */}
          {socialLinks.length > 1 && (
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeLink(link.key)}
              >
                {translation?.remove || "Remove"}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add More Button */}
      <button type="button" className="btn btn-primary" onClick={addMoreLinks}>
      {translation?.add_more || "Add More"}
      </button>
    </div>
  );
};

export default SocialMediaLinks;
