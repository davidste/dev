import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export interface VinLookupData {
  vin: string;
  make?: string;
  model?: string;
  year?: string;
}

// This remains the structure of the *illustrative data* part of the response
export interface GeminiKeyPinResponse {
  vehicleDescription?: string;
  illustrativeKeyTypes?: string[];
  illustrativePinFormat?: string;
  importantNotice?: string;
  error?: string; // For errors specifically from the AI generation or data formatting
}

// Structure for the backend's VIN lookup response
export interface BackendVinLookupResponse {
  success: boolean;
  data?: GeminiKeyPinResponse; // The illustrative part
  error?: string; // For overall backend/API errors
  newBalance?: number;
}


// User related types based on PDF (p.20-21)
export type AuthMethod = "google" | "email" | "phone";
export type UserVerificationStatus = "unsubmitted" | "pending" | "verified" | "rejected" | "suspended";
export type UserRole = "user" | "admin";

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface UserProfileData {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string;
  yearsExperience?: number;
  serviceArea?: string;
  specialties?: string[];
  photoUrl?: string;
  phoneNumber?: string;
  address?: UserAddress;
}

export interface UserVerificationData {
  status: UserVerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  documents?: string[];
  notes?: string;
}

export interface UserWalletData {
  balance: number;
  currency: string;
}

export interface UserNotificationSettingsOptions {
  enabled: boolean;
  vinResults: boolean;
  promotions: boolean;
  systemUpdates: boolean;
}

export interface UserNotificationSettings {
  push: UserNotificationSettingsOptions;
  email: UserNotificationSettingsOptions;
}

export interface UserSettingsData {
  notifications: UserNotificationSettings;
  language: string;
  timezone: string;
}

export interface User {
  id: string;
  email?: string; 
  phone?: string;
  authMethod?: AuthMethod;
  profile: UserProfileData;
  verification: UserVerificationData;
  wallet: UserWalletData;
  role: UserRole;
  settings: UserSettingsData;
  fcmToken?: string;
  lastLogin?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  isLoggedIn: boolean; 
  token?: string; // Added to store JWT token
}

// History Entry
export interface HistoryEntry {
  id: string; 
  timestamp: string; 
  lookupData: VinLookupData; 
  apiResponse: GeminiKeyPinResponse; // This stores the core illustrative data
  costDeducted?: number; 
}


export interface AppState {
  user: User | null;
  history: HistoryEntry[];
  apiKeyStatus: ApiKeyStatus; // For frontend Gemini key status
}

export enum ApiKeyStatus {
  UNCHECKED = 'UNCHECKED',
  VALID = 'VALID',
  MISSING = 'MISSING',
  INVALID = 'INVALID'
}

// Payload for LOGIN now includes token and other user details from backend
export interface LoginPayload {
  email: string;
  id: string; // User ID from backend
  token: string;
  role: UserRole;
  // Potentially other user fields to initialize state if backend sends them on login
  balance?: number; 
}

export type AppAction =
  | { type: 'LOGIN'; payload: LoginPayload }
  | { type: 'LOGOUT' }
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'ADD_HISTORY'; payload: HistoryEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'SET_API_KEY_STATUS'; payload: ApiKeyStatus }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfileData> } 
  | { type: 'UPDATE_USER_SETTINGS'; payload: Partial<UserSettingsData> }; 

export interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  addFunds: (amount: number) => void;
  // performVinLookup now returns a promise that resolves to the GeminiKeyPinResponse part
  // or an error structure compatible with it for UI display.
  performVinLookup: (data: VinLookupData) => Promise<GeminiKeyPinResponse>;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}