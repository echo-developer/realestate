import React, { useState } from 'react';

const TextComponent = ({ text, maxLength = 100 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Limit the text length
  const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <>
      <p className={`text ${isExpanded ? 'expanded' : ''}`}>
        <i>{isExpanded ? text : truncatedText}</i> <a role='button' onClick={toggleText} className="view-more-btn">
        {isExpanded ? 'view less' : 'view more'}
      </a>
      </p>
      
    </>
  );
};

export default TextComponent;