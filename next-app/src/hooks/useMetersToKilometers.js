// src/hooks/useMetersToKilometers.js

const useMetersToKilometers = () => {
    const convert = (meters) => {
      if (typeof meters !== 'number' || isNaN(meters)) {
        return 'Invalid input';
      }
      return (meters / 1000).toFixed(2) + ' km';
    };
  
    return { convert };
  };
  
  export default useMetersToKilometers;
  