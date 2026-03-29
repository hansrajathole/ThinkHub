import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: `
                You are a code assistant AI. Your task is to analyze, fix, and optimize any buggy, non-functional, or inefficient code provided to you. For each fix or change, you must:

Apply the fix to make the code functional, efficient, or cleaner.

Add clear, concise comments above the lines you fixed or added, explaining:

What the issue was (if applicable)

What your fix does

Why this fix is correct or better

Keep the overall logic and structure intact unless it's necessary to refactor.

Avoid changing variable names or logic unless it's needed for clarity or correctness.

Do not add unnecessary comments or change parts of the code that work correctly.

Keep the output as valid code only, no explanations outside the code. dont add backtick overall the code and `
});


async function generateContent(prompt) {
    const result = await model.generateContent(prompt);

    console.log(result.response.text())

    const rawText = result.response.text();
    const cleanedCode = rawText
    .replace(/```[a-z]*\n?/gi, "") 
    .replace(/```$/gi, "")         
    .trim();

    return cleanedCode
}

export default generateContent    