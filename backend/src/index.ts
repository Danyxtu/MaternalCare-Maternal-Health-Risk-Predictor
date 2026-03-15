import express from "express";
import cors from "cors";
import ort from "onnxruntime-node";

// helper
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Model
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const MODEL_PATH = join(__dirname, "assets", "maternal_care_model.onnx");

console.log(MODEL_PATH);
const app = express();
app.use(cors());
app.use(express.json());

let session: any;

const loadModel = async () => {
  try {
    session = await ort.InferenceSession.create(MODEL_PATH);
    console.log("Model loaded successfully.");
    console.log("Expected Input Names:", session.inputNames);
    // It likely looks like ['Age', 'SystolicBP', 'DiastolicBP', etc.]
  } catch (error) {
    console.error("Error loading model:", error);
  }
};

loadModel();

app.get("/test", (req: any, res: any) => {
  res.send("Server is up and listening for POST requests on /predict!");
});

app.post("/predict", async (req: any, res: any) => {
  try {
    const data =
      req.body.pheinz_physiological_data || req.query.pheinz_physiological_data;

    if (!data) {
      return res.status(400).json({ error: "No Datqa provided" });
    }
    const formattedData = Array.isArray(data)
      ? data
      : JSON.parse(data as string);

    const inputTensor = new ort.Tensor(
      "float32",
      Float32Array.from(formattedData),
      [1, 6],
    );

    const feeds = {
      Age: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[0]]),
        [1, 1],
      ),
      SystolicBP: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[1]]),
        [1, 1],
      ),
      DiastolicBP: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[2]]),
        [1, 1],
      ),
      BS: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[3]]),
        [1, 1],
      ),
      BodyTemp: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[4]]),
        [1, 1],
      ),
      HeartRate: new ort.Tensor(
        "float32",
        new Float32Array([formattedData[5]]),
        [1, 1],
      ),
    };
    const results = await session.run(feeds);

    const outputName = session.outputNames[0];
    const prediction = results[outputName].data[0];
    res.json({
      prediction,
      confidence: Array.from(results.probabilities.data),
    });
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: e.message });
    } else {
      res.status(500).json({ error: String(e) });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// For Proper Routing

import rootRouter from "./routes/index.ts";

app.use("/api", rootRouter);
