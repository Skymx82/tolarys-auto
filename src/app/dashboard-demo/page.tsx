'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import {
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  TrophyIcon,
  TruckIcon,
  UserIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const stats = [
  {
    name: 'Élèves actifs',
    value: '89',
    change: '+4.75%',
    changeType: 'increase',
    icon: UsersIcon,
    color: 'bg-[#E91E63]',
  },
  {
    name: 'Taux de réussite',
    value: '92%',
    change: '+2.1%',
    changeType: 'increase',
    icon: TrophyIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Chiffre du mois',
    value: '14.5k€',
    change: '+8%',
    changeType: 'increase',
    icon: CurrencyEuroIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Heures de conduite',
    value: '245h',
    change: '+12%',
    changeType: 'increase',
    icon: ClockIcon,
    color: 'bg-purple-500',
  },
];

const chartData = [
  { name: 'Lun', lecons: 12 },
  { name: 'Mar', lecons: 15 },
  { name: 'Mer', lecons: 18 },
  { name: 'Jeu', lecons: 14 },
  { name: 'Ven', lecons: 16 },
  { name: 'Sam', lecons: 8 },
  { name: 'Dim', lecons: 0 },
];

const upcomingLessons = [
  {
    id: 1,
    student: 'Emma Martin',
    type: 'Conduite',
    time: '09:00',
    duration: '2h',
    status: 'confirmed',
  },
  {
    id: 2,
    student: 'Lucas Bernard',
    type: 'Code',
    time: '11:30',
    duration: '1h',
    status: 'pending',
  },
  {
    id: 3,
    student: 'Sophie Dubois',
    type: 'Conduite',
    time: '14:00',
    duration: '2h',
    status: 'confirmed',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'payment',
    user: 'Thomas Martin',
    action: 'a effectué un paiement de',
    target: '150€',
    date: 'Il y a 2 heures',
  },
  {
    id: 2,
    type: 'exam',
    user: 'Julie Dupont',
    action: 'a réussi son',
    target: 'examen du code',
    date: 'Il y a 3 heures',
  },
  {
    id: 3,
    type: 'lesson',
    user: 'Marc Lambert',
    action: 'a réservé une leçon de',
    target: 'conduite',
    date: 'Il y a 5 heures',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const WeeklyLessonsChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Chargement du graphique...</div>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Bar 
            dataKey="lecons" 
            fill="#E91E63" 
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function DashboardPage() {
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    student: '',
    type: 'conduite',
    date: '',
    time: '',
    duration: '2',
    instructor: '',
    location: '',
    vehicle: '',
  });

  const handleCloseNewLessonModal = () => {
    setShowNewLessonModal(false);
    setNewLesson({
      student: '',
      type: 'conduite',
      date: '',
      time: '',
      duration: '2',
      instructor: '',
      location: '',
      vehicle: '',
    });
  };

  const handleCreateLesson = () => {
    // TODO: Implémenter la création de la leçon
    handleCloseNewLessonModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6">
        {/* Welcome Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bonjour, John</h1>
              <p className="mt-1 text-sm text-gray-500">
                Voici un aperçu de votre activité aujourd'hui
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#D81B60] transition-colors"
                onClick={() => setShowNewLessonModal(true)}
              >
                + Nouvelle leçon
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow hover:shadow-lg transition-shadow duration-200 sm:px-6 sm:py-6"
              >
                <div className="absolute bottom-0 right-0 opacity-5">
                  <stat.icon className="h-24 w-24 text-current" aria-hidden="true" />
                </div>
                <dt>
                  <div className={`absolute rounded-md ${stat.color} p-3`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p
                    className={classNames(
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                      'ml-2 flex items-baseline text-sm font-semibold'
                    )}
                  >
                    {stat.changeType === 'increase' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4" />
                    )}
                    {stat.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Leçons cette semaine
                  </h3>
                  <div className="text-sm text-gray-500">
                    Total: 83 leçons
                  </div>
                </div>
                <Suspense fallback={
                  <div className="h-80 flex items-center justify-center">
                    <div className="animate-pulse text-gray-500">Chargement du graphique...</div>
                  </div>
                }>
                  <WeeklyLessonsChart />
                </Suspense>
              </div>
            </div>

            {/* Upcoming Lessons */}
            <div className="rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
                  Prochaines leçons
                </h3>
                <div className="flow-root">
                  <ul role="list" className="divide-y divide-gray-200">
                    {upcomingLessons.map((lesson) => (
                      <li key={lesson.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full bg-[#E91E63]/10 flex items-center justify-center`}>
                              <CalendarIcon className="w-5 h-5 text-[#E91E63]" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {lesson.student}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {lesson.type} • {lesson.time} • {lesson.duration}
                            </p>
                          </div>
                          <div>
                            {lesson.status === 'confirmed' ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full px-4 py-2 text-sm text-[#E91E63] border border-[#E91E63] rounded-lg hover:bg-[#E91E63] hover:text-white transition-colors">
                    Voir tout le planning
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-3 rounded-lg bg-white shadow hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">
                  Activité récente
                </h3>
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span
                              className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex items-start space-x-3">
                            <div
                              className={classNames(
                                activity.type === 'payment'
                                  ? 'bg-green-500'
                                  : activity.type === 'exam'
                                  ? 'bg-[#E91E63]'
                                  : 'bg-yellow-500',
                                'h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white'
                              )}
                            >
                              {activity.type === 'payment' ? (
                                <CurrencyEuroIcon className="h-6 w-6 text-white" />
                              ) : activity.type === 'exam' ? (
                                <AcademicCapIcon className="h-6 w-6 text-white" />
                              ) : (
                                <CalendarIcon className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {activity.user}
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {activity.action}{' '}
                                  <span className="font-medium text-gray-900">
                                    {activity.target}
                                  </span>
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-500">
                                {activity.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de nouvelle leçon */}
      {showNewLessonModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-lesson-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseNewLessonModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={handleCloseNewLessonModal}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Nouvelle Leçon
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Étudiant */}
                        <div>
                          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                            Étudiant
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="student"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Nom de l'étudiant"
                                value={newLesson.student}
                                onChange={(e) => setNewLesson({ ...newLesson, student: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Type de leçon */}
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type de leçon
                          </label>
                          <select
                            id="type"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newLesson.type}
                            onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                          >
                            <option value="conduite">Conduite</option>
                            <option value="code">Code</option>
                          </select>
                        </div>

                        {/* Date et Heure */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                              value={newLesson.date}
                              onChange={(e) => setNewLesson({ ...newLesson, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                              Heure
                            </label>
                            <input
                              type="time"
                              id="time"
                              className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                              value={newLesson.time}
                              onChange={(e) => setNewLesson({ ...newLesson, time: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Durée */}
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                            Durée (heures)
                          </label>
                          <select
                            id="duration"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                          >
                            <option value="1">1 heure</option>
                            <option value="2">2 heures</option>
                            <option value="3">3 heures</option>
                          </select>
                        </div>

                        {/* Moniteur */}
                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                            Moniteur
                          </label>
                          <input
                            type="text"
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
                            placeholder="Nom du moniteur"
                            value={newLesson.instructor}
                            onChange={(e) => setNewLesson({ ...newLesson, instructor: e.target.value })}
                          />
                        </div>

                        {newLesson.type === 'conduite' && (
                          <>
                            {/* Lieu de rendez-vous */}
                            <div>
                              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                Lieu de rendez-vous
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                  </div>
                                  <input
                                    type="text"
                                    id="location"
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Adresse du rendez-vous"
                                    value={newLesson.location}
                                    onChange={(e) => setNewLesson({ ...newLesson, location: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Véhicule */}
                            <div>
                              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                                Véhicule
                              </label>
                              <div className="mt-1 flex rounded-md shadow-sm">
                                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <TruckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                  </div>
                                  <input
                                    type="text"
                                    id="vehicle"
                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                    placeholder="Véhicule"
                                    value={newLesson.vehicle}
                                    onChange={(e) => setNewLesson({ ...newLesson, vehicle: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </form>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                      onClick={handleCreateLesson}
                    >
                      Créer
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={handleCloseNewLessonModal}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
