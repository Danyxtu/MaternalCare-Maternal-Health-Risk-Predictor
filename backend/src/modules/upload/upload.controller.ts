import type { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({
    message: "File uploaded successfully",
    url: filePath,
  });
};
