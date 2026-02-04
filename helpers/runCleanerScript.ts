import { spawn } from "node:child_process";
import path from "node:path";
import { __dirname } from "../utils/__dirname.ts";

interface CleanerResult {
  status: "ok" | "error";
  output_file?: string;
  output_path?: string;
  message?: string;
}

export function runCleanerScript(filename: string): Promise<CleanerResult> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "..", "cleaning", "test.py");
    const pythonProcess = spawn("python", [filePath, filename]);

    let stdout = "";
    let stderr = "";
    pythonProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        try {
          reject(JSON.parse(stderr));
        } catch (error) {
          reject(new Error(stderr));
        }
      }

      try {
        const result: CleanerResult = JSON.parse(stdout.trim());
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output:\n${stdout}`));
      }
    });
  });
}
