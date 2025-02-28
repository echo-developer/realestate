const convertToSqft = (value, unit) => {
  const conversionRates = {
    Acre: 43560, // 1 Acre = 43,560 sqft
    sqft: 1,     // 1 sqft = 1 sqft
    sqm: 10.764  // 1 sqm = 10.764 sqft
  };

  return value * (conversionRates[unit] || 1);
};

const calculatePricePerSqft = (totalPrice, superArea, unit) => {
  const areaInSqft = convertToSqft(superArea, unit);
  const value = (totalPrice / areaInSqft).toFixed(2);
  return value ? `${value} /sqft` : "";
};

export default calculatePricePerSqft;
