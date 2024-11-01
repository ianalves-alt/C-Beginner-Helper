import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";

dotenv.config({ path: '.env.local' });

const filePath = './lastOutput.json';
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

let templateOutput = "hi gemini, i am studying C programming and i need you to give me a project just a little tiny bit harder than the last one you gave me, with lots of emphasis on tiny bit, with description, what will i improve with it, and example program usage, without answer code, and maximum words of 100";

async function getPreviousOutput() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

async function saveOutput(data) {
    await fs.writeFile(filePath, JSON.stringify(data));
}

async function run() {
    const previousOutput = await getPreviousOutput() || "none";
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `${templateOutput}. previous output: ${previousOutput}`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        await saveOutput(text); // Use await here since saveOutput is async
    } catch (error) {
        console.error('Error generating content:', error);
    }
}

run();

