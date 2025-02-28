
const convertToSqft = (value, unit) => {
  const conversionRates = {
    Acre: 43560, // 1 Acre = 43,560 sqft
    sqft: 1,     // 1 sqft = 1 sqft
    sqm: 10.764  // 1 sqm = 10.764 sqft
  };
  
  return value * (conversionRates[unit] || 1);
};

const calculatePrice = (expectedPrice, superArea, unit) => {
  const areaInSqft = convertToSqft(superArea, unit);
  return areaInSqft * 555; // 555 per sqft
};


export default calculatePrice;