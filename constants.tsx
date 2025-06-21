import { Home, History as HistoryIcon, Wallet, /* Cog, */ ShieldAlert, Car, UserCircle, Settings2 } from 'lucide-react'; // Cog removed as ADMIN_NAV_ITEM is removed
import type { NavItem } from './types';

export const APP_NAME = "King Codes";
export const DEFAULT_BALANCE = 100.00; // Initial balance for new user.wallet.balance (also used if localStorage is corrupted)
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17"; // For frontend direct Gemini calls if any

export const KING_CODES_API_BASE_URL = 'http://localhost:3001/api'; // Backend API URL

export const NAVIGATION_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/history', label: 'History', icon: HistoryIcon },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/profile', label: 'Profile', icon: UserCircle },
  { path: '/more', label: 'More', icon: Settings2 },
];

// export const ADMIN_NAV_ITEM: NavItem = { path: '/admin', label: 'Admin', icon: Cog }; // Removed

export const LogoIcon = Car;
export const ApiKeyMissingIcon = ShieldAlert;

export const MOCK_LOGIN_OPTIONS = [
  { id: 'google', name: 'Sign in with Google', icon: 'G' },
  { id: 'email', name: 'Sign in with Email', icon: '@' },
  // As per PDF, Phone/SMS is an option, can be added here if UI mock is desired
];

export const VIN_PLACEHOLDER = "Enter 17-digit VIN";
export const MAKE_PLACEHOLDER = "e.g., Ford";
export const MODEL_PLACEHOLDER = "e.g., F-150";
export const YEAR_PLACEHOLDER = "e.g., 2021";

export const API_KEY_CHECK_MESSAGE = "Checking Frontend Gemini API Key...";
export const API_KEY_MISSING_MESSAGE = "Frontend Gemini API Key is missing (process.env.API_KEY). Some AI features might be affected if used directly by frontend.";
export const API_KEY_VALID_MESSAGE = "Frontend Gemini API Key detected.";

export const FOOTER_TEXT = `© ${new Date().getFullYear()} King Codes. For illustrative purposes only.`;

export const MOCK_LOOKUP_COST = 5.00; // Used for frontend display and history logging