-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('CONFIRMED', 'PENDING', 'CANCELED');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('GENERAL', 'PUPPY', 'STUD');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" VARCHAR(100) NOT NULL,
    "customerPhoneNumber" VARCHAR(30) NOT NULL,
    "appointmentType" "AppointmentType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puppyId" INTEGER,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "appointment_time_index" ON "Appointment"("date", "startTime");

-- CreateIndex
CREATE INDEX "Availability_date_status_idx" ON "Availability"("date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Availability_date_timeSlot_key" ON "Availability"("date", "timeSlot");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_puppyId_fkey" FOREIGN KEY ("puppyId") REFERENCES "Puppy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
