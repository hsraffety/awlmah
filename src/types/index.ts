export enum LeadStatus {
  PENDING = "Pending",
  REACHED_OUT = "Reached Out",
  COMPLETED = "Completed",
}

export type VisaCategory = "O-1" | "EB-1A" | "EB-2 NIW" | "I don't know";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedIn: string;
  country: string;
  visaCategories: VisaCategory[];
  additionalInfo: string;
  resumeUrl?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  linkedIn: string;
  visaCategories: VisaCategory[];
  additionalInfo: string;
  resume?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
