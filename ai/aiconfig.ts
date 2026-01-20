import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});
