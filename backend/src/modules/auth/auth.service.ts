import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
import { prisma } from "@/src/lib/prisma.ts";
import bcrypt from "bcrypt";

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

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_initial: data.middle_initial,
        password: hashedPassword,
        role: data.role,
        ...(data.role === "DOCTOR"
          ? {
              doctor: {
                create: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  middle_initial: data.middle_initial,
                  contact: "N/A",
                  id_card_url: data.id_card_url,
                },
              },
            }
          : data.role === "PATIENT"
          ? {
              patient: {
                create: {
                  first_name: data.first_name || "",
                  last_name: data.last_name || "",
                  middle_initial: data.middle_initial,
                  age: 0, // Default age
                  contact: "N/A",
                },
              },
            }
          : {}),
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    await prisma.activity.create({
      data: {
        type: "USER_REGISTERED",
        message: `${newUser.role} account created: ${newUser.first_name} ${newUser.last_name}`,
        email: newUser.email,
      },
    });

    return {
      userId: newUser.id,
      role: newUser.role,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      middle_initial: newUser.middle_initial,
      email: newUser.email,
      patientId: newUser.patient?.id ?? undefined,
      doctorId: newUser.doctor?.id ?? undefined,
    };
  }

  async login(data: LoginInput): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!user) {
      throw new Error("INVALID_EMAIL_OR_PASSWORD");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("INVALID_EMAIL_OR_PASSWORD");
    }

    if (user.role === "DOCTOR" && user.doctor?.status !== "APPROVED") {
      throw new Error("DOCTOR_NOT_APPROVED");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        patientId: user.patient?.id,
        doctorId: user.doctor?.id,
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
      patientId: user.patient?.id ?? undefined,
      doctorId: user.doctor?.id ?? undefined,
    };
  }
}
