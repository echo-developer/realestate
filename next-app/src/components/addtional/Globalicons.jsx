import React from 'react';
import { ArrowRight } from 'react-bootstrap-icons'; // Import from the library you're using

const GlobalIcon = ({ type, className, ...props }) => {
    switch (type) {
        case 'arrow-right':
            return <ArrowRight className={className} {...props} />;
        // Green check mark for the 'check' case
        case 'check':
            return <i className={`bi bi-check-circle text-success ${className}`} {...props} />;
        case 'x':
            return <i className={`bi bi-x-lg ${className}`} {...props} />;
        default:
            return null;
    }
};

export default GlobalIcon;
