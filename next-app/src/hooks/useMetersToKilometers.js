const useMetersToKilometers = () => {
  const convert = (meters) => {
    if (typeof meters !== 'number' || isNaN(meters)) {
      return 'Invalid input';
    }

    const kilometers = meters / 1000;
    const precision = kilometers < 1 ? 4 : 2;
    
    return kilometers.toFixed(precision) + ' km';
  };

  return { convert };
};

export default useMetersToKilometers;