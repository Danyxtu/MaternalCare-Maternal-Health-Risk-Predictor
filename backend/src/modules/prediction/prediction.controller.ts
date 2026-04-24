import { spawn } from "child_process";
import path from "path";
import os from "os";

export const explainModel = (req: any, res: any) => {
  const data = req.body?.physiological_data;
  if (!Array.isArray(data)) {
    return res
      .status(400)
      .json({ error: "physiological_data must be an array" });
  }

  // Make paths absolute (recommended)
  const pythonPath = path.join(os.homedir(), "venv", "bin", "python3");
  const scriptPath = path.resolve(process.cwd(), "src/assets/lime_explain.py");

  const python = spawn(pythonPath, [scriptPath, JSON.stringify(data)]);

  let stdout = "";
  let stderr = "";

  python.stdout.on("data", (d) => (stdout += d.toString()));
  python.stderr.on("data", (d) => (stderr += d.toString()));

  python.on("error", (err) => {
    return res
      .status(500)
      .json({ error: "Failed to start python", details: err.message });
  });

  python.on("close", (code) => {
    if (code !== 0) {
      return res
        .status(500)
        .json({ error: "Python script failed", code, stderr });
    }

    try {
      return res.json(JSON.parse(stdout));
    } catch (e: any) {
      return res.status(500).json({
        error: "Python did not return valid JSON",
        stderr,
        stdout,
        details: e.message,
      });
    }
  });
};
