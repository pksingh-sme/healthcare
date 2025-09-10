-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT,
ADD COLUMN     "lastActivityAt" TIMESTAMP(3);