import dotenv from "dotenv"
import {GoogleGenerativeAI} from "@google/generative-ai"
import readline from "readline"
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

dotenv.config({path: '.env.local'})

const genai = new GoogleGenerativeAI(process.env.API_KEY)


async function run(){
  const model = genai.getGenerativeModel({model: "gemini-pro"})
  const chat = model.startChat({
    history: [],
  })
  async function askr(){
    rl.question("You: ", async (msg) => {
      if (msg.toLowerCase() === "exit"){
        rl.close
      }else{
        const result = await chat.sendMessage(msg)
        const response = await result.response;
        const text = await response.text()
        console.log("AI: ", text)
        askr()
      }
    })
  }
  askr()
}
run()
