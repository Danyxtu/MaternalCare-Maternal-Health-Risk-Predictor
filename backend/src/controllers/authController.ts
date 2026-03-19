import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name, middle_initial, role } =
    req.body;

  const allowedRoles = ["PATIENT", "DOCTOR"] as const;

  const normalizedRole =
    typeof role === "string" ? role.toUpperCase() : "PATIENT";
  const userRole = allowedRoles.includes(
    normalizedRole as (typeof allowedRoles)[number],
  )
    ? (normalizedRole as (typeof allowedRoles)[number])
    : "PATIENT";

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        email: email,
        first_name: first_name ?? null,
        last_name: last_name ?? null,
        middle_initial: middle_initial ?? null,
        password: hashedPassword,
        role: userRole,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_initial: user.middle_initial,
      email: user.email,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role, sub: user.id },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    // Here you would typically generate a JWT token and send it back to the client
    res.json({
      message: "Login successful",
      userId: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_initial: user.middle_initial,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
