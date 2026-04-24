import express from "express";
import cors from "cors";
import rootRouter from "./routes/index.ts";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);

app.use("/api", rootRouter);

// Test
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working!",
    timeStamp: new Date().toISOString(),
  });
});
