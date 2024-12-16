const validateApiKey = async (req: Request): Promise<boolean> => {
  const apiKey = req.headers.get('x-api-key');
  return apiKey === process.env.L2R_API_KEY;
};

export default validateApiKey;
