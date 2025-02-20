import React from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique keys

const SocialMediaLinks = ({ socialLinks, setSocialLinks }) => {
  const handleChange = (id, field, value) => {
    const updatedLinks = socialLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    setSocialLinks(updatedLinks);
  };

  const addMoreLinks = () => {
    setSocialLinks([...socialLinks, { id: uuidv4(), name: "", url: "" }]);
  };

  const removeLink = (id) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  return (
    <div>
      {socialLinks.map((link) => (
        <div key={link.id} className="row mb-3">
          {/* Social Media Name */}
          <div className="col-md-5">
            <input
              type="text"
              name={`name_${link.id}`}
              className="form-control"
              placeholder="Social Media Name"
              value={link.name}
              onChange={(e) => handleChange(link.id, "name", e.target.value)}
            />
          </div>

          {/* Social Media URL */}
          <div className="col-md-5">
            <input
              type="url"
              name={`url_${link.id}`}
              className="form-control"
              placeholder="Social Media URL"
              value={link.url}
              onChange={(e) => handleChange(link.id, "url", e.target.value)}
            />
          </div>

          {/* Remove Button (Hidden for the first link) */}
          {socialLinks.length > 1 && (
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeLink(link.id)}
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
