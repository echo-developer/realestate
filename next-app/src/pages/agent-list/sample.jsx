import Sample from './sample'; // Import the Sample component

import React, { useEffect, useRef } from 'react';
import Mmenu from 'mmenu-js';
import 'mmenu-js/dist/mmenu.css';

const MMenuComponent = () => {
  const menuRef = useRef(null);  // Ref to the menu element
  const menuInstance = useRef(null);  // Ref to the Mmenu instance

  useEffect(() => {
    // Initialize the Mmenu instance when the component mounts
    menuInstance.current = new Mmenu(menuRef.current, {
      extensions: ['effect-menu-slide'],
      offCanvas: {
        position: 'left',
      },
    });

    // Clean up the instance when the component unmounts
    return () => {
      menuInstance.current.destroy();
    };
  }, []);

  // Function to toggle the menu programmatically
  const toggleMenu = () => {
    menuInstance.current.open();
  };

  return (
    <div>
      {/* Button to trigger menu toggle */}
      <button onClick={toggleMenu}>Open Menu</button>

      {/* The menu element */}
      <nav ref={menuRef} id="menu" className="mm-menu">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default MMenuComponent;

