import type { Request, Response } from "express";
import { prisma } from "@/src/lib/prisma.ts";
import bcrypt from "bcrypt";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ data: doctors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        doctor: true,
        patient: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  const { limit } = req.query;
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit ? Number(limit) : 50, // Default to 50 for the logs page
    });
    res.json({ data: activities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addAdmin = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        role: "ADMIN",
      },
    });

    await prisma.activity.create({
      data: {
        type: "ADMIN_CREATED",
        message: `Admin account created: ${first_name} ${last_name}`,
        email: email,
      },
    });

    res.status(201).json({ message: "Admin created successfully", data: admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user;

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protection: admin@test.com cannot be deleted
    if (userToDelete.email === "admin@test.com") {
      return res.status(403).json({ message: "The main admin cannot be deleted." });
    }

    // Protection: Only the main admin (admin@test.com) can delete other admins
    if (userToDelete.role === "ADMIN" && currentUser?.email !== "admin@test.com") {
      return res.status(403).json({ message: "Only the main admin can delete other admins." });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    await prisma.activity.create({
      data: {
        type: "USER_DELETED",
        message: `${userToDelete.role} user deleted: ${userToDelete.first_name} ${userToDelete.last_name}`,
        email: userToDelete.email,
      },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: { status: "APPROVED" },
      include: { user: true },
    });

    await prisma.activity.create({
      data: {
        type: "DOCTOR_APPROVED",
        message: `Doctor approved: ${updatedDoctor.first_name} ${updatedDoctor.last_name}`,
        email: updatedDoctor.user?.email,
      },
    });

    res.json({ message: "Doctor approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectDoctor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: Number(id) },
      data: { status: "REJECTED" },
      include: { user: true },
    });

    await prisma.activity.create({
      data: {
        type: "DOCTOR_REJECTED",
        message: `Doctor rejected: ${updatedDoctor.first_name} ${updatedDoctor.last_name}`,
        email: updatedDoctor.user?.email,
      },
    });

    res.json({ message: "Doctor rejected successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalDoctors = await prisma.doctor.count();
    const pendingDoctors = await prisma.doctor.count({ where: { status: "PENDING" } });
    const approvedDoctors = await prisma.doctor.count({ where: { status: "APPROVED" } });
    const totalPatients = await prisma.patient.count();

    res.json({
      data: {
        totalDoctors,
        pendingDoctors,
        approvedDoctors,
        totalPatients,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
