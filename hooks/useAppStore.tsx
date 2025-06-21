import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
    AppState, AppAction, User, HistoryEntry, AppContextType, 
    VinLookupData, GeminiKeyPinResponse, ApiKeyStatus, 
    UserProfileData, UserVerificationData, UserWalletData, UserSettingsData, 
    UserRole, LoginPayload, BackendVinLookupResponse
} from '../types';
import { DEFAULT_BALANCE, MOCK_LOOKUP_COST, KING_CODES_API_BASE_URL } from '../constants';
import { isApiKeyAvailable as isFrontendGeminiKeyAvailable } from '../services/geminiService'; // Renamed for clarity

const initialUserProfile: UserProfileData = {
  firstName: '', lastName: '', businessName: '', specialties: [], address: {},
};
const initialUserVerification: UserVerificationData = { status: 'unsubmitted', documents: [] };
const initialUserWallet: UserWalletData = { balance: DEFAULT_BALANCE, currency: 'USD' };
const initialUserNotificationSettings = {
  push: { enabled: true, vinResults: true, promotions: true, systemUpdates: true },
  email: { enabled: true, vinResults: true, promotions: true, systemUpdates: true },
};
const initialUserSettings: UserSettingsData = {
  notifications: initialUserNotificationSettings, language: 'en', timezone: 'UTC',
};

// Base for a new user or when hydrating from partial local storage
const createDefaultUserStructure = (email?: string, id?: string): Omit<User, 'isLoggedIn'> => ({
  id: id || email || '',
  email: email,
  phone: '',
  authMethod: 'email',
  profile: { ...initialUserProfile },
  verification: { ...initialUserVerification },
  wallet: { ...initialUserWallet },
  role: 'user' as UserRole,
  settings: { ...initialUserSettings },
  fcmToken: '',
  lastLogin: new Date().toISOString(),
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  token: undefined,
});


const initialState: AppState = {
  user: null,
  history: [],
  apiKeyStatus: ApiKeyStatus.UNCHECKED, // For frontend's Gemini key
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      const loginPayload = action.payload;
      const loggedInUser: User = {
        ...createDefaultUserStructure(loginPayload.email, loginPayload.id),
        isLoggedIn: true,
        id: loginPayload.id,
        email: loginPayload.email,
        token: loginPayload.token,
        role: loginPayload.role,
        wallet: { 
            ...initialUserWallet, // Start with default currency
            balance: loginPayload.balance ?? DEFAULT_BALANCE, // Use balance from payload or default
        },
        // Potentially merge other fields from payload if backend sends more on login
        // e.g., profile: { ...initialUserProfile, ...loginPayload.profile }
        lastLogin: new Date().toISOString(),
      };
      return { ...state, user: loggedInUser };
    case 'LOGOUT':
      return {
        ...state,
        user: null, // Token is cleared by removing user object
      };
    case 'SET_BALANCE':
      if (!state.user) return state;
      return {
        ...state,
        user: { 
            ...state.user, 
            wallet: { ...state.user.wallet, balance: action.payload }
        },
      };
    case 'ADD_HISTORY':
      return {
        ...state,
        history: [action.payload, ...state.history.slice(0, 49)], // Keep last 50
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'SET_API_KEY_STATUS':
      return { ...state, apiKeyStatus: action.payload };
    case 'UPDATE_USER_PROFILE':
        if (!state.user) return state;
        return {
            ...state,
            user: {
                ...state.user,
                profile: { ...state.user.profile, ...action.payload },
                updatedAt: new Date().toISOString(),
            }
        }
    case 'UPDATE_USER_SETTINGS':
        if (!state.user) return state;
        return {
            ...state,
            user: {
                ...state.user,
                settings: { ...state.user.settings, ...action.payload },
                updatedAt: new Date().toISOString(),
            }
        }
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const storedUser = localStorage.getItem('kingCodesUser');
      const storedHistory = localStorage.getItem('kingCodesHistory');
      
      let userState = null;
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as Partial<User>;
        // Create a fully formed user object, merging stored with defaults
        // Ensure all nested objects are present
        userState = {
          ...createDefaultUserStructure(parsedUser.email, parsedUser.id),
          isLoggedIn: parsedUser.isLoggedIn !== undefined ? parsedUser.isLoggedIn : false, // If no token, not truly logged in
          token: parsedUser.token,
          // Carefully merge nested objects from storage
          profile: { ...initialUserProfile, ...parsedUser.profile },
          verification: { ...initialUserVerification, ...parsedUser.verification },
          wallet: { 
            ...initialUserWallet, 
            ...parsedUser.wallet,
            balance: Number(parsedUser.wallet?.balance ?? DEFAULT_BALANCE)
          },
          settings: { ...initialUserSettings, ...parsedUser.settings },
          role: parsedUser.role || 'user',
          isActive: parsedUser.isActive !== undefined ? parsedUser.isActive : true,
          lastLogin: parsedUser.lastLogin || new Date().toISOString(),
          createdAt: parsedUser.createdAt || new Date().toISOString(),
          updatedAt: parsedUser.updatedAt || new Date().toISOString(),
        };
        // If there's a token, consider them logged in. Otherwise, they should re-login.
        if (!userState.token) {
            userState.isLoggedIn = false;
        }
      }

      return {
        ...initial,
        user: userState,
        history: storedHistory ? JSON.parse(storedHistory) : [],
        apiKeyStatus: ApiKeyStatus.UNCHECKED, // Always recheck frontend Gemini API key on load
      };
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      localStorage.removeItem('kingCodesUser'); 
      localStorage.removeItem('kingCodesHistory');
      return initial;
    }
  });

  useEffect(() => {
    if (state.user && state.user.isLoggedIn && state.user.token) {
      localStorage.setItem('kingCodesUser', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('kingCodesUser'); // Clear if logged out or no token
    }
    localStorage.setItem('kingCodesHistory', JSON.stringify(state.history));
  }, [state.user, state.history]);


  useEffect(() => {
     // This checks the frontend Gemini key, not related to backend auth
     dispatch({ type: 'SET_API_KEY_STATUS', payload: isFrontendGeminiKeyAvailable() ? ApiKeyStatus.VALID : ApiKeyStatus.MISSING });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const addFunds = useCallback((amount: number) => {
    if (state.user) {
      // In a real app, this would be a backend call
      const newBalance = parseFloat((state.user.wallet.balance + amount).toFixed(2));
      dispatch({ type: 'SET_BALANCE', payload: newBalance });
    }
  }, [state.user]);

  const performVinLookup = useCallback(async (data: VinLookupData): Promise<GeminiKeyPinResponse> => {
    if (!state.user || !state.user.token) {
      return { 
        error: "User not authenticated. Please log in.",
        importantNotice: "Authentication is required for this feature."
      };
    }
    
    // Balance check can still happen on frontend for quick feedback,
    // but backend will enforce it.
    if (state.user.wallet.balance < MOCK_LOOKUP_COST) { // MOCK_LOOKUP_COST is fine for frontend check
        return { 
            error: "Insufficient balance for VIN lookup.",
            importantNotice: `A mock cost of $${MOCK_LOOKUP_COST.toFixed(2)} is applied per lookup.`
        };
    }

    try {
      const response = await fetch(`${KING_CODES_API_BASE_URL}/vin/lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.user.token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as BackendVinLookupResponse;

      if (!response.ok || !result.success) {
        return {
          error: result.error || `Server responded with ${response.status}`,
          importantNotice: "Failed to fetch illustrative information from the King Codes service."
        };
      }
      
      // Backend handles balance deduction and returns new balance
      if (result.newBalance !== undefined) {
        dispatch({ type: 'SET_BALANCE', payload: result.newBalance });
      }

      const historyEntry: HistoryEntry = {
        lookupData: data,
        id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
        timestamp: new Date().toLocaleString(),
        apiResponse: result.data || { error: "No illustrative data received.", importantNotice: "Backend response was missing data." },
        costDeducted: MOCK_LOOKUP_COST, // Assuming backend cost matches frontend mock for history
      };
      dispatch({ type: 'ADD_HISTORY', payload: historyEntry });

      return result.data || { error: "No illustrative data in successful response.", importantNotice: "Backend response was successful but missing data." };

    } catch (err) {
      console.error("Error calling backend VIN lookup API:", err);
      let errorMessage = "Network error or failed to connect to King Codes service.";
      if (err instanceof Error) {
        errorMessage += ` Details: ${err.message}`;
      }
      return {
        error: errorMessage,
        importantNotice: "An error occurred while trying to generate illustrative information via backend."
      };
    }
  }, [state.user]);


  // Expose dispatch for login/logout actions from pages
  return (
    <AppContext.Provider value={{ ...state, dispatch, addFunds, performVinLookup }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};