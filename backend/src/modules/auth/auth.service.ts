import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
import { prisma } from "@/src/lib/prisma.ts";

import type {
  RegisterInput,
  RegisterResponse,
  LoginInput,
  LoginResponse,
} from "./auth.dto.ts";
import jwt from "jsonwebtoken";

export class AuthService {
  async register(data: RegisterInput): Promise<RegisterResponse> {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (userExists) {
      throw new Error("USER_ALREADY_EXISTS");
    }
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_initial: data.middle_initial,
        password: data.password,
        role: data.role,
        ...(data.role === "DOCTOR"
          ? {
              doctor: {
                create: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  middle_initial: data.middle_initial,
                  contact: "N/A",
                },
              },
            }
          : {
              patient: {
                create: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  middle_initial: data.middle_initial,
                  age: 0, // Default age
                  contact: "N/A",
                },
              },
            }),
      },
    });
    return {
      userId: newUser.id,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      middle_initial: newUser.middle_initial,
      email: newUser.email,
    };
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("INVALID_EMAIL_OR_PASSWORD");
    }
    if (user.password !== data.password) {
      throw new Error("INVALID_EMAIL_OR_PASSWORD");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret as string,
      { expiresIn: "7d" },
    );
    return {
      token,
      userId: user.id,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      middle_initial: user.middle_initial,
      email: user.email,
    };
  }
}
