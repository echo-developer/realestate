import React, { useState } from 'react';

const TextComponent = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Limit the text length
  const truncatedText = text?.length > maxLength ? text?.slice(0, maxLength) + '...' : text;

  // Check if the text length exceeds maxLength
  const shouldShowViewMore = text?.length > maxLength;

  return (
    <>
      <p className={`text ${isExpanded ? 'expanded' : ''}`}>
        <i>{isExpanded ? text : truncatedText}</i>
        {shouldShowViewMore && (
          <a role="button" onClick={toggleText} className="view-more-btn">
            {isExpanded ? 'View Less' : 'View More'}
          </a>
        )}
      </p>
    </>
  );
};

export default TextComponent;
