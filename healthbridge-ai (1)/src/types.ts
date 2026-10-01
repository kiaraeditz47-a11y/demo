export type Language = 'en' | 'ta' | 'hi';
export type UserRole = 'patient' | 'health_worker';

export type ServiceId = 
  | 'find_healthcare'
  | 'appointments'
  | 'ai_triage'
  | 'teleconsultation'
  | 'referrals'
  | 'medicines_diagnostics'
  | 'patient_records'
  | 'high_risk_followup';

export interface ServiceCardDef {
  id: ServiceId;
  title: string;
  titleTa: string;
  titleHi?: string;
  description: string;
  descriptionTa: string;
  descriptionHi?: string;
  actionLabel: string;
  actionLabelTa: string;
  actionLabelHi?: string;
  iconType: 'map-pin' | 'calendar' | 'brain' | 'video' | 'git-fork' | 'pill' | 'clipboard' | 'alert-triangle';
  badge?: string;
  badgeType?: 'count' | 'ai' | 'live' | 'alert';
  glowTheme: 'sunset' | 'cobalt' | 'emerald' | 'purple' | 'cyan' | 'rose' | 'amber';
}

export interface Facility {
  id: string;
  name: string;
  type: 'Sub-Centre' | 'PHC' | 'Rural Hospital' | 'District Hospital';
  distance: string;
  location: string;
  isOpen: boolean;
  hours: string;
  queueCount: number;
  services: string[];
  phone: string;
}

export interface Appointment {
  id: string;
  facility: string;
  department: string;
  doctor: string;
  date: string;
  time: string;
  token: string;
  currentServing: string;
  patientsAhead: number;
  estWait: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  facility: string;
  isAvailable: boolean;
  rating: number;
  experience: string;
}

export interface Referral {
  id: string;
  patientName: string;
  diagnosis: string;
  originFacility: string;
  currentFacility: string;
  targetFacility: string;
  step: 1 | 2 | 3; // 1: Origin, 2: Rural, 3: District
  date: string;
  status: 'Initiated' | 'In Progress' | 'Awaiting Consultation' | 'Completed';
  priority: 'Urgent' | 'Routine' | 'High-Risk';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  category: string;
  stockCount: number;
  isLowStock: boolean;
  location: string;
  isFreeGovt: boolean;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  category: string;
  turnaroundTime: string;
  isAvailable: boolean;
  sampleRequired: string;
}

export interface PatientRecord {
  id: string;
  date: string;
  type: 'OPD Visit' | 'Lab Result' | 'Prescription' | 'Triage Assessment' | 'Referral';
  facility: string;
  doctor: string;
  summary: string;
  details: string;
}

export interface HighRiskFollowUp {
  id: string;
  patientName: string;
  category: 'maternal' | 'child' | 'chronic';
  condition: string;
  scheduledDate: string;
  vhnWorker: string;
  status: 'overdue' | 'dueToday' | 'upcoming';
  phone: string;
  actionNotes: string;
}
