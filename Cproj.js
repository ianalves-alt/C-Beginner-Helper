import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import readline from "readline";

// input/output api config
dotenv.config({ path: ".env.local" });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const filePath = "./lastOutput.json";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//prompts variables
let templateOutput =
  "Hi Gemini, I'm studying C programming. Please give me a project idea focused specifically on C programming that is slightly harder than the last one I did. Include a description, what I'll improve with it, example output, and keep it under 100 words.";
let initialPrompt =
  "Hi Gemini, I'm starting with C programming. Please give me the easiest project possible,like, a program that prints hello world for example for basic usage of the c language using printf, including a description, what I'll improve, and an example output, without providing the code. Keep it under 100 words.";
let tooEasy =
  "The last project was too easy. Please give me a slightly harder C programming project idea, again focused on C, last project for context: ";
let tooHard =
  "The last project was too hard. Please give me a slightly easier C programming project idea, again focused on C.";

//get the previous output
async function getPreviousOutput() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

//save the current output
async function saveOutput(data) {
  await fs.writeFile(filePath, JSON.stringify(data));
}

//main function
async function run() {
  //gemini configuration and prompt definition
  const previousOutput = (await getPreviousOutput()) || initialPrompt;
  console.log("previous output:\n\n", previousOutput, "\n\n\n");
  const prompt = `${templateOutput}. Previous output: ${previousOutput}`;
  console.log("prompt sent: \n\n", previousOutput, "\n\n\n");
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  //sending prompts to gemini api and logging
  const result = await chat.sendMessage(prompt);

  const response = result.response;
  const text = response.text();
  console.log(text);
  saveOutput(text);

  console.log("Was it too hard?\n1. easy\n2. medium\n3. hard\n");
  //hard / easy definition
  async function askr() {
    rl.question("y: ", async (msg) => {
      if (msg == "1") {
        const previousOutput = await getPreviousOutput();
        const prompt = `${tooEasy}  ${previousOutput}`;
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();
        console.log("ai:", text);
        saveOutput(text);
        askr();
      }
      if (msg == "2") {
        console.log("Thanks for the feedback, see you tomorrow!");
        rl.close();
      }
      if (msg == "3") {
        const previousOutput = await getPreviousOutput();
        const prompt = `${tooHard}  ${previousOutput}`;
        const result = await chat.sendMessage(prompt);
        const response = result.response;
        const text = response.text();
        console.log("ai:", text);
        saveOutput(text);
        askr();
      }
    });
  }
  askr();
}
//useless shit that might be useful later
/*const prompt = `${templateOutput}. Previous output: ${previousOutput}`;

  

  try {
    async function start() {
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = await response.text;
      console.log(text);
    }
    start();

    rl.question(
      "Was it too hard?\n1. easy\n2. medium\n3. hard\n",
      async (answer) => {
        if (answer === "1") {
          const result1 = await chat.sendMessage(tooEasy);
          const response1 = await result1.response;
          const text1 = await response1.text();
          console.log(text1);
          await saveOutput(text1);
          start();
        } else if (answer == "2") {
          console.log("Thats great, see you tomorrow");
          rl.close();
        } else if (answer === "3") {
          let text = await generateWithRetry(tooHard);
          console.log(text);
          await saveOutput(text);
          run();
        } else {
          console.log("Thank you for your feedback!");
          rl.close();
        }
      },
    );
  } catch (error) {
    console.error("Error generating content:", error);
    rl.close();
  }
}*/
run();
/*async function generateWithRetry(prompt, retries = 3) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      let result = await model.generateContent(prompt);
      let response = await result.response;
      let text = await response.text();
      return text; // Return successful response
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);
      if (attempt === retries - 1) throw error; // If it's the last attempt, throw the error
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
    }
  }
}
*/
