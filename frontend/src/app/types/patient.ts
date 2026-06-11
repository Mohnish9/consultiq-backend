export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other" | "Prefer not to say";
  bloodGroup?: string;
  allergies?: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface PatientAppointment {
  id: string;
  consultant: string;
  date: string;
  time: string;
  type: string;
  mode: "Video" | "In-Person" | "Phone";
  status: "upcoming" | "past" | "cancelled";
  cancelReason?: string;
}

export interface PatientRecommendation {
  id: string;
  category: "Exercises" | "Lifestyle" | "Medication" | "Tasks" | "Follow-up";
  description: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}
