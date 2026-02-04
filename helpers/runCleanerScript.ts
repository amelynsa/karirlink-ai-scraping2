import { spawn } from "node:child_process";
import path from "node:path";
import { __dirname } from "../utils/__dirname.ts";
import { existsSync } from "node:fs";

interface CleanerResult {
  status: "ok" | "error";
  output_file?: string;
  output_path?: string;
  message?: string;
}

export function runCleanerScript(filePath: string): Promise<CleanerResult> {
  return new Promise((resolve, reject) => {
    if (!existsSync(path.join(process.cwd(), ".venv"))) {
      reject(
        new Error("Python virtual environment not found. Did you setup .venv?"),
      );
    }
    const pythonExecutable =
      process.platform === "win32"
        ? path.join(process.cwd(), ".venv", "Scripts", "python")
        : path.join(process.cwd(), ".venv", "bin", "python");

    const scriptPath = path.join(process.cwd(), "cleaning", "test.py");
    const pythonProcess = spawn(pythonExecutable, [scriptPath, filePath]);

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

// await runCleanerScript("test-result-2026-02-03T04-51-02-212Z.csv")
//   .then((res) => console.log(res))
//   .catch((e) => console.error(e));
