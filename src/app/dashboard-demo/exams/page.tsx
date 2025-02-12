'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

// Types
type ExamType = 'code' | 'practical';
type ExamStatus = 'upcoming' | 'passed' | 'failed';
type FilterType = 'all' | 'upcoming' | 'passed' | 'failed' | 'code' | 'practical';

interface Student {
  name: string;
  id: string;
  attempts: number;
}

interface Exam {
  id: number;
  type: ExamType;
  student: Student;
  date: string;
  time: string;
  location: string;
  status: ExamStatus;
  instructor: string;
  vehicle?: string;
  score?: string;
  feedback?: string;
}

// Données de test pour les examens
const exams: Exam[] = [
  {
    id: 1,
    type: 'code',
    student: {
      name: 'Sophie Martin',
      id: 'SM123',
      attempts: 1
    },
    date: '2025-02-15',
    time: '10:00',
    location: 'Centre d\'examen Paris 15',
    status: 'upcoming',
    instructor: 'Marie Lambert'
  },
  {
    id: 2,
    type: 'practical',
    student: {
      name: 'Lucas Bernard',
      id: 'LB456',
      attempts: 2
    },
    date: '2025-02-16',
    time: '14:30',
    location: 'Centre d\'examen Paris 20',
    status: 'upcoming',
    instructor: 'Jean Dupont',
    vehicle: 'Peugeot 208 - AB-123-CD'
  },
  {
    id: 3,
    type: 'code',
    student: {
      name: 'Emma Petit',
      id: 'EP789',
      attempts: 1
    },
    date: '2025-02-10',
    time: '09:00',
    location: 'Centre d\'examen Paris 15',
    status: 'passed',
    score: '35/40',
    instructor: 'Marie Lambert'
  },
  {
    id: 4,
    type: 'practical',
    student: {
      name: 'Thomas Richard',
      id: 'TR101',
      attempts: 1
    },
    date: '2025-02-09',
    time: '11:00',
    location: 'Centre d\'examen Paris 20',
    status: 'failed',
    feedback: 'Difficulté dans le créneau et la priorité à droite',
    instructor: 'Jean Dupont',
    vehicle: 'Peugeot 208 - AB-123-CD'
  }
];

const statusColors: Record<ExamStatus, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  passed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800'
};

const statusLabels: Record<ExamStatus, string> = {
  upcoming: 'À venir',
  passed: 'Réussi',
  failed: 'Échoué'
};

const examTypeLabels: Record<ExamType, string> = {
  code: 'Code de la route',
  practical: 'Conduite'
};

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showNewExamModal, setShowNewExamModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    type: 'code',
    status: 'upcoming'
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'upcoming' && exam.status === 'upcoming') ||
                         (filter === 'passed' && exam.status === 'passed') ||
                         (filter === 'failed' && exam.status === 'failed') ||
                         (filter === 'code' && exam.type === 'code') ||
                         (filter === 'practical' && exam.type === 'practical');
    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedExam(null);
  };

  const handleCloseNewExamModal = () => {
    setShowNewExamModal(false);
    setNewExam({ type: 'code', status: 'upcoming' });
  };

  const handleExamClick = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche, filtres et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-lg w-full">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Rechercher un examen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <option value="all">Tous les examens</option>
            <option value="upcoming">À venir</option>
            <option value="passed">Réussis</option>
            <option value="failed">Échoués</option>
            <option value="code">Code</option>
            <option value="practical">Conduite</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
            onClick={() => setShowNewExamModal(true)}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nouvel examen
          </button>
        </div>
      </div>

      {/* Liste des examens */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredExams.map((exam) => (
            <li
              key={exam.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleExamClick(exam)}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full ${
                        exam.type === 'code' ? 'bg-blue-100' : 'bg-green-100'
                      } flex items-center justify-center`}>
                        {exam.type === 'code' ? (
                          <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                        ) : (
                          <TruckIcon className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{exam.student.name}</div>
                        <span className="ml-2 text-sm text-gray-500">({exam.student.id})</span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[exam.status]
                        }`}>
                          {statusLabels[exam.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{examTypeLabels[exam.type]}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <CalendarIcon className="h-5 w-5" />
                      <span>{exam.date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ClockIcon className="h-5 w-5" />
                      <span>{exam.time}</span>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal des détails de l'examen */}
      {showDetails && selectedExam && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="exam-details-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
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
                      Détails de l'examen
                    </h3>
                    <div className="mt-4 text-left">
                      <div className="space-y-4">
                        {/* Type d'examen et statut */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {examTypeLabels[selectedExam.type]}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedExam.status]}`}>
                            {statusLabels[selectedExam.status]}
                          </span>
                        </div>

                        {/* Informations de l'étudiant */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Étudiant</h4>
                          <div className="mt-1">
                            <p className="text-sm text-gray-900">{selectedExam.student.name}</p>
                            <p className="text-sm text-gray-500">ID: {selectedExam.student.id}</p>
                            <p className="text-sm text-gray-500">Tentative: {selectedExam.student.attempts}</p>
                          </div>
                        </div>

                        {/* Date et heure */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date et heure</h4>
                          <div className="mt-1 flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedExam.date} à {selectedExam.time}</span>
                          </div>
                        </div>

                        {/* Lieu */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Lieu</h4>
                          <div className="mt-1 flex items-center">
                            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedExam.location}</span>
                          </div>
                        </div>

                        {/* Moniteur */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Moniteur</h4>
                          <div className="mt-1 flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedExam.instructor}</span>
                          </div>
                        </div>

                        {/* Véhicule (si examen pratique) */}
                        {selectedExam.type === 'practical' && selectedExam.vehicle && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Véhicule</h4>
                            <div className="mt-1 flex items-center">
                              <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{selectedExam.vehicle}</span>
                            </div>
                          </div>
                        )}

                        {/* Score (si terminé) */}
                        {selectedExam.score && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Score</h4>
                            <div className="mt-1 flex items-center">
                              <ChartBarIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{selectedExam.score}</span>
                            </div>
                          </div>
                        )}

                        {/* Feedback (si échoué) */}
                        {selectedExam.feedback && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Commentaires</h4>
                            <div className="mt-1">
                              <p className="text-sm text-gray-900">{selectedExam.feedback}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCloseModal}
                  >
                    Fermer
                  </button>
                  {selectedExam.status === 'upcoming' && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={handleCloseModal}
                    >
                      Modifier
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'un nouvel examen */}
      {showNewExamModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-exam-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseNewExamModal}
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
                      Nouvel Examen
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Type d'examen */}
                        <div>
                          <label htmlFor="exam-type" className="block text-sm font-medium text-gray-700">
                            Type d'examen
                          </label>
                          <select
                            id="exam-type"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newExam.type}
                            onChange={(e) => setNewExam({ ...newExam, type: e.target.value as ExamType })}
                          >
                            <option value="code">Code de la route</option>
                            <option value="practical">Conduite</option>
                          </select>
                        </div>

                        {/* Étudiant */}
                        <div>
                          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                            Étudiant
                          </label>
                          <input
                            type="text"
                            id="student"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Nom de l'étudiant"
                          />
                        </div>

                        {/* Date et heure */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            />
                          </div>
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                              Heure
                            </label>
                            <input
                              type="time"
                              id="time"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            />
                          </div>
                        </div>

                        {/* Centre d'examen */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Centre d'examen
                          </label>
                          <input
                            type="text"
                            id="location"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Adresse du centre d'examen"
                          />
                        </div>

                        {/* Moniteur */}
                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                            Moniteur
                          </label>
                          <select
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          >
                            <option value="">Sélectionner un moniteur</option>
                            <option value="jean-dupont">Jean Dupont</option>
                            <option value="marie-lambert">Marie Lambert</option>
                          </select>
                        </div>

                        {/* Véhicule (uniquement pour examen pratique) */}
                        {newExam.type === 'practical' && (
                          <div>
                            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                              Véhicule
                            </label>
                            <select
                              id="vehicle"
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            >
                              <option value="">Sélectionner un véhicule</option>
                              <option value="peugeot-208">Peugeot 208 - AB-123-CD</option>
                              <option value="renault-clio">Renault Clio - EF-456-GH</option>
                            </select>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCloseNewExamModal}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseNewExamModal}
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
