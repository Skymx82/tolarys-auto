'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// Données de test pour les élèves
const students = [
  {
    id: 1,
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '06 12 34 56 78',
    startDate: '15/01/2025',
    progress: {
      theory: {
        status: 'completed',
        score: '35/40',
        examDate: '01/02/2025'
      },
      practical: {
        status: 'in_progress',
        hours: 15,
        totalHours: 20,
        nextLesson: '12/02/2025'
      }
    },
    payments: {
      status: 'up_to_date',
      totalPaid: 1200,
      totalDue: 1500
    }
  },
  {
    id: 2,
    name: 'Lucas Bernard',
    email: 'lucas.bernard@email.com',
    phone: '06 23 45 67 89',
    startDate: '20/01/2025',
    progress: {
      theory: {
        status: 'in_progress',
        score: '28/40',
        examDate: null
      },
      practical: {
        status: 'not_started',
        hours: 0,
        totalHours: 20,
        nextLesson: null
      }
    },
    payments: {
      status: 'pending',
      totalPaid: 500,
      totalDue: 1500
    }
  },
  // Ajoutez plus d'élèves ici
];

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  not_started: 'bg-gray-100 text-gray-800',
  up_to_date: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800'
};

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Rechercher un élève..."
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
          Nouvel élève
        </button>
      </div>

      {/* Liste des élèves */}
      <div className="bg-white shadow-sm rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <li
              key={student.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedStudent(student);
                setShowDetails(true);
              }}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Progression code */}
                    <div className="flex flex-col items-center">
                      <AcademicCapIcon className={`h-6 w-6 ${
                        student.progress.theory.status === 'completed' ? 'text-green-500' :
                        student.progress.theory.status === 'in_progress' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500">Code</span>
                    </div>
                    {/* Progression conduite */}
                    <div className="flex flex-col items-center">
                      <ClockIcon className={`h-6 w-6 ${
                        student.progress.practical.status === 'completed' ? 'text-green-500' :
                        student.progress.practical.status === 'in_progress' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500">Conduite</span>
                    </div>
                    {/* Statut paiement */}
                    <div className="flex flex-col items-center">
                      <CurrencyEuroIcon className={`h-6 w-6 ${
                        student.payments.status === 'up_to_date' ? 'text-green-500' :
                        student.payments.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                      }`} />
                      <span className="text-xs text-gray-500">Paiement</span>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal des détails de l'élève */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Détails de l'élève
                    </h3>
                    <div className="mt-8">
                      {/* Informations personnelles */}
                      <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Nom</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedStudent.name}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedStudent.email}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedStudent.phone}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date d'inscription</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedStudent.startDate}</p>
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Progression</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Code */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">Formation Code</h5>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[selectedStudent.progress.theory.status]
                              }`}>
                                {selectedStudent.progress.theory.status === 'completed' ? 'Terminé' :
                                 selectedStudent.progress.theory.status === 'in_progress' ? 'En cours' : 'Non commencé'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Score: {selectedStudent.progress.theory.score}</p>
                            {selectedStudent.progress.theory.examDate && (
                              <p className="text-sm text-gray-500">
                                Examen le: {selectedStudent.progress.theory.examDate}
                              </p>
                            )}
                          </div>

                          {/* Conduite */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">Formation Conduite</h5>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[selectedStudent.progress.practical.status]
                              }`}>
                                {selectedStudent.progress.practical.status === 'completed' ? 'Terminé' :
                                 selectedStudent.progress.practical.status === 'in_progress' ? 'En cours' : 'Non commencé'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Heures effectuées: {selectedStudent.progress.practical.hours}/{selectedStudent.progress.practical.totalHours}
                            </p>
                            {selectedStudent.progress.practical.nextLesson && (
                              <p className="text-sm text-gray-500">
                                Prochaine leçon: {selectedStudent.progress.practical.nextLesson}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Paiements */}
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Paiements</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-sm font-medium text-gray-900">État des paiements</h5>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[selectedStudent.payments.status]
                            }`}>
                              {selectedStudent.payments.status === 'up_to_date' ? 'À jour' :
                               selectedStudent.payments.status === 'pending' ? 'En attente' : 'En retard'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-500">
                              Montant payé: {selectedStudent.payments.totalPaid}€
                            </p>
                            <p className="text-sm text-gray-500">
                              Montant total: {selectedStudent.payments.totalDue}€
                            </p>
                          </div>
                        </div>
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
