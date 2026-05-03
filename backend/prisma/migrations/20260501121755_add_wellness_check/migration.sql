-- CreateTable
CREATE TABLE "WellnessCheck" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "sleep_hours" DOUBLE PRECISION NOT NULL,
    "water_intake" DOUBLE PRECISION,
    "diet_quality" TEXT,
    "stress_level" TEXT,
    "supplements_taken" BOOLEAN,
    "mood" TEXT,
    "tips" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WellnessCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WellnessCheck" ADD CONSTRAINT "WellnessCheck_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
