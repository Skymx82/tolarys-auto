'use client';

import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface CompanyData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  siret: string;
  logo?: string;
}

export default function CompanyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Fonction pour charger les données de l'entreprise
  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      // TODO: Appel API pour récupérer les données de l'entreprise
      // const response = await fetch('/api/company');
      // const data = await response.json();
      // setCompanyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour les données de l'entreprise
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Appel API pour mettre à jour les données
      // const formData = new FormData(e.currentTarget);
      // await fetch('/api/company', {
      //   method: 'PUT',
      //   body: formData,
      // });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer le changement de logo
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Informations de l'entreprise</h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="mt-2 flex items-center gap-x-3">
              {logoFile || companyData?.logo ? (
                <img
                  src={logoFile ? URL.createObjectURL(logoFile) : companyData?.logo}
                  alt="Logo de l'entreprise"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              />
            </div>
          </div>

          {/* Nom de l'entreprise */}
          <div>
            <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="name"
              id="company-name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Adresse */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              id="address"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Ville */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Code postal */}
          <div>
            <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              type="text"
              name="postalCode"
              id="postal-code"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Pays */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Pays
            </label>
            <input
              type="text"
              name="country"
              id="country"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* SIRET */}
          <div>
            <label htmlFor="siret" className="block text-sm font-medium text-gray-700">
              SIRET
            </label>
            <input
              type="text"
              name="siret"
              id="siret"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm"
            />
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-[#E91E63] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-[#E91E63] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
