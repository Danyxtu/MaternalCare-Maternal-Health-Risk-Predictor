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
import crypto from "crypto";
import { sendResetLink, sendResetOtp } from "../../lib/mailer.ts";

export class AuthService {
  async forgotPassword(email: string, method: "link" | "otp") {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if user exists, but we can throw specific error if internal
      throw new Error("USER_NOT_FOUND");
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    if (method === "link") {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetExpiresAt: expiresAt,
          resetOtp: null, // Clear other method
        },
      });
      await sendResetLink(email, token);
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetOtp: hashedOtp,
          resetExpiresAt: expiresAt,
          resetToken: null, // Clear other method
        },
      });
      await sendResetOtp(email, otp);
    }

    return { message: "RESET_CREDENTIAL_SENT" };
  }

  async resetPassword(data: { email: string; token?: string; otp?: string; password?: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.resetExpiresAt || user.resetExpiresAt < new Date()) {
      throw new Error("INVALID_OR_EXPIRED_RESET_REQUEST");
    }

    if (data.token) {
      if (user.resetToken !== data.token) {
        throw new Error("INVALID_RESET_TOKEN");
      }
    } else if (data.otp) {
      const isOtpValid = await bcrypt.compare(data.otp, user.resetOtp || "");
      if (!isOtpValid) {
        throw new Error("INVALID_RESET_OTP");
      }
    } else {
      throw new Error("RESET_CREDENTIAL_REQUIRED");
    }

    const hashedPassword = await bcrypt.hash(data.password || "", 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetOtp: null,
        resetExpiresAt: null,
      },
    });

    await prisma.activity.create({
      data: {
        type: "PASSWORD_RESET",
        message: `Password reset successfully for ${user.email}`,
        email: user.email,
      },
    });

    return { message: "PASSWORD_RESET_SUCCESS" };
  }

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
      age: user.patient?.age,
      contact: user.patient?.contact || user.doctor?.contact,
    };
  }
}
