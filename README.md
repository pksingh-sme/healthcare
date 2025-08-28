# Healthcare Management by ClinchInfoSystems

A comprehensive full-stack healthcare management system built with Next.js, featuring AI-powered scheduling, real-time messaging, billing automation, and HIPAA-compliant patient management.

![ClinicEase AI Dashboard](https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80)

## 🏥 Overview

Healthcare AI streamlines clinic operations with intelligent automation, secure communication, and compliant data handling. Built for healthcare providers who need efficiency and patients who demand quality care.

### Key Features

- **Smart Appointment Scheduling** - AI predicts no-shows and enables automated overbooking
- **Patient Portal** - Secure access to medical records, messaging, and appointments
- **Provider Dashboard** - Centralized interface for managing patients, records, and schedules
- **Electronic Health Records (EHR)** - Digital records with AI-driven readmission risk assessment
- **Intelligent Billing** - Automated ICD-10/CPT coding with Stripe integration
- **Real-time Messaging** - Secure Socket.io-powered communication between patients and providers

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: JWT via NextAuth.js
- **Real-time**: Socket.io
- **Payments**: Stripe
- **Deployment**: Vercel or AWS

## 🛠 Local Development Setup

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/pksingh-sme/healthcare.git
cd healthcare

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Visit `http://localhost:3001` to see the application.

## 📁 Project Structure

```
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   ├── contexts/          # React context providers
│   ├── lib/               # Utility functions and services
│   └── pages/             # Legacy pages (for Socket.io)
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🌐 Deployment Options

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

## 👥 User Roles

- **Admin** - Full system access and user management
- **Provider** - Patient management and clinical features
- **Patient** - Personal health records and communication

## 🔒 Security & Compliance

- HIPAA-compliant data handling
- End-to-end encryption for messaging
- Role-based access control
- Audit logging for compliance

## 📄 License

@copyright 2025. 

