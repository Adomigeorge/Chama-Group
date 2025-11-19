// Generate random numeric ID
const generateShortId = () => {
  return Math.floor(100 + Math.random() * 900); // 100 to 999
};

// Ensure unique ID (you can enhance this later with database checks)
const generateUniqueShortId = async (Model, maxAttempts = 10) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shortId = generateShortId();
    
    // Check if ID already exists in the database
    const existingRecord = await Model.findByPk(shortId);
    if (!existingRecord) {
      return shortId;
    }
  }
  
  // Fallback: use timestamp-based ID if all random attempts fail
  return Math.floor(1000 + Date.now() % 900);
};

module.exports = {
  generateShortId,
  generateUniqueShortId,
};