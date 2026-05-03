import { Role, AlertSeverity, AlertStatus, AlertType } from "../src/generated/prisma/index.js";
import { prisma } from "../src/lib/prisma.ts";

async function main() {
  // Clear existing data to avoid unique constraint violations
  await prisma.notification.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.user.deleteMany({});

  const doctorEmail = "doctor@test.com";
  const doctorPassword = "password";

  // Create Doctor
  const doctorUser = await prisma.user.upsert({
    where: { email: doctorEmail },
    update: {
      password: doctorPassword,
    },
    create: {
      email: doctorEmail,
      password: doctorPassword,
      role: Role.DOCTOR,
      first_name: "John",
      last_name: "Doe",
      doctor: {
        create: {
          first_name: "John",
          last_name: "Doe",
          contact: "1234567890",
        },
      },
    },
  });

  const doctor = await prisma.doctor.findFirst({ where: { userId: doctorUser.id } });

  console.log({ doctorUser });

  const patientsData = [
    { email: "pheinz@test.com", first_name: "Pheinz", last_name: "Test", age: 25, risk: "high", bp: "145/95", bloodSugar: 6.1, heartRate: 92 },
    { email: "niljin@test.com", first_name: "Niljin", last_name: "Test", age: 28, risk: "low", bp: "115/75", bloodSugar: 5.0, heartRate: 72 },
    { email: "hannah@test.com", first_name: "Hannah", last_name: "Test", age: 30, risk: "medium", bp: "135/88", bloodSugar: 5.8, heartRate: 85 },
    { email: "junay@test.com", first_name: "Junay", last_name: "Test", age: 22, risk: "low", bp: "110/70", bloodSugar: 4.7, heartRate: 68 },
    { email: "erica@test.com", first_name: "Erica", last_name: "Test", age: 27, risk: "high", bp: "148/92", bloodSugar: 7.1, heartRate: 105 },
  ];

  for (const p of patientsData) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        password: "password",
      },
      create: {
        email: p.email,
        password: "password",
        role: Role.PATIENT,
        first_name: p.first_name,
        last_name: p.last_name,
        patient: {
          create: {
            first_name: p.first_name,
            last_name: p.last_name,
            age: p.age,
            contact: "09123456789",
          },
        },
      },
      include: { patient: true }
    });

    if (user.patient) {
      // Create a mock assessment
      const assessment = await prisma.assessment.create({
        data: {
          patientId: user.patient.id,
          doctorId: doctor?.id,
          version: 1,
          physiological_data: {
            SystolicBP: parseInt(p.bp.split('/')[0]),
            DiastolicBP: parseInt(p.bp.split('/')[1]),
            BS: p.bloodSugar,
            HeartRate: p.heartRate,
            BodyTemp: 37.0,
            Age: p.age,
            sleep_hours: 8,
            hemoglobin_g_dL: 12,
            iron_supplement: 1,
            folic_supplement: 1,
            diet_adherence: "Good"
          },
          model_version: "1.0",
          risk_score: p.risk === "high" ? 0.9 : p.risk === "medium" ? 0.5 : 0.1,
          risk_label: p.risk,
          notes: "Initial assessment from seeder",
        }
      });

      // If high risk, create an alert
      if (p.risk === "high") {
        await prisma.alert.create({
          data: {
            assessmentId: assessment.id,
            patientId: user.patient.id,
            assigneeId: doctor?.id,
            type: AlertType.MATERNAL_RISK,
            severity: AlertSeverity.CRITICAL,
            status: AlertStatus.OPEN,
            message: `High risk detected for ${p.first_name}`,
          }
        });
      } else if (p.risk === "medium") {
        await prisma.alert.create({
          data: {
            assessmentId: assessment.id,
            patientId: user.patient.id,
            assigneeId: doctor?.id,
            type: AlertType.MATERNAL_RISK,
            severity: AlertSeverity.WARNING,
            status: AlertStatus.OPEN,
            message: `Medium risk detected for ${p.first_name}`,
          }
        });
      }
    }

    console.log(`Created patient and data for: ${user.email}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
