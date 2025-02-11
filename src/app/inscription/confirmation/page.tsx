'use client';

import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inscription confirmée !
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Merci d'avoir choisi Tolarys. Vous allez recevoir un email avec vos identifiants de connexion.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Prochaines étapes</h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Vérifiez votre boîte mail pour récupérer vos identifiants
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Connectez-vous à votre espace avec vos identifiants
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    Commencez à gérer votre auto-école avec Tolarys
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <Link
                href="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E91E63] hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63]"
              >
                Retourner à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
