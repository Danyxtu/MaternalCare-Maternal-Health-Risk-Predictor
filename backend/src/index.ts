import express from "express";
import cors from "cors";
import rootRouter from "./routes/index.ts";
import { transporter } from "./lib/mailer.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Verify SMTP Connection
transporter.verify((error, success) => {
  if (error) {
    console.error("[SMTP] Connection failed:", error.message);
  } else {
    console.log("[SMTP] Server is ready to send emails");
  }
});

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
