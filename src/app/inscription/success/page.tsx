'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Credentials {
  email: string;
  password: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      completeRegistration(sessionId);
    }
  }, [searchParams]);

  const completeRegistration = async (sessionId: string) => {
    try {
      const response = await fetch('/api/inscription/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setCredentials({
        email: data.email,
        password: data.password
      });
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la finalisation de votre inscription. Veuillez contacter le support.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center text-red-600">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Finalisation de votre inscription...
              </h3>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63] mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription réussie !
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Voici vos identifiants de connexion</h3>
              <p className="mt-1 text-sm text-gray-500">
                Conservez-les précieusement, vous en aurez besoin pour vous connecter.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {credentials.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                {credentials.password}
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Link
                href="/connexion"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E91E63] hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63]"
              >
                Se connecter
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Email: ${credentials.email}\nMot de passe: ${credentials.password}`);
                  alert('Identifiants copiés dans le presse-papier !');
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63]"
              >
                Copier les identifiants
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Chargement...</h2>
            <p className="mt-2 text-gray-600">Veuillez patienter pendant que nous finalisons votre inscription.</p>
          </div>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
