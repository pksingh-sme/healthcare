import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.sharedMedicalRecord.deleteMany()
  await prisma.session.deleteMany()
  await prisma.message.deleteMany()
  await prisma.billing.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.provider.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.user.deleteMany()
  await prisma.demoRequest.deleteMany()

  console.log('Existing data cleared')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@clinicease.ai',
      password: adminPassword,
      role: Role.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      isActive: true,
      twoFAEnabled: false,
    },
  })

  console.log('Admin user created')

  // Create provider users (10 records)
  const providers = []
  const providerPasswords = await Promise.all(
    Array.from({ length: 10 }, (_, i) => bcrypt.hash('provider123', 12))
  )

  for (let i = 0; i < 10; i++) {
    const providerUser = await prisma.user.create({
      data: {
        email: `provider${i + 1}@clinicease.ai`,
        password: providerPasswords[i],
        role: Role.PROVIDER,
        firstName: `Provider${i + 1}`,
        lastName: 'User',
        phone: `+12345678${i.toString().padStart(2, '0')}`,
        isActive: true,
        twoFAEnabled: false,
      },
    })

    const provider = await prisma.provider.create({
      data: {
        userId: providerUser.id,
        title: i % 2 === 0 ? 'Dr.' : 'Nurse',
        specialty: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'][i % 5],
        licenseNumber: `LIC${(1000 + i).toString()}`,
        department: ['Emergency', 'Surgery', 'ICU', 'Outpatient', 'Radiology'][i % 5],
      },
    })

    providers.push({ user: providerUser, provider })
  }

  console.log('Provider users created')

  // Create patient users (50 records)
  const patients = []
  const patientPasswords = await Promise.all(
    Array.from({ length: 50 }, (_, i) => bcrypt.hash('patient123', 12))
  )

  for (let i = 0; i < 50; i++) {
    const patientUser = await prisma.user.create({
      data: {
        email: `patient${i + 1}@clinicease.ai`,
        password: patientPasswords[i],
        role: Role.PATIENT,
        firstName: `Patient${i + 1}`,
        lastName: 'User',
        phone: `+19876543${i.toString().padStart(2, '0')}`,
        isActive: true,
        twoFAEnabled: false,
      },
    })

    const patient = await prisma.patient.create({
      data: {
        userId: patientUser.id,
        dateOfBirth: new Date(1980 + (i % 40), i % 12, (i % 28) + 1),
        gender: i % 2 === 0 ? 'Male' : 'Female',
        address: `${100 + i} Main St`,
        city: 'New York',
        state: 'NY',
        zipCode: `100${i.toString().padStart(2, '0')}`,
        emergencyContact: `Emergency Contact ${i + 1}`,
        emergencyPhone: `+1555${i.toString().padStart(4, '0')}`,
        insuranceType: 'PRIVATE',
        insuranceProvider: 'Blue Cross Blue Shield',
        insurancePolicyNumber: `POL${(10000 + i).toString()}`,
        insuranceGroupNumber: `GRP${(1000 + i).toString()}`,
        allergies: i % 3 === 0 ? 'Penicillin' : i % 3 === 1 ? 'Shellfish' : null,
        medications: i % 4 === 0 ? 'Lisinopril' : i % 4 === 1 ? 'Metformin' : i % 4 === 2 ? 'Atorvastatin' : null,
      },
    })

    patients.push({ user: patientUser, patient })
  }

  console.log('Patient users created')

  // Create appointments (30 records)
  const appointmentStatuses = ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']
  const appointmentTypes = ['Checkup', 'Consultation', 'Follow-up', 'Procedure', 'Emergency']

  for (let i = 0; i < 30; i++) {
    const patient = patients[i % patients.length]
    const provider = providers[i % providers.length]
    
    const startTime = new Date()
    startTime.setDate(startTime.getDate() + i)
    startTime.setHours(9 + (i % 8), 0, 0, 0)
    
    const endTime = new Date(startTime)
    endTime.setHours(startTime.getHours() + 1)

    await prisma.appointment.create({
      data: {
        patientId: patient.patient.id,
        providerId: provider.provider.id,
        createdById: provider.user.id,
        title: `${appointmentTypes[i % appointmentTypes.length]} Appointment`,
        description: `Appointment for ${patient.user.firstName} ${patient.user.lastName}`,
        startTime,
        endTime,
        status: appointmentStatuses[i % appointmentStatuses.length] as any,
        type: appointmentTypes[i % appointmentTypes.length],
        noShowProbability: Math.random(),
        riskFactors: i % 5 === 0 ? 'High blood pressure' : i % 5 === 1 ? 'Diabetes' : null,
      },
    })
  }

  console.log('Appointments created')

  // Create medical records (40 records)
  for (let i = 0; i < 40; i++) {
    const patient = patients[i % patients.length]
    const provider = providers[i % providers.length]
    
    // Find an appointment for this patient and provider if exists
    const appointment = await prisma.appointment.findFirst({
      where: {
        patientId: patient.patient.id,
        providerId: provider.provider.id,
      },
    })

    await prisma.medicalRecord.create({
      data: {
        patientId: patient.patient.id,
        providerId: provider.provider.id,
        appointmentId: appointment?.id,
        chiefComplaint: `Chief complaint for visit ${i + 1}`,
        diagnosis: i % 3 === 0 ? 'Hypertension' : i % 3 === 1 ? 'Diabetes' : 'Common Cold',
        treatment: i % 4 === 0 ? 'Prescribed medication' : i % 4 === 1 ? 'Recommended lifestyle changes' : i % 4 === 2 ? 'Scheduled follow-up' : 'Referred to specialist',
        notes: `Additional notes for medical record ${i + 1}`,
        bloodPressureSystolic: 120 + (i % 40),
        bloodPressureDiastolic: 80 + (i % 20),
        heartRate: 60 + (i % 40),
        temperature: 98.6 + (i % 2),
        weight: 150 + (i % 50),
        height: 65 + (i % 10),
        labResults: i % 3 === 0 ? 'Normal' : i % 3 === 1 ? 'Elevated cholesterol' : 'Pending',
        prescriptions: i % 4 === 0 ? 'Lisinopril 10mg daily' : i % 4 === 1 ? 'Metformin 500mg twice daily' : null,
        readmissionRisk: Math.random(),
        suggestedCodes: i % 2 === 0 ? 'I10,E11' : 'J00',
      },
    })
  }

  console.log('Medical records created')

  // Create billing records (25 records)
  const billingStatuses = ['PENDING', 'SUBMITTED', 'PROCESSING', 'PAID', 'DENIED', 'PARTIAL']

  for (let i = 0; i < 25; i++) {
    const patient = patients[i % patients.length]
    
    // Find a medical record for this patient if exists
    const medicalRecord = await prisma.medicalRecord.findFirst({
      where: {
        patientId: patient.patient.id,
      },
    })

    await prisma.billing.create({
      data: {
        patientId: patient.patient.id,
        appointmentId: medicalRecord?.appointmentId,
        invoiceNumber: `INV${(10000 + i).toString()}`,
        serviceDate: new Date(),
        serviceDescription: `Medical service ${i + 1}`,
        icdCodes: i % 2 === 0 ? 'I10,E11' : 'J00',
        cptCodes: i % 3 === 0 ? '99213' : i % 3 === 1 ? '99214' : '99215',
        subtotal: 100 + (i * 10),
        tax: (100 + (i * 10)) * 0.08,
        total: (100 + (i * 10)) * 1.08,
        insuranceBilled: (100 + (i * 10)) * 0.8,
        patientResponsibility: (100 + (i * 10)) * 0.2,
        status: billingStatuses[i % billingStatuses.length] as any,
        paymentMethod: i % 3 === 0 ? 'Credit Card' : i % 3 === 1 ? 'Insurance' : 'Cash',
        paymentDate: i % 2 === 0 ? new Date() : null,
        paidAmount: i % 2 === 0 ? (100 + (i * 10)) * 1.08 : 0,
        suggestedCodes: i % 2 === 0 ? 'I10,E11' : 'J00',
      },
    })
  }

  console.log('Billing records created')

  // Create messages (40 records)
  for (let i = 0; i < 40; i++) {
    const sender = i % 3 === 0 ? admin : i % 3 === 1 ? providers[i % providers.length].user : patients[i % patients.length].user
    const receiver = i % 3 === 2 ? admin : i % 3 === 0 ? providers[i % providers.length].user : patients[i % patients.length].user
    const patient = patients[i % patients.length]

    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        patientId: patient.patient.id,
        content: `Message ${i + 1} from ${sender.firstName} to ${receiver.firstName}`,
        isRead: i % 3 === 0,
        metadata: i % 4 === 0 ? JSON.stringify({ priority: 'high' }) : null,
      },
    })
  }

  console.log('Messages created')

  // Create demo requests (15 records)
  const demoStatuses = ['PENDING', 'VIEWED', 'CONTACTED', 'DEMO_COMPLETED', 'CLOSED']
  const roles = ['Admin', 'Provider', 'Patient']

  for (let i = 0; i < 15; i++) {
    await prisma.demoRequest.create({
      data: {
        name: `Demo Requester ${i + 1}`,
        email: `demo${i + 1}@example.com`,
        company: `Company ${(i % 5) + 1}`,
        role: roles[i % roles.length],
        message: `I would like to request a demo for ${roles[i % roles.length]} role.`,
        preferredDate: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)),
        preferredTime: `${9 + (i % 8)}:00 AM`,
        status: demoStatuses[i % demoStatuses.length] as any,
      },
    })
  }

  console.log('Demo requests created')

  // Create notifications (30 records)
  const notificationTypes = ['appointment', 'message', 'billing', 'reminder', 'alert']

  for (let i = 0; i < 30; i++) {
    const user = i % 3 === 0 ? admin : i % 3 === 1 ? providers[i % providers.length].user : patients[i % patients.length].user

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: notificationTypes[i % notificationTypes.length],
        title: `Notification ${i + 1}`,
        message: `This is notification ${i + 1} of type ${notificationTypes[i % notificationTypes.length]}`,
        read: i % 4 === 0,
        metadata: i % 5 === 0 ? JSON.stringify({ link: '/dashboard' }) : null,
      },
    })
  }

  console.log('Notifications created')

  // Create shared medical records (20 records)
  for (let i = 0; i < 20; i++) {
    const patient = patients[i % patients.length]
    
    // Find a medical record for this patient
    const medicalRecord = await prisma.medicalRecord.findFirst({
      where: {
        patientId: patient.patient.id,
      },
    })

    if (medicalRecord) {
      const sharedWithUser = i % 2 === 0 ? providers[i % providers.length].user : admin

      await prisma.sharedMedicalRecord.create({
        data: {
          recordId: medicalRecord.id,
          shareToken: `token${(10000 + i).toString()}`,
          sharedBy: patient.user.id,
          sharedWith: sharedWithUser.id,
          message: `Shared medical record ${i + 1}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      })
    }
  }

  console.log('Shared medical records created')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })