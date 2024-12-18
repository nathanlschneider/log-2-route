const validateApiKey = async (req: Request): Promise<boolean> => {

  if (process.env.L2R_API_KEY === undefined || process.env.L2R_API_KEY === '') {
    console.error('*** l2r api key is not set? ***');
    return false
  }
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.L2R_API_KEY;
};

export default validateApiKey;
