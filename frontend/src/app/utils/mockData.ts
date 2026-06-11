import type { Consultation } from "../types/consultation";
import type { Recording } from "../types/recording";
import type { PatientAppointment, PatientRecommendation } from "../types/patient";

export const MOCK_CONSULTATIONS: Consultation[] = [
  { id: "C-1048", patient: "Priya Mehta", consultant: "Dr. Arjun Rajan", date: "Jun 11, 2026", lastUpdated: "Jun 11, 10:52 AM", duration: "52 min", type: "Therapy", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Arjun Rajan" },
  { id: "C-1047", patient: "Rohit Verma", consultant: "Dr. Sunita Patel", date: "Jun 11, 2026", lastUpdated: "Jun 11, 9:14 AM", duration: "38 min", type: "Medical", status: "processing", aiStatus: "processing", recordingStatus: "uploaded", createdBy: "Dr. Sunita Patel" },
  { id: "C-1046", patient: "Anita Singh", consultant: "Dr. Karan Mehta", date: "Jun 10, 2026", lastUpdated: "Jun 10, 6:30 PM", duration: "65 min", type: "Astrology", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Karan Mehta" },
  { id: "C-1045", patient: "Suresh Kumar", consultant: "Dr. Arjun Rajan", date: "Jun 10, 2026", lastUpdated: "Jun 10, 4:45 PM", duration: "44 min", type: "Advisory", status: "pending", aiStatus: "pending", recordingStatus: "none", createdBy: "Dr. Arjun Rajan" },
  { id: "C-1044", patient: "Deepa Nair", consultant: "Dr. Riya Sharma", date: "Jun 9, 2026", lastUpdated: "Jun 9, 7:10 PM", duration: "58 min", type: "Therapy", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Riya Sharma" },
  { id: "C-1043", patient: "Vikram Bose", consultant: "Dr. Arjun Rajan", date: "Jun 9, 2026", lastUpdated: "Jun 9, 3:22 PM", duration: "30 min", type: "Medical", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Arjun Rajan" },
  { id: "C-1042", patient: "Kavya Reddy", consultant: "Dr. Sunita Patel", date: "Jun 8, 2026", lastUpdated: "Jun 8, 8:00 PM", duration: "72 min", type: "Therapy", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Sunita Patel" },
  { id: "C-1041", patient: "Manish Gupta", consultant: "Dr. Karan Mehta", date: "Jun 8, 2026", lastUpdated: "Jun 8, 5:45 PM", duration: "45 min", type: "Advisory", status: "processing", aiStatus: "processing", recordingStatus: "uploaded", createdBy: "Dr. Karan Mehta" },
  { id: "C-1040", patient: "Lakshmi Iyer", consultant: "Dr. Riya Sharma", date: "Jun 7, 2026", lastUpdated: "Jun 7, 6:05 PM", duration: "55 min", type: "Medical", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Riya Sharma" },
  { id: "C-1039", patient: "Amit Desai", consultant: "Dr. Arjun Rajan", date: "Jun 7, 2026", lastUpdated: "Jun 7, 4:30 PM", duration: "40 min", type: "Astrology", status: "pending", aiStatus: "pending", recordingStatus: "none", createdBy: "Dr. Arjun Rajan" },
  { id: "C-1038", patient: "Pooja Sharma", consultant: "Dr. Sunita Patel", date: "Jun 6, 2026", lastUpdated: "Jun 6, 5:50 PM", duration: "48 min", type: "Therapy", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Sunita Patel" },
  { id: "C-1037", patient: "Ravi Teja", consultant: "Dr. Karan Mehta", date: "Jun 6, 2026", lastUpdated: "Jun 6, 4:15 PM", duration: "35 min", type: "Medical", status: "completed", aiStatus: "ready", recordingStatus: "uploaded", createdBy: "Dr. Karan Mehta" },
];

export const MOCK_RECORDINGS: Recording[] = [
  { id: "R-001", name: "Therapy Session — Jun 11, 2026", patient: "Priya Mehta", consultant: "Dr. Arjun Rajan", date: "Jun 11, 2026", duration: "52 min", fileSize: "48.2 MB", fileType: "audio", status: "available", consultationId: "C-1048" },
  { id: "R-002", name: "Therapy Session — May 28, 2026", patient: "Priya Mehta", consultant: "Dr. Arjun Rajan", date: "May 28, 2026", duration: "44 min", fileSize: "41.1 MB", fileType: "audio", status: "available", consultationId: "C-1040" },
  { id: "R-003", name: "Medical Consultation — May 14, 2026", patient: "Priya Mehta", consultant: "Dr. Riya Sharma", date: "May 14, 2026", duration: "38 min", fileSize: "35.7 MB", fileType: "audio", status: "available", consultationId: "C-1035" },
  { id: "R-004", name: "Advisory Session — Apr 30, 2026", patient: "Priya Mehta", consultant: "Dr. Karan Mehta", date: "Apr 30, 2026", duration: "65 min", fileSize: "60.4 MB", fileType: "audio", status: "available", consultationId: "C-1025" },
];

export const MOCK_APPOINTMENTS: PatientAppointment[] = [
  { id: "A-001", consultant: "Dr. Arjun Rajan", date: "Jun 18, 2026", time: "10:30 AM", type: "Therapy", mode: "Video", status: "upcoming" },
  { id: "A-002", consultant: "Dr. Sunita Patel", date: "Jun 25, 2026", time: "2:00 PM", type: "Follow-up", mode: "In-Person", status: "upcoming" },
  { id: "A-003", consultant: "Dr. Arjun Rajan", date: "Jun 11, 2026", time: "10:30 AM", type: "Therapy", mode: "Video", status: "past" },
  { id: "A-004", consultant: "Dr. Riya Sharma", date: "May 28, 2026", time: "11:00 AM", type: "Medical", mode: "In-Person", status: "past" },
  { id: "A-005", consultant: "Dr. Karan Mehta", date: "May 14, 2026", time: "3:00 PM", type: "Advisory", mode: "Phone", status: "past" },
  { id: "A-006", consultant: "Dr. Arjun Rajan", date: "May 7, 2026", time: "10:30 AM", type: "Therapy", mode: "Video", status: "cancelled", cancelReason: "Patient rescheduled" },
];

export const MOCK_RECOMMENDATIONS: PatientRecommendation[] = [
  { id: "R-E1", category: "Exercises", description: "10-minute progressive muscle relaxation before bed", priority: "High", completed: false },
  { id: "R-E2", category: "Exercises", description: "Daily 5-minute breathing exercise at 4 PM", priority: "High", completed: false },
  { id: "R-E3", category: "Exercises", description: "Morning mindfulness — 10 minutes on waking", priority: "Medium", completed: true },
  { id: "R-L1", category: "Lifestyle", description: "No screens 60 minutes before sleep", priority: "High", completed: false },
  { id: "R-L2", category: "Lifestyle", description: "Sleep before 11 PM on weekdays", priority: "Medium", completed: false },
  { id: "R-L3", category: "Lifestyle", description: "Reduce caffeine intake after 2 PM", priority: "Low", completed: true },
  { id: "R-M1", category: "Medication", description: "Melatonin 0.5mg if unable to sleep by 11:30 PM (as needed)", priority: "Low", completed: false },
  { id: "R-M2", category: "Medication", description: "Continue prescribed supplements — Vitamin D3 daily", priority: "Medium", completed: true },
  { id: "R-T1", category: "Tasks", description: "Keep a sleep diary for 2 weeks", priority: "High", completed: false },
  { id: "R-T2", category: "Tasks", description: "Track 3 daily wins in a journal", priority: "Medium", completed: false },
  { id: "R-T3", category: "Tasks", description: "Prepare 3 talking points before each team meeting", priority: "High", completed: false },
  { id: "R-F1", category: "Follow-up", description: "Follow-up appointment — Jun 25, 2026", priority: "High", completed: false },
  { id: "R-F2", category: "Follow-up", description: "Blood pressure check at home on Jun 14", priority: "Medium", completed: false },
];
