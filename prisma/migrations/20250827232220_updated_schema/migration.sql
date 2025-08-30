/*
  Warnings:

  - You are about to drop the column `method` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,timeSlot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId,date,timeSlot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "guestCount" INTEGER;

-- AlterTable
ALTER TABLE "public"."Client" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "method",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."PricingSeason" ADD COLUMN     "daysOfWeek" "public"."WeekDay"[],
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "public"."PaymentMethod";

-- CreateIndex
CREATE INDEX "Booking_date_timeSlot_idx" ON "public"."Booking"("date", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_date_timeSlot_key" ON "public"."Booking"("date", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_clientId_date_timeSlot_key" ON "public"."Booking"("clientId", "date", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phoneNumber_key" ON "public"."Client"("phoneNumber");
