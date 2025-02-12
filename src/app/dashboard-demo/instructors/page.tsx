'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ChevronDownIcon, 
  ChevronUpIcon,
  CalendarIcon,
  UserGroupIcon,
  StarIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Types
interface Schedule {
  [key: string]: string[];
}

interface Lesson {
  id: string;
  date: string;
  student: string;
  type: string;
}

interface InstructorStats {
  totalLessons: number;
  completedLessons: number;
  upcomingLessons: number;
  successRate: number;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  schedule: Schedule;
  lessons: Lesson[];
  stats: InstructorStats;
  specialties: string[];
  rating: number;
  status: 'active' | 'inactive';
}

// Données de test pour les moniteurs
const instructors: Instructor[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@tolarys.fr',
    phone: '06 12 34 56 78',
    schedule: {
      monday: ['08:00-12:00', '14:00-19:00'],
      tuesday: ['08:00-12:00', '14:00-19:00'],
      wednesday: ['08:00-12:00'],
      thursday: ['08:00-12:00', '14:00-19:00'],
      friday: ['08:00-12:00', '14:00-19:00'],
      saturday: ['08:00-12:00']
    },
    lessons: [
      {
        id: 'lesson1',
        date: '10:00',
        student: 'Sophie Martin',
        type: 'Permis B'
      },
      {
        id: 'lesson2',
        date: '11:30',
        student: 'Lucas Bernard',
        type: 'Conduite accompagnée'
      }
    ],
    stats: {
      totalLessons: 42,
      completedLessons: 35,
      upcomingLessons: 7,
      successRate: 92
    },
    specialties: ['Permis B', 'Conduite accompagnée'],
    rating: 4.5,
    status: 'active'
  },
  {
    id: '2',
    name: 'Marie Lambert',
    email: 'marie.lambert@tolarys.fr',
    phone: '06 23 45 67 89',
    schedule: {
      monday: ['09:00-12:00', '14:00-18:00'],
      tuesday: ['09:00-12:00', '14:00-18:00'],
      wednesday: ['09:00-12:00', '14:00-18:00'],
      thursday: ['09:00-12:00', '14:00-18:00'],
      friday: ['09:00-12:00', '14:00-18:00']
    },
    lessons: [
      {
        id: 'lesson3',
        date: '14:00',
        student: 'Emma Petit',
        type: 'Code de la route'
      }
    ],
    stats: {
      totalLessons: 35,
      completedLessons: 30,
      upcomingLessons: 5,
      successRate: 88
    },
    specialties: ['Permis B', 'Code de la route'],
    rating: 4.2,
    status: 'active'
  }
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800'
};

const statusLabels: Record<string, string> = {
  active: 'Actif',
  inactive: 'Inactif'
};

const daysOfWeek: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi'
};

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});
  const [showNewInstructorModal, setShowNewInstructorModal] = useState<boolean>(false);

  const toggleDetails = (instructorId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [instructorId]: !prev[instructorId]
    }));
  };

  const closeNewInstructorModal = () => {
    setShowNewInstructorModal(false);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un moniteur..."
              className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => setShowNewInstructorModal(true)}
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Nouveau Moniteur
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
                setShowDetails(prev => ({ ...prev, [instructor.id]: true }));
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedInstructor(instructor);
                  setShowDetails(prev => ({ ...prev, [instructor.id]: true }));
                }
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
                          <span className="ml-1 text-sm text-gray-900">{instructor.stats.totalLessons}</span>
                        </div>
                        <span className="text-xs text-gray-500">Leçons</span>
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
                          <span className="ml-1 text-sm text-gray-900">{instructor.stats.upcomingLessons}</span>
                        </div>
                        <span className="text-xs text-gray-500">Prochaines leçons</span>
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
      {selectedInstructor && showDetails[selectedInstructor.id] && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowDetails({});
            setSelectedInstructor(null);
          }}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
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
                                <dt className="text-sm font-medium text-gray-500">Leçons totales</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.totalLessons}</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Taux de réussite</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.successRate}%</dd>
                              </div>
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Leçons à venir</dt>
                                <dd className="mt-1 text-sm text-gray-900">{selectedInstructor.stats.upcomingLessons}</dd>
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
                          {selectedInstructor.lessons.map((lesson, index) => (
                            <li key={index} className="py-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{lesson.student}</p>
                                  <p className="text-sm text-gray-500">{lesson.type}</p>
                                </div>
                                <div className="text-sm text-gray-500">{lesson.date}</div>
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2"
                    onClick={() => {
                      setShowDetails({});
                      setSelectedInstructor(null);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
                    onClick={() => {
                      setShowDetails({});
                      setSelectedInstructor(null);
                    }}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'un nouveau moniteur */}
      {showNewInstructorModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-instructor-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeNewInstructorModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 id="new-instructor-modal" className="text-lg font-semibold leading-6 text-gray-dark">
                      Nouveau Moniteur
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Informations personnelles */}
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-dark">
                              Nom complet
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              placeholder="Jean Dupont"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-dark">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              placeholder="jean.dupont@tolarys.fr"
                            />
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-dark">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              placeholder="06 12 34 56 78"
                            />
                          </div>
                        </div>

                        {/* Spécialités */}
                        <div>
                          <label htmlFor="specialties" className="block text-sm font-medium text-gray-dark">
                            Spécialités
                          </label>
                          <select
                            id="specialties"
                            multiple
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            size={3}
                          >
                            <option value="permis-b">Permis B</option>
                            <option value="code">Code de la route</option>
                            <option value="conduite-accompagnee">Conduite accompagnée</option>
                            <option value="permis-moto">Permis Moto</option>
                          </select>
                        </div>

                        {/* Horaires */}
                        <div>
                          <label className="block text-sm font-medium text-gray-dark mb-2">
                            Horaires de travail
                          </label>
                          <div className="space-y-2">
                            {Object.entries(daysOfWeek).map(([day, label]) => (
                              <div key={day} className="flex items-center space-x-2">
                                <span className="w-24 text-sm text-gray-dark">{label}</span>
                                <input
                                  type="time"
                                  className="rounded-md border-gray-300 py-1 px-2 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                />
                                <span className="text-sm text-gray-dark">-</span>
                                <input
                                  type="time"
                                  className="rounded-md border-gray-300 py-1 px-2 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2"
                    onClick={closeNewInstructorModal}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-dark shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
                    onClick={closeNewInstructorModal}
                  >
                    Annuler
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
