import { prisma } from "./lib/prisma.js";

async function ping() {
  try {
    console.log("🚀 Testing database connection...");

    // This sends a simple query to the DB
    await prisma.$connect();

    // Try to count users (even if it's 0)
    const userCount = await prisma.user.count();

    console.log("✅ Connection Successful!");
    console.log(`📊 Current User Count: ${userCount}`);
  } catch (error) {
    console.error("❌ Connection Failed!");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

ping();
