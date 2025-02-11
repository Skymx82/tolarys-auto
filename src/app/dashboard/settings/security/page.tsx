'use client';

import { useState } from 'react';
import { 
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  LockClosedIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  status: 'active' | 'inactive';
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: [
      { id: '1', name: 'students_manage', description: 'Gérer les élèves', module: 'Élèves' },
      { id: '2', name: 'instructors_manage', description: 'Gérer les moniteurs', module: 'Moniteurs' },
      { id: '3', name: 'planning_manage', description: 'Gérer le planning', module: 'Planning' },
      { id: '4', name: 'payments_manage', description: 'Gérer les paiements', module: 'Paiements' },
      { id: '5', name: 'settings_manage', description: 'Gérer les paramètres', module: 'Paramètres' }
    ]
  },
  {
    id: '2',
    name: 'Moniteur',
    description: 'Accès au planning et aux élèves',
    permissions: [
      { id: '1', name: 'students_view', description: 'Voir les élèves', module: 'Élèves' },
      { id: '3', name: 'planning_view', description: 'Voir le planning', module: 'Planning' }
    ]
  },
  {
    id: '3',
    name: 'Secrétaire',
    description: 'Gestion administrative',
    permissions: [
      { id: '1', name: 'students_manage', description: 'Gérer les élèves', module: 'Élèves' },
      { id: '3', name: 'planning_manage', description: 'Gérer le planning', module: 'Planning' },
      { id: '4', name: 'payments_manage', description: 'Gérer les paiements', module: 'Paiements' }
    ]
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@tolarys.fr',
    role: 'Administrateur',
    lastLogin: '2025-02-11T09:30:00',
    twoFactorEnabled: true,
    status: 'active'
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@tolarys.fr',
    role: 'Moniteur',
    lastLogin: '2025-02-11T08:15:00',
    twoFactorEnabled: false,
    status: 'active'
  }
];

export default function SecuritySettingsPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'security'>('users');

  const handleUserStatusToggle = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleTwoFactorToggle = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, twoFactorEnabled: !user.twoFactorEnabled }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres de sécurité</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les accès, les rôles et la sécurité de votre application
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'roles'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Rôles et permissions
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'security'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Sécurité générale
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'users' && (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full ${
                      user.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                    } flex items-center justify-center`}>
                      <UserGroupIcon className={`h-6 w-6 ${
                        user.status === 'active' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm text-gray-500">{user.email}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{user.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">2FA</span>
                      <button
                        onClick={() => handleTwoFactorToggle(user.id)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                          user.twoFactorEnabled ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Activer 2FA</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            user.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm text-gray-500">Statut</span>
                      <button
                        onClick={() => handleUserStatusToggle(user.id)}
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                          user.status === 'active' ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Activer l'utilisateur</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                            user.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Dernière connexion : {new Date(user.lastLogin).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {roles.map((role) => (
            <div key={role.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRoleModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Modifier
                </button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Permissions :</h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {role.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2 text-sm text-gray-500"
                    >
                      <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                      <span>{permission.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Paramètres de mot de passe */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Politique de mot de passe</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Longueur minimale du mot de passe
                  </label>
                  <p className="text-sm text-gray-500">
                    Nombre minimum de caractères requis
                  </p>
                </div>
                <input
                  type="number"
                  min="8"
                  max="32"
                  defaultValue="12"
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Complexité requise
                  </label>
                  <p className="text-sm text-gray-500">
                    Exiger des caractères spéciaux, chiffres et majuscules
                  </p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary`}
                >
                  <span className="sr-only">Activer la complexité</span>
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Paramètres de session */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Paramètres de session</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Durée maximale de session
                  </label>
                  <p className="text-sm text-gray-500">
                    Temps avant déconnexion automatique
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="5"
                    max="480"
                    defaultValue="30"
                    className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  />
                  <span className="text-sm text-gray-500">minutes</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Sessions simultanées
                  </label>
                  <p className="text-sm text-gray-500">
                    Nombre maximum de connexions simultanées
                  </p>
                </div>
                <input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue="1"
                  className="w-20 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Authentification à deux facteurs */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Authentification à deux facteurs</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    2FA obligatoire pour les administrateurs
                  </label>
                  <p className="text-sm text-gray-500">
                    Exiger l'authentification à deux facteurs pour les comptes administrateurs
                  </p>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary bg-primary`}
                >
                  <span className="sr-only">Activer 2FA obligatoire</span>
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Journal de sécurité */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Journal de sécurité</h3>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Actualiser
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Consultez les dernières activités de sécurité
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
