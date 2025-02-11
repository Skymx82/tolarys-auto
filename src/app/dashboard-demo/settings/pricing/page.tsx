'use client';

import { useState } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CurrencyEuroIcon,
  CheckIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface PriceOption {
  id: string;
  name: string;
  type: 'code' | 'driving' | 'package';
  basePrice: number;
  discountedPrice?: number;
  duration?: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  conditions?: string[];
  paymentOptions: {
    installments: boolean;
    maxInstallments?: number;
    depositRequired?: boolean;
    depositAmount?: number;
  };
}

const initialPriceOptions: PriceOption[] = [
  {
    id: '1',
    name: 'Code de la route - Accès illimité',
    type: 'code',
    basePrice: 300,
    description: 'Accès illimité aux cours de code en ligne et en salle',
    features: [
      'Accès illimité à la plateforme en ligne',
      'Cours en salle avec moniteur',
      'Tests blancs illimités',
      'Support pédagogique complet'
    ],
    paymentOptions: {
      installments: true,
      maxInstallments: 3,
      depositRequired: true,
      depositAmount: 100
    }
  },
  {
    id: '2',
    name: 'Pack 20h - Permis B',
    type: 'package',
    basePrice: 1500,
    discountedPrice: 1400,
    duration: 20,
    description: 'Formation complète au permis B avec 20h de conduite',
    features: [
      '20 heures de conduite',
      'Accompagnement à l\'examen',
      'Livret d\'apprentissage',
      'Évaluation continue'
    ],
    isPopular: true,
    conditions: [
      'Code de la route validé requis',
      'Validité 1 an'
    ],
    paymentOptions: {
      installments: true,
      maxInstallments: 6,
      depositRequired: true,
      depositAmount: 300
    }
  }
];

export default function PricingSettingsPage() {
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>(initialPriceOptions);
  const [selectedOption, setSelectedOption] = useState<PriceOption | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddOption = () => {
    setIsEditing(true);
    setSelectedOption(null);
  };

  const handleEditOption = (option: PriceOption) => {
    setSelectedOption(option);
    setIsEditing(true);
  };

  const handleSaveOption = (optionData: PriceOption) => {
    if (selectedOption) {
      setPriceOptions(options => options.map(o => o.id === selectedOption.id ? optionData : o));
    } else {
      setPriceOptions(options => [...options, { ...optionData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setSelectedOption(null);
  };

  const handleDeleteOption = (optionId: string) => {
    setPriceOptions(options => options.filter(o => o.id !== optionId));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tarifs et forfaits</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos offres, tarifs et conditions de paiement
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddOption}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter une offre
        </button>
      </div>

      {/* Liste des offres */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {priceOptions.map((option) => (
          <div
            key={option.id}
            className={`relative bg-white rounded-lg shadow-sm p-6 ${
              option.isPopular ? 'ring-2 ring-primary' : ''
            }`}
          >
            {option.isPopular && (
              <div className="absolute top-0 right-0 -translate-y-1/2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-white">
                  Populaire
                </span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{option.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{option.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditOption(option)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteOption(option.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  {option.discountedPrice ? (
                    <>
                      {option.discountedPrice}€
                      <span className="ml-2 text-sm line-through text-gray-500">
                        {option.basePrice}€
                      </span>
                    </>
                  ) : (
                    `${option.basePrice}€`
                  )}
                </span>
                {option.type === 'driving' && (
                  <span className="ml-1 text-sm text-gray-500">/heure</span>
                )}
              </div>
            </div>

            {/* Caractéristiques */}
            <ul className="mt-6 space-y-4">
              {option.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="ml-3 text-sm text-gray-500">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Options de paiement */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Options de paiement</h4>
              <ul className="mt-2 space-y-2">
                {option.paymentOptions.installments && (
                  <li className="text-sm text-gray-500">
                    Paiement en {option.paymentOptions.maxInstallments} fois
                  </li>
                )}
                {option.paymentOptions.depositRequired && (
                  <li className="text-sm text-gray-500">
                    Acompte de {option.paymentOptions.depositAmount}€
                  </li>
                )}
              </ul>
            </div>

            {/* Conditions */}
            {option.conditions && option.conditions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Conditions</h4>
                <ul className="mt-2 space-y-2">
                  {option.conditions.map((condition, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      • {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal d'édition (à implémenter) */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          {/* Formulaire d'édition complet à implémenter */}
        </div>
      )}
    </div>
  );
}
