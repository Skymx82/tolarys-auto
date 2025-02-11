'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ChevronDownIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Données de test pour les moniteurs
const instructors = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean.dupont@tolarys.fr',
    phone: '06 12 34 56 78',
    startDate: '01/01/2024',
    specialties: ['Permis B', 'Conduite accompagnée'],
    status: 'available',
    stats: {
      totalStudents: 42,
      lessonsThisMonth: 68,
      successRate: 92,
      hoursThisWeek: 28
    },
    schedule: {
      monday: ['08:00-12:00', '14:00-19:00'],
      tuesday: ['08:00-12:00', '14:00-19:00'],
      wednesday: ['08:00-12:00'],
      thursday: ['08:00-12:00', '14:00-19:00'],
      friday: ['08:00-12:00', '14:00-19:00'],
      saturday: ['08:00-12:00']
    },
    upcomingLessons: [
      {
        time: '10:00',
        student: 'Sophie Martin',
        type: 'Permis B'
      },
      {
        time: '11:30',
        student: 'Lucas Bernard',
        type: 'Conduite accompagnée'
      }
    ]
  },
  {
    id: 2,
    name: 'Marie Lambert',
    email: 'marie.lambert@tolarys.fr',
    phone: '06 23 45 67 89',
    startDate: '15/03/2024',
    specialties: ['Permis B', 'Code de la route'],
    status: 'teaching',
    stats: {
      totalStudents: 35,
      lessonsThisMonth: 54,
      successRate: 88,
      hoursThisWeek: 25
    },
    schedule: {
      monday: ['09:00-12:00', '14:00-18:00'],
      tuesday: ['09:00-12:00', '14:00-18:00'],
      wednesday: ['09:00-12:00', '14:00-18:00'],
      thursday: ['09:00-12:00', '14:00-18:00'],
      friday: ['09:00-12:00', '14:00-18:00']
    },
    upcomingLessons: [
      {
        time: '14:00',
        student: 'Emma Petit',
        type: 'Code de la route'
      }
    ]
  }
];

const statusColors = {
  available: 'bg-green-100 text-green-800',
  teaching: 'bg-blue-100 text-blue-800',
  break: 'bg-yellow-100 text-yellow-800',
  off: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  available: 'Disponible',
  teaching: 'En cours',
  break: 'Pause',
  off: 'Absent'
};

const daysOfWeek = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi'
};

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Rechercher un moniteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Nouveau moniteur
        </button>
      </div>

      {/* Liste des moniteurs */}
      <div className="bg-white shadow-sm rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredInstructors.map((instructor) => (
            <li
              key={instructor.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedInstructor(instructor);
                setShowDetails(true);
              }}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{instructor.name}</div>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[instructor.status]
                        }`}>
                          {statusLabels[instructor.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{instructor.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    {/* Statistiques rapides */}
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-1 text-sm text-gray-900">{instructor.stats.totalStudents}</span>
                        </div>
                        <span className="text-xs text-gray-500">Élèves</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <StarIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-1 text-sm text-gray-900">{instructor.stats.successRate}%</span>
                        </div>
                        <span className="text-xs text-gray-500">Réussite</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                          <span className="ml-1 text-sm text-gray-900">{instructor.stats.hoursThisWeek}h</span>
                        </div>
                        <span className="text-xs text-gray-500">Cette semaine</span>
                      </div>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal des détails du moniteur */}
      {showDetails && selectedInstructor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Détails du moniteur
                    </h3>
                    <div className="mt-8">
                      {/* Informations personnelles */}
                      <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Nom</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedInstructor.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedInstructor.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedInstructor.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date d'entrée</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedInstructor.startDate}</p>
                        </div>
                      </div>

                      {/* Spécialités et statistiques */}
                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Spécialités */}
                          <div>
                            <h4 className="text-base font-medium text-gray-900 mb-4">Spécialités</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedInstructor.specialties.map((specialty, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Statistiques */}
                          <div>
                            <h4 className="text-base font-medium text-gray-900 mb-4">Statistiques</h4>
                            <dl className="grid grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Élèves totaux</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.totalStudents}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Taux de réussite</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.successRate}%</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Leçons ce mois</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.lessonsThisMonth}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Heures cette semaine</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.hoursThisWeek}h</dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </div>

                      {/* Horaires */}
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Horaires</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(selectedInstructor.schedule).map(([day, hours]) => (
                            <div key={day} className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-500">{daysOfWeek[day]}</span>
                              <span className="text-sm text-gray-900">{hours.join(', ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prochaines leçons */}
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Prochaines leçons</h4>
                        <ul className="divide-y divide-gray-200">
                          {selectedInstructor.upcomingLessons.map((lesson, index) => (
                            <li key={index} className="py-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{lesson.student}</p>
                                  <p className="text-sm text-gray-500">{lesson.type}</p>
                                </div>
                                <div className="text-sm text-gray-500">{lesson.time}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 sm:col-start-2"
                    onClick={() => setShowDetails(false)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setShowDetails(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
