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
