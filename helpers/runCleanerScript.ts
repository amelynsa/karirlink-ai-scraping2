import { spawn } from "node:child_process";

export function runCleanerScript(filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", ["cleaning/test.py", filepath]);

    pythonProcess.stdout.on("data", (data) => {
      console.log(`${data}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Python script finished successfully.");
        resolve();
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
}
