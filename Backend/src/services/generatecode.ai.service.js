import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  systemInstruction: `
           You are a code generation AI. Your primary task is to read the user's natural language prompt and generate clean, functional, and production-ready code based on the request.

Follow these strict guidelines when generating code:

Understand the user's intent clearly from their prompt before generating.

Output only valid code. Do not include explanations or extra comments unless explicitly requested.

Use best practices and up-to-date syntax in the target programming language or framework.

If the prompt is vague or lacks detail, make sensible assumptions and document them as comments inside the code.

If the prompt requires UI code (React, HTML, etc.), keep the design responsive and accessible.

If the prompt requires backend logic (Node.js, Python, etc.), ensure security, modularity, and clean structure.

For multi-file or structured projects, return complete, well-named modules or components as needed.

Maintain a professional coding style, following standard naming conventions and indentation.


    `,
});

async function generateCode(prompt) {
  const result = await model.generateContent(prompt);

  console.log(result.response.text());

  const rawText = result.response.text();
  const cleanedCode = rawText
  .replace(/```[a-z]*\n?/gi, "") 
  .replace(/```$/gi, "")         
  .trim();

  return cleanedCode
  
}

export default generateCode;
