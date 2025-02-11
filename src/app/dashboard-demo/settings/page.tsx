'use client';

import { useState } from 'react';
import { 
  Cog6ToothIcon,
  UserIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  TruckIcon,
  DocumentTextIcon,
  BellIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const settingsSections = [
  {
    id: 'company',
    title: 'Informations de l\'auto-école',
    description: 'Gérez les informations de votre établissement',
    icon: BuildingOfficeIcon,
    href: '/dashboard/settings/company',
    fields: [
      { name: 'name', label: 'Nom de l\'auto-école', type: 'text', value: 'Auto-école Tolarys' },
      { name: 'address', label: 'Adresse', type: 'text', value: '123 rue de Paris' },
      { name: 'phone', label: 'Téléphone', type: 'tel', value: '01 23 45 67 89' },
      { name: 'email', label: 'Email', type: 'email', value: 'contact@tolarys.fr' },
      { name: 'siret', label: 'SIRET', type: 'text', value: '123 456 789 00001' },
      { name: 'agrementNumber', label: 'Numéro d\'agrément', type: 'text', value: 'E12 345' }
    ]
  },
  {
    id: 'pricing',
    title: 'Tarifs et forfaits',
    description: 'Configurez vos offres et tarifs',
    icon: CurrencyEuroIcon,
    href: '/dashboard/settings/pricing',
    fields: [
      { name: 'codePrice', label: 'Prix du code', type: 'number', value: '800' },
      { name: 'drivingPrice', label: 'Prix de l\'heure de conduite', type: 'number', value: '50' },
      { name: 'package20h', label: 'Forfait 20h', type: 'number', value: '1500' },
      { name: 'packageCode', label: 'Forfait code illimité', type: 'number', value: '300' }
    ]
  },
  {
    id: 'vehicles',
    title: 'Véhicules',
    description: 'Gérez votre flotte de véhicules',
    icon: TruckIcon,
    href: '/dashboard/settings/vehicles',
    fields: [
      { name: 'vehicle1', label: 'Véhicule 1', type: 'text', value: 'Peugeot 208 - AB-123-CD' },
      { name: 'vehicle2', label: 'Véhicule 2', type: 'text', value: 'Renault Clio - EF-456-GH' }
    ]
  },
  {
    id: 'documents',
    title: 'Documents et contrats',
    description: 'Personnalisez vos modèles de documents',
    icon: DocumentTextIcon,
    href: '/dashboard/settings/documents',
    fields: [
      { name: 'contractTemplate', label: 'Modèle de contrat', type: 'file', value: '' },
      { name: 'invoiceTemplate', label: 'Modèle de facture', type: 'file', value: '' }
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Paramètres des notifications et rappels',
    icon: BellIcon,
    href: '/dashboard/settings/notifications',
    fields: [
      { name: 'emailNotifications', label: 'Notifications par email', type: 'checkbox', value: true },
      { name: 'smsNotifications', label: 'Notifications par SMS', type: 'checkbox', value: true },
      { name: 'lessonReminder', label: 'Rappel avant leçon (heures)', type: 'number', value: '24' }
    ]
  },
  {
    id: 'security',
    title: 'Sécurité',
    description: 'Paramètres de sécurité et permissions',
    icon: ShieldCheckIcon,
    href: '/dashboard/settings/security',
    fields: [
      { name: 'twoFactor', label: 'Authentification à deux facteurs', type: 'checkbox', value: false },
      { name: 'sessionTimeout', label: 'Expiration de session (minutes)', type: 'number', value: '30' }
    ]
  }
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Paramètres
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les paramètres de votre auto-école
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Link
            key={section.id}
            href={section.href}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg shadow-sm hover:bg-gray-50"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary bg-opacity-10 text-primary ring-4 ring-white">
                <section.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                {section.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {section.description}
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
