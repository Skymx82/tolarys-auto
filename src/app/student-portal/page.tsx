'use client';

import { useState } from 'react';
import { 
  CalendarIcon,
  CreditCardIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BellIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import DateFormatter from '@/components/DateFormatter';
import NotificationMenu from '@/components/NotificationMenu';
import Link from 'next/link';

interface Lesson {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  instructor: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'practical' | 'theory';
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  description: string;
  status: 'paid' | 'pending' | 'failed';
}

interface Exam {
  id: string;
  type: 'code' | 'practical';
  date: string;
  status: 'scheduled' | 'passed' | 'failed';
  score?: number;
}

const mockLessons: Lesson[] = [
  {
    id: '1',
    date: '2025-02-12',
    startTime: '14:00',
    endTime: '15:00',
    instructor: 'Jean Martin',
    status: 'scheduled',
    type: 'practical'
  },
  {
    id: '2',
    date: '2025-02-15',
    startTime: '10:00',
    endTime: '11:00',
    instructor: 'Marie Dubois',
    status: 'scheduled',
    type: 'theory'
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2025-02-01',
    amount: 45,
    description: 'Leçon de conduite',
    status: 'paid'
  },
  {
    id: '2',
    date: '2025-02-05',
    amount: 30,
    description: 'Cours de code',
    status: 'paid'
  }
];

const mockExams: Exam[] = [
  {
    id: '1',
    type: 'code',
    date: '2025-03-15',
    status: 'scheduled'
  }
];

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'payments' | 'progress'>('schedule');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'passed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
                <span className="text-xl font-bold text-primary mr-4">Tolarys</span>
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              </Link>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">Thomas Dupont</h1>
                <p className="text-sm text-gray-500">Permis B - En cours</p>
              </div>
            </div>
            <NotificationMenu />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-center">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'schedule'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Planning
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'payments'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCardIcon className="h-5 w-5 mr-2" />
                Paiements
              </button>

              <button
                onClick={() => setActiveTab('progress')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'progress'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Progression
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Planning */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Mes leçons</h2>
              <button
                onClick={() => setShowBookingModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90"
              >
                Réserver une leçon
              </button>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
                <h3 className="text-lg font-medium text-gray-900">Février 2025</h3>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowRightIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Liste des leçons */}
              <div className="divide-y divide-gray-200">
                {mockLessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          lesson.type === 'practical' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {lesson.type === 'practical' ? (
                            <ClockIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {lesson.type === 'practical' ? 'Leçon de conduite' : 'Cours de code'}
                          </h4>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <DateFormatter date={lesson.date} /> {lesson.startTime}-{lesson.endTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(lesson.status)
                        }`}>
                          {lesson.status === 'scheduled' ? 'Prévu' : 
                           lesson.status === 'completed' ? 'Terminé' : 'Annulé'}
                        </span>
                        {lesson.status === 'scheduled' && (
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paiements */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Mes paiements</h2>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90">
                Effectuer un paiement
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {mockPayments.map((payment) => (
                  <div key={payment.id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100">
                          <CreditCardIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{payment.description}</h4>
                          <div className="mt-1 text-sm text-gray-500">
                            <DateFormatter date={payment.date} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">{payment.amount} €</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(payment.status)
                        }`}>
                          {payment.status === 'paid' ? 'Payé' : 
                           payment.status === 'pending' ? 'En attente' : 'Échoué'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progression */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Ma progression</h2>

            {/* Progression du code */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">Code de la route</h3>
                <div className="mt-4">
                  <div className="relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div className="w-3/4 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>30/40 séries réussies</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progression de la conduite */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">Conduite</h3>
                <div className="mt-4">
                  <div className="relative">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div className="w-1/2 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-600">
                    <span>10/20 heures effectuées</span>
                    <span>50%</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Manœuvres</div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">3/4</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Circulation</div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">7/10</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Éco-conduite</div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">2/3</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Sécurité</div>
                    <div className="mt-1 flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">4/5</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Examens */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:px-6">
                <h3 className="text-base font-medium text-gray-900">Mes examens</h3>
                <div className="mt-4 space-y-4">
                  {mockExams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {exam.type === 'code' ? 'Examen du code' : 'Examen de conduite'}
                          </div>
                          <div className="text-sm text-gray-500">
                            <DateFormatter date={exam.date} />
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusColor(exam.status)
                      }`}>
                        {exam.status === 'scheduled' ? 'Prévu' : 
                         exam.status === 'passed' ? 'Réussi' : 'Échoué'}
                        {exam.score && ` (${exam.score}/20)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de réservation */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Réserver une leçon</h3>
                  {/* Formulaire de réservation à implémenter */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function StudentPortalPage() {
  return <StudentPortal />;
}
