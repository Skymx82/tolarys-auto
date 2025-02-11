'use client';

import { useState } from 'react';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  IdentificationIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface CompanyInfo {
  basic: {
    name: string;
    siret: string;
    agrementNumber: string;
    vatNumber: string;
  };
  contact: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    website: string;
  };
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  additional: {
    description: string;
    zones: string[];
    insuranceCompany: string;
    insurancePolicy: string;
    bankName: string;
    iban: string;
  };
}

const initialCompanyInfo: CompanyInfo = {
  basic: {
    name: 'Auto-école Tolarys',
    siret: '123 456 789 00001',
    agrementNumber: 'E12 345',
    vatNumber: 'FR 12 345678900'
  },
  contact: {
    address: '123 rue de Paris',
    city: 'Paris',
    postalCode: '75001',
    phone: '01 23 45 67 89',
    email: 'contact@tolarys.fr',
    website: 'www.tolarys.fr'
  },
  schedule: {
    monday: '09:00-19:00',
    tuesday: '09:00-19:00',
    wednesday: '09:00-19:00',
    thursday: '09:00-19:00',
    friday: '09:00-19:00',
    saturday: '09:00-17:00',
    sunday: 'Fermé'
  },
  additional: {
    description: 'Auto-école professionnelle proposant des formations au permis B',
    zones: ['Paris', 'Boulogne-Billancourt', 'Neuilly-sur-Seine'],
    insuranceCompany: 'AXA Assurances',
    insurancePolicy: 'POL-123456789',
    bankName: 'BNP Paribas',
    iban: 'FR76 1234 5678 9012 3456 7890 123'
  }
};

export default function CompanySettingsPage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'schedule' | 'additional'>('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState<CompanyInfo>(companyInfo);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Ici, vous implémenteriez la logique de sauvegarde vers votre backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation d'une requête API
      setCompanyInfo(editedInfo);
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleInputChange = (section: keyof CompanyInfo, field: string, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Informations de l'auto-école</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les informations principales de votre établissement
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
            >
              Modifier
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedInfo(companyInfo);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Enregistrement...' :
                 saveStatus === 'success' ? 'Enregistré !' :
                 saveStatus === 'error' ? 'Erreur' : 'Enregistrer'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {[
            { id: 'basic', name: 'Informations de base', icon: BuildingOfficeIcon },
            { id: 'contact', name: 'Contact', icon: PhoneIcon },
            { id: 'schedule', name: 'Horaires', icon: ClockIcon },
            { id: 'additional', name: 'Informations complémentaires', icon: IdentificationIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              <tab.icon className={`
                -ml-0.5 mr-2 h-5 w-5
                ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'auto-école
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.basic.name : companyInfo.basic.name}
                  onChange={(e) => handleInputChange('basic', 'name', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SIRET
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.basic.siret : companyInfo.basic.siret}
                  onChange={(e) => handleInputChange('basic', 'siret', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro d'agrément
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.basic.agrementNumber : companyInfo.basic.agrementNumber}
                  onChange={(e) => handleInputChange('basic', 'agrementNumber', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro de TVA
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.basic.vatNumber : companyInfo.basic.vatNumber}
                  onChange={(e) => handleInputChange('basic', 'vatNumber', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.contact.address : companyInfo.contact.address}
                  onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedInfo.contact.city : companyInfo.contact.city}
                    onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editedInfo.contact.postalCode : companyInfo.contact.postalCode}
                    onChange={(e) => handleInputChange('contact', 'postalCode', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={isEditing ? editedInfo.contact.phone : companyInfo.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={isEditing ? editedInfo.contact.email : companyInfo.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Site web
                </label>
                <input
                  type="url"
                  value={isEditing ? editedInfo.contact.website : companyInfo.contact.website}
                  onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {Object.entries(companyInfo.schedule).map(([day, hours]) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {day}
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.schedule[day as keyof typeof editedInfo.schedule] : hours}
                  onChange={(e) => handleInputChange('schedule', day, e.target.value)}
                  disabled={!isEditing}
                  className="col-span-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="09:00-19:00"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'additional' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={isEditing ? editedInfo.additional.description : companyInfo.additional.description}
                  onChange={(e) => handleInputChange('additional', 'description', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zones couvertes
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.additional.zones.join(', ') : companyInfo.additional.zones.join(', ')}
                  onChange={(e) => handleInputChange('additional', 'zones', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Paris, Boulogne-Billancourt, ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Compagnie d'assurance
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.additional.insuranceCompany : companyInfo.additional.insuranceCompany}
                  onChange={(e) => handleInputChange('additional', 'insuranceCompany', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro de police d'assurance
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.additional.insurancePolicy : companyInfo.additional.insurancePolicy}
                  onChange={(e) => handleInputChange('additional', 'insurancePolicy', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banque
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.additional.bankName : companyInfo.additional.bankName}
                  onChange={(e) => handleInputChange('additional', 'bankName', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  IBAN
                </label>
                <input
                  type="text"
                  value={isEditing ? editedInfo.additional.iban : companyInfo.additional.iban}
                  onChange={(e) => handleInputChange('additional', 'iban', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
