// Database types for the Gym Admin Dashboard

export interface User {
  id: string;
  name: string;
  phone: string;
  token_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: '1_month' | '3_months' | '6_months' | '12_months';
  start_date: string;
  end_date: string;
  status: 'active' | 'expired';
  created_at: string;
  // Joined fields
  users?: User;
}

export interface Attendance {
  id: string;
  user_id: string;
  token_id: string;
  check_in_time: string;
  // Joined fields
  users?: User;
}

export type CrowdLevel = 'Low' | 'Medium' | 'High';

export interface DashboardStats {
  totalMembers: number;
  activeToday: number;
  crowdCount: number;
  crowdLevel: CrowdLevel;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  userName?: string;
  checkInTime?: string;
  alreadyCheckedIn?: boolean;
  subscriptionExpired?: boolean;
}
