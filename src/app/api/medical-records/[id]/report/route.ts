import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/auth'
import { formatSimpleProviderName } from '@/lib/format'
import { logPHIAccess } from '@/lib/audit'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Import autotable plugin if needed

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only providers and admins can generate reports
    if (user.role === 'PATIENT') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const recordId = params.id

    // Fetch the medical record
    const record = await prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        provider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        appointment: {
          select: {
            title: true,
            startTime: true,
          },
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { error: 'Medical record not found' },
        { status: 404 }
      )
    }

    // Check permissions - providers can only generate reports for their own records
    if (user.role === 'PROVIDER' && record.providerId !== user.provider?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Log PHI access for audit trail - HIPAA compliance
    await logPHIAccess(
      user.id,
      'GENERATE_REPORT',
      'MedicalRecord',
      recordId,
      'Generated PDF medical report',
      request
    );

    // Create a new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set document properties
    doc.setProperties({
      title: `Medical Record - ${record.patient.user.firstName} ${record.patient.user.lastName}`,
      subject: 'Medical Record Report',
      author: 'ClinicEase AI EHR System',
      keywords: 'medical, record, report, healthcare',
      creator: 'ClinicEase AI EHR System'
    });

    // Add logo and header
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 166);
    doc.text('ClinicEase Medical Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
    doc.text(`Report ID: ${recordId}`, 105, 37, { align: 'center' });
    doc.text('CONFIDENTIAL - PROTECTED HEALTH INFORMATION', 105, 44, { align: 'center' });
    
    // Add separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 48, 190, 48);

    // Patient Information Section
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('Patient Information', 20, 58);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Patient details
    doc.text(`Name: ${record.patient.user.firstName} ${record.patient.user.lastName}`, 20, 68);
    doc.text(`Date of Birth: ${record.patient.dateOfBirth ? new Date(record.patient.dateOfBirth).toLocaleDateString() : 'Not provided'}`, 20, 75);
    doc.text(`Email: ${record.patient.user.email}`, 20, 82);
    doc.text(`Phone: ${record.patient.user.phone || 'Not provided'}`, 20, 89);
    
    // Add separator line
    doc.line(20, 95, 190, 95);

    // Provider Information Section
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('Provider Information', 20, 105);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Provider details
    doc.text(`Provider: ${formatSimpleProviderName(record.provider.user.firstName, record.provider.user.lastName)}`, 20, 115);
    doc.text(`Record Date: ${new Date(record.createdAt).toLocaleString()}`, 20, 122);
    
    // Add separator line
    doc.line(20, 128, 190, 128);

    // Clinical Information Section
    let yPos = 138;
    
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('Clinical Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Chief Complaint
    if (record.chiefComplaint) {
      doc.setFont('helvetica', 'bold');
      doc.text('Chief Complaint:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.chiefComplaint, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Diagnosis
    if (record.diagnosis) {
      doc.setFont('helvetica', 'bold');
      doc.text('Diagnosis:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.diagnosis, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Treatment Plan
    if (record.treatment) {
      doc.setFont('helvetica', 'bold');
      doc.text('Treatment Plan:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.treatment, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add separator line
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Vital Signs Section
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('Vital Signs', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Create vital signs table
    const vitalSignsData = [];
    if (record.bloodPressureSystolic && record.bloodPressureDiastolic) {
      vitalSignsData.push(['Blood Pressure', `${record.bloodPressureSystolic}/${record.bloodPressureDiastolic} mmHg`]);
    }
    if (record.heartRate) {
      vitalSignsData.push(['Heart Rate', `${record.heartRate} bpm`]);
    }
    if (record.temperature) {
      vitalSignsData.push(['Temperature', `${record.temperature}°F`]);
    }
    if (record.weight) {
      vitalSignsData.push(['Weight', `${record.weight} lbs`]);
    }
    if (record.height) {
      vitalSignsData.push(['Height', `${record.height} inches`]);
    }
    
    // Simple table implementation without autotable for now
    if (vitalSignsData.length > 0) {
      // Table header
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(40, 116, 166);
      doc.setTextColor(255, 255, 255);
      doc.rect(20, yPos, 80, 10, 'F');
      doc.rect(100, yPos, 80, 10, 'F');
      doc.text('Vital Sign', 25, yPos + 7);
      doc.text('Value', 105, yPos + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      // Table rows
      let rowY = yPos + 10;
      vitalSignsData.forEach(([sign, value], index) => {
        const rowYPos = rowY + (index * 10);
        doc.text(sign, 25, rowYPos + 7);
        doc.text(value, 105, rowYPos + 7);
        
        // Draw row borders
        doc.rect(20, rowYPos, 80, 10);
        doc.rect(100, rowYPos, 80, 10);
      });
      
      yPos += 10 + (vitalSignsData.length * 10);
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Clinical Data Section
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('Clinical Data', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Lab Results
    if (record.labResults) {
      doc.setFont('helvetica', 'bold');
      doc.text('Lab Results:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.labResults, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Prescriptions
    if (record.prescriptions) {
      doc.setFont('helvetica', 'bold');
      doc.text('Prescriptions:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.prescriptions, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Clinical Notes
    if (record.notes) {
      doc.setFont('helvetica', 'bold');
      doc.text('Clinical Notes:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(record.notes, 150);
      doc.text(splitText, 20, yPos + 7);
      yPos += 7 + (splitText.length * 7);
    }
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    // Add separator line
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // AI Insights Section
    doc.setFontSize(16);
    doc.setTextColor(40, 116, 166);
    doc.text('AI Insights', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Readmission Risk: ${Math.round(record.readmissionRisk * 100)}%`, 20, yPos);
    yPos += 7;
    
    if (record.suggestedCodes) {
      doc.text(`Suggested Codes: ${record.suggestedCodes}`, 20, yPos);
      yPos += 7;
    }
    
    // Add footer with HIPAA compliance notice
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('CONFIDENTIAL - PROTECTED HEALTH INFORMATION', 105, 270, { align: 'center' });
    doc.text('This report contains Protected Health Information (PHI) and is confidential.', 105, 275, { align: 'center' });
    doc.text('Generated by ClinicEase AI EHR System. Access restricted to authorized personnel only.', 105, 280, { align: 'center' });
    doc.text('Report generated for: ' + user.firstName + ' ' + user.lastName + ' (' + user.role + ')', 105, 285, { align: 'center' });
    doc.text('For questions, please contact your healthcare provider.', 105, 290, { align: 'center' });
    
    // Generate PDF as buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="medical-report-${recordId}.pdf"`,
        // Add security headers for HIPAA compliance
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      },
    });
  } catch (error) {
    console.error('Error generating medical report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}