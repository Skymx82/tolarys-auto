import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormState {
  formData: {
    nomAutoEcole: string;
    siret: string;
    adresse: string;
    ville: string;
    codePostal: string;
    nomResponsable: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
  };
  setFormData: (data: any) => void;
  resetFormData: () => void;
}

const initialState = {
  nomAutoEcole: '',
  siret: '',
  adresse: '',
  ville: '',
  codePostal: '',
  nomResponsable: '',
  email: '',
  telephone: '',
  password: '',
  confirmPassword: '',
};

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      formData: initialState,
      setFormData: (data) => set({ formData: data }),
      resetFormData: () => set({ formData: initialState }),
    }),
    {
      name: 'inscription-storage',
    }
  )
);
