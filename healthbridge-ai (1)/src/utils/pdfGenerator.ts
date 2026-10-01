import jsPDF from 'jspdf';

export interface AppointmentPassData {
  token: string;
  facility: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  patientName?: string;
  abhaId?: string;
  estWait?: string;
}

export function downloadAppointmentPassPDF(data: AppointmentPassData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const patientName = data.patientName || 'Devi S.';
  const abhaId = data.abhaId || '91-4458-1209';
  const token = data.token || '#12';
  const facility = data.facility || 'Kanyakumari Government PHC';
  const dept = data.department || 'General Medicine & Maternal';
  const doctor = data.doctor || 'Dr. Meena R., MBBS, DGO';
  const date = data.date || 'Today, 21 Sept 2026';
  const time = data.time || '10:30 AM';
  const estWait = data.estWait || '~20 mins';

  // Background card styling
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 15, 180, 260, 4, 4, 'F');

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(15, 15, 180, 42, 4, 4, 'F');

  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ArogyaConnect', 22, 28);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Tamil Nadu Public Health Network • Kanyakumari District Hub', 22, 35);
  doc.text('DIGITAL OUTPATIENT APPOINTMENT PASS', 22, 43);

  // Status Badge
  doc.setFillColor(13, 148, 136); // teal-600
  doc.roundedRect(140, 22, 45, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('VERIFIED TOKEN', 147, 30);

  // Large Token Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(25, 65, 160, 45, 4, 4, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUR QUEUE TOKEN NUMBER', 32, 76);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(28);
  doc.text(token, 32, 92);

  doc.setTextColor(13, 148, 136);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Estimated Wait Time: ${estWait}`, 32, 101);

  // Patient Info Strip
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(25, 118, 160, 30, 3, 3, 'F');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text('PATIENT NAME', 32, 126);
  doc.text('ABHA HEALTH ID', 110, 126);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(patientName, 32, 135);
  doc.text(abhaId, 110, 135);

  // Appointment Details Grid
  let y = 160;
  const rows = [
    { label: 'Healthcare Facility:', value: facility },
    { label: 'Specialty Department:', value: dept },
    { label: 'Consulting Medical Officer:', value: doctor },
    { label: 'Appointment Date:', value: date },
    { label: 'Reporting Time Window:', value: time },
  ];

  doc.setFont('helvetica', 'normal');
  rows.forEach((row) => {
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(row.label, 28, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(row.value, 82, y);

    doc.setDrawColor(241, 245, 249);
    doc.line(28, y + 3, 180, y + 3);
    y += 12;
  });

  // Instructions Box
  y += 5;
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(251, 191, 36); // amber-400
  doc.roundedRect(25, y, 160, 26, 3, 3, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('IMPORTANT PATIENT INSTRUCTIONS', 32, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('• Please arrive 15 minutes before reporting time at OPD Room 4.', 32, y + 14);
  doc.text('• Carry your ABHA Card and any previous laboratory test prescriptions.', 32, y + 20);

  // Footer / Verification QR placeholder
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text('Official Government Public Health System • Validated in ArogyaConnect Kanyakumari', 25, 262);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 25, 267);

  // Save PDF to device
  const cleanToken = token.replace(/[^a-zA-Z0-9]/g, '');
  doc.save(`ArogyaConnect_Appointment_Token_${cleanToken || 'Pass'}.pdf`);
}

export function downloadCalendarEvent(data: AppointmentPassData) {
  const title = `ArogyaConnect Appointment: ${data.doctor || 'Dr. Meena R.'}`;
  const location = `${data.facility || 'Kanyakumari Govt PHC'}, Kanyakumari, Tamil Nadu`;
  const description = `Appointment Token: ${data.token || '#12'}\\nDepartment: ${data.department || 'General Medicine'}\\nPatient: ${data.patientName || 'Devi S.'} (ABHA: ${data.abhaId || '91-4458-1209'})\\nEstimated wait: ${data.estWait || '~20 mins'}`;

  // Simple date format for ics (today or tomorrow)
  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = String(now.getMonth() + 1).padStart(2, '0');
  const startDay = String(now.getDate()).padStart(2, '0');

  const dtstart = `${startYear}${startMonth}${startDay}T103000Z`;
  const dtend = `${startYear}${startMonth}${startDay}T113000Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ArogyaConnect//Appointment System//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `ArogyaConnect_Appointment_${data.token?.replace(/[^a-zA-Z0-9]/g, '') || 'Token'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPatientRecordPDF(patientName = 'Devi S.', abhaId = '91-4458-1209') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(15, 15, 180, 42, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ArogyaConnect — ABHA Longitudinal Health Record', 22, 28);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Ayushman Bharat Digital Mission (ABDM) • Tamil Nadu Public Health Registry', 22, 35);
  doc.text('OFFICIAL CLINICAL ENCOUNTER SUMMARY', 22, 43);

  // Patient Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 62, 180, 32, 3, 3, 'F');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text('PATIENT NAME', 22, 70);
  doc.text('ABHA NUMBER', 75, 70);
  doc.text('AGE / GENDER', 130, 70);
  doc.text('DISTRICT / SECTOR', 130, 84);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(patientName, 22, 78);
  doc.text(abhaId, 75, 78);
  doc.text('32 Yrs / Female', 130, 78);

  doc.setTextColor(13, 148, 136);
  doc.text('Kanyakumari, Kottaram', 22, 88);

  // Vitals Snapshot
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 98, 180, 28, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('BLOOD PRESSURE', 22, 106);
  doc.text('PULSE RATE', 65, 106);
  doc.text('WEIGHT', 105, 106);
  doc.text('HEMOGLOBIN (Hb)', 145, 106);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('118/76 mmHg', 22, 116);
  doc.text('74 bpm', 65, 116);
  doc.text('58.2 kg', 105, 116);
  doc.text('11.4 g/dL', 145, 116);

  // Clinical Encounters Section
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Encounter Timeline & Diagnostic Records', 15, 136);

  let y = 144;
  const encounters = [
    {
      date: '21 Sept 2026',
      title: 'OPD Visit: 28-Week Maternal Care Checkup & Vitals',
      facility: 'Kanyakumari Government PHC (Dr. Meena R.)',
      notes: 'Fundal height consistent with dates. Fetal heart sounds normal (142 bpm). IFA & Calcium continued.',
    },
    {
      date: '19 Sept 2026',
      title: 'Referral: Hairline Radius Fracture Orthopedic Review',
      facility: 'Agastheeswaram Rural Hospital (Dr. Siva K.)',
      notes: 'Right forearm immobilization splint applied. Pain subsided. Escalation pathway established.',
    },
    {
      date: '15 Sept 2026',
      title: 'AI Triage Protocol Evaluation: Joint Strain',
      facility: 'ArogyaConnect Triage Engine v2.4',
      notes: 'Severity graded as Mild. Advised conservative management and PHC visit within 48 hours.',
    },
    {
      date: '10 Sept 2026',
      title: 'Laboratory Investigation: Complete Hemogram & Glucose',
      facility: 'PHC Diagnostic Laboratory',
      notes: 'Hb: 11.4 g/dL, Platelets: 2.35 Lakhs/uL, Fasting Blood Glucose: 86 mg/dL. Normal values.',
    },
  ];

  encounters.forEach((enc) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 22, 2, 2, 'FD');

    doc.setTextColor(13, 148, 136);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(enc.date, 20, y + 6);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.text(enc.title, 48, y + 6);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(enc.facility, 20, y + 12);
    doc.text(enc.notes, 20, y + 18);

    y += 26;
  });

  // Footer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.text('This document is electronically verified under Ayushman Bharat Digital Mission (ABDM) standards.', 15, 275);
  doc.text(`Downloaded by patient on: ${new Date().toLocaleString()}`, 15, 280);

  doc.save(`ArogyaConnect_Health_Records_${patientName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadReferralCaseSlipPDF(referralId: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(15, 15, 180, 40, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('GOVERNMENT OF TAMIL NADU - DEPARTMENT OF PUBLIC HEALTH', 20, 26);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('ArogyaConnect Longitudinal Clinical Referral Slip • Kanyakumari District', 20, 34);
  doc.text(`REFERRAL TRACKING ID: ${referralId}`, 20, 42);

  // Referral Details
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 60, 180, 45, 3, 3, 'F');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.text('PATIENT NAME: Devi S. (Age: 32y, Female)', 22, 68);
  doc.text('ABHA ID: 91-4458-1209', 22, 75);
  doc.text('ORIGIN FACILITY: Kottaram Health Sub-Centre / Kanyakumari PHC', 22, 82);
  doc.text('CURRENT LOCATION: Agastheeswaram Rural Hospital', 22, 89);
  doc.text('ESCALATION TARGET: Kanyakumari Govt Medical College Hospital, Asaripallam', 22, 96);

  // Diagnosis Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(15, 110, 180, 30, 3, 3, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CLINICAL INDICATION & DIAGNOSIS:', 22, 118);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Right distal radius hairline fracture review & orthopedic casting check.', 22, 125);
  doc.text('Patient requires secondary tier radiographic confirmation and orthopedic surgeon review.', 22, 131);

  // Longitudinal Steps
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Multi-Tier Longitudinal Clinical Pathway', 15, 150);

  let y = 158;
  const tiers = [
    {
      tier: 'Tier 1: Health Sub-Centre (Kottaram)',
      date: '17 Sept 2026',
      notes: 'Initial trauma assessment by VHN Sister Anitha. Ice pack & sling applied. Referred to PHC.',
    },
    {
      tier: 'Tier 2: Primary Health Centre / Rural Hospital (Agastheeswaram)',
      date: '19 Sept 2026',
      notes: 'X-ray performed. Splinting completed by Dr. Siva K. Referred for specialized casting at District Medical College.',
    },
    {
      tier: 'Tier 3: Tertiary District Medical College (Asaripallam)',
      date: '21 Sept 2026 (Active Queue)',
      notes: 'Department of Orthopedics consultation booked. Specialist token pre-allocated.',
    },
  ];

  tiers.forEach((t) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, y, 180, 22, 2, 2, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(t.tier, 20, y + 6);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(t.date, 135, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(t.notes, 20, y + 14);

    y += 26;
  });

  // Sign-off
  doc.setDrawColor(203, 213, 225);
  doc.line(15, 245, 195, 245);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Authorized Referring Officer: Dr. Meena R., MBBS (TMC Reg #74892)', 20, 255);
  doc.text('District Referral Officer: Dr. K. Ramanathan, MD (Joint Director of Health Services)', 20, 262);
  doc.text(`Slip Generated: ${new Date().toLocaleString()}`, 20, 269);

  doc.save(`ArogyaConnect_Referral_Slip_${referralId}.pdf`);
}
