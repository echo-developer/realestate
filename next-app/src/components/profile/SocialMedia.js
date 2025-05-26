import React from "react";
import useTranslation from "@/hooks/useTranslation";
import { Trash } from 'react-bootstrap-icons';
import {
  Form,
  Row,
  Col,
  ListGroup,
  FloatingLabel,
} from "react-bootstrap";

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
    <fieldset className="mb-4">
      <legend>Social Media</legend>
      {socialLinks.map((link) => (
        <Row key={link.key} className="gx-3">
          {/* Social Media Name */}
          <Col className="col-md col-12">
            <FloatingLabel
              controlId="floatingInput"
              label={translation?.social_media_name || "Social Media Name"}
              className="mb-4"
            >
              <Form.Control
                type="text"
                name={`name_${link.key}`}
                placeholder={translation?.social_media_name || "Social Media Name"}
                value={link.name}
                onChange={(e) => handleChange(link.key, "name", e.target.value)}
                readOnly
              />
            </FloatingLabel>
          </Col>

          {/* Social Media URL */}
          <Col className="col-md col-12">
            <FloatingLabel
              controlId="floatingInput"
              label={translation?.social_media_url || "Social Media URL"}
              className="mb-3"
            >
              <Form.Control
                type="url"
                name={`url_${link.key}`}
                className="form-control"
                placeholder={translation?.social_media_url || "Social Media URL"}
                value={link.url}
                onChange={(e) => handleChange(link.key, "url", e.target.value)}
              />
            </FloatingLabel>
          </Col>

          {/* Remove Button (Hidden for the first link) */}
          {socialLinks.length > 1 && (
            <Col className="col-md-auto col-12 text-end">
              <button
                type="button"
                className="btn btn-danger mb-4"
                onClick={() => removeLink(link.key)}
                title={translation?.remove || "Remove"}
              >
                <Trash color="white" size={16} />                
              </button>
            </Col>
          )}
        </Row>
      ))}

      {/* Add More Button */}
      {/* <button type="button" className="btn btn-primary" onClick={addMoreLinks}>
      {translation?.add_more || "Add More"}
      </button> */}
    </fieldset>
  );
};

export default SocialMediaLinks;
