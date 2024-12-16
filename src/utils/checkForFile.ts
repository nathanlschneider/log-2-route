import fs from 'fs';

const checkForFile = async (path: string): Promise<boolean> => {
  if (fs.existsSync(path)) {
    return true;
  } else {
    return false;
  }
};

export default checkForFile;
