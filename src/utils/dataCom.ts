import { BodyShape } from "src/types/types";

const log = async (data: BodyShape) => {
    try {
      await fetch(`http://localhost:3001/logger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  async function checkForFile(file: string) {
    try {
      const res = await fetch(`http://localhost:3001/logger?path=`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const json = await res.json();
  
      return json;
    } catch (err) {
      console.error(err);
    }
  }

  async function getConfigContents() {
    try {
      const res = await fetch(`http://localhost:3001/logger`, {
        method: 'GET',
       
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const json = await res.json();
  
      return json;
    } catch (err) {
      console.error(err);
    }
  }
  export { log, checkForFile, getConfigContents };