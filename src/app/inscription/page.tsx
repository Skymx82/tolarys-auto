'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';
import Link from 'next/link';
import { useFormStore } from '../store';

export default function InscriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { formData, setFormData } = useFormStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      
      try {
        const response = await fetch('/api/inscription/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Une erreur est survenue');
        }

        setStep(3);
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {step === 3 ? (
          <PaymentForm email={formData.email} />
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="nomAutoEcole" className="block text-sm font-medium text-gray-700">
                      Nom de l'auto-école
                    </label>
                    <div className="mt-1">
                      <input
                        id="nomAutoEcole"
                        name="nomAutoEcole"
                        type="text"
                        required
                        value={formData.nomAutoEcole}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
                      SIRET
                    </label>
                    <div className="mt-1">
                      <input
                        id="siret"
                        name="siret"
                        type="text"
                        required
                        value={formData.siret}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                      Adresse
                    </label>
                    <div className="mt-1">
                      <input
                        id="adresse"
                        name="adresse"
                        type="text"
                        required
                        value={formData.adresse}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                        Ville
                      </label>
                      <div className="mt-1">
                        <input
                          id="ville"
                          name="ville"
                          type="text"
                          required
                          value={formData.ville}
                          onChange={handleInputChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <div className="mt-1">
                        <input
                          id="codePostal"
                          name="codePostal"
                          type="text"
                          required
                          value={formData.codePostal}
                          onChange={handleInputChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label htmlFor="nomResponsable" className="block text-sm font-medium text-gray-700">
                      Nom du responsable
                    </label>
                    <div className="mt-1">
                      <input
                        id="nomResponsable"
                        name="nomResponsable"
                        type="text"
                        required
                        value={formData.nomResponsable}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                      Téléphone
                    </label>
                    <div className="mt-1">
                      <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] sm:text-sm"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between space-x-4">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63]"
                >
                  {step === 1 ? 'Retour à l\'accueil' : 'Précédent'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E91E63] hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63]"
                >
                  {step === 2 ? 'Procéder au paiement' : 'Suivant'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
