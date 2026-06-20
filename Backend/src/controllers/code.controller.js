// /controllers/codeController.js
import axios from "axios"
import { languageMap } from "../utils/langMap.js";
import config from "../config/config.js";

export const runCode = async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  const languageId = languageMap[language];

  if (!languageId) {
    return res.status(400).json({ message: "Unsupported language selected" });
  }

  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
      base64_encoded: 'false',
      wait: 'true',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': config.JUDGE0_API_KEY ,
      'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    data: {
      language_id: languageId,
      source_code: code,
      stdin: ''
    }
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json({
      message: "code run successfully",
      output: response.data
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    return res.status(500).json({
      message: "error in run code",
      error: error?.response?.data || error.message
    });
  }
}
