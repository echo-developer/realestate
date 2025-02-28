const convertToSqft = (value, unit) => {
  const conversionRates = {
    Acre: 43560, // 1 Acre = 43,560 sqft
    sqft: 1,     // 1 sqft = 1 sqft
    sqm: 10.764  // 1 sqm = 10.764 sqft
  };

  if (!value || isNaN(value)) return 0; // Prevent NaN for invalid values
  if (!unit || !conversionRates[unit]) return 0; // Prevent invalid unit

  return value * conversionRates[unit];
};

const calculatePricePerSqft = (totalPrice, superArea, unit) => {
  if (totalPrice === undefined || isNaN(totalPrice)) {
    console.error("Error: totalPrice is missing or invalid", totalPrice);
    return "0.00";
  }
  
  if (superArea === undefined || isNaN(superArea)) {
    console.error("Error: superArea is missing or invalid", superArea);
    return "0.00";
  }
  
  if (!unit || typeof unit !== "string") {
    console.error("Error: unit is missing or invalid", unit);
    return "0.00";
  }

  const areaInSqft = convertToSqft(superArea, unit);
  
  if (areaInSqft === 0) {
    console.error("Error: Conversion to sqft failed, invalid unit or zero area", unit);
    return "0.00";
  }

  return (totalPrice / areaInSqft).toFixed(2); // Returns price per sqft (2 decimal places)
};

export default calculatePricePerSqft;
