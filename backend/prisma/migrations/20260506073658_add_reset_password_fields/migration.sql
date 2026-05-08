-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetExpiresAt" TIMESTAMP(3),
ADD COLUMN     "resetOtp" TEXT,
ADD COLUMN     "resetToken" TEXT;
