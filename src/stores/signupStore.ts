import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SignupData {
  // Step 1: Credentials
  email: string;
  password: string;
  
  // Step 2: Email Verification (OTP code stored temporarily)
  emailVerified: boolean;
  
  // Step 3: Personal Data
  firstName: string;
  lastName: string;
  phone: string;
  
  // Step 4: Organization Data
  companyName: string;
  documentNumber: string;
  companySize: string;
  industry: string;
  
  // Step 5: Plan Selection
  selectedPlan: string;
  billingPeriod: 'monthly' | 'yearly';
  
  // Step 6: Payment (not stored, processed directly)
}

interface SignupStore {
  currentStep: number;
  data: Partial<SignupData>;
  setStep: (step: number) => void;
  updateData: (data: Partial<SignupData>) => void;
  reset: () => void;
  canAccessStep: (step: number) => boolean;
}

const initialData: Partial<SignupData> = {
  email: '',
  password: '',
  emailVerified: false,
  firstName: '',
  lastName: '',
  phone: '',
  companyName: '',
  documentNumber: '',
  companySize: '',
  industry: '',
  selectedPlan: 'pro',
  billingPeriod: 'monthly',
};

export const useSignupStore = create<SignupStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      
      setStep: (step) => set({ currentStep: step }),
      
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData }
      })),
      
      reset: () => set({ currentStep: 1, data: initialData }),
      
      canAccessStep: (step) => {
        const { data, currentStep } = get();
        
        // Can always go back
        if (step < currentStep) return true;
        
        // Can only advance one step at a time
        if (step > currentStep + 1) return false;
        
        // Validate previous steps
        switch (step) {
          case 1:
            return true;
          case 2:
            return !!(data.email && data.password);
          case 3:
            return !!(data.email && data.password && data.emailVerified);
          case 4:
            return !!(data.firstName && data.lastName && data.phone);
          case 5:
            return !!(data.companyName && data.documentNumber);
          case 6:
            return !!(data.selectedPlan);
          default:
            return false;
        }
      },
    }),
    {
      name: 'signup-storage',
      partialize: (state) => ({ 
        currentStep: state.currentStep, 
        data: state.data 
      }),
    }
  )
);
