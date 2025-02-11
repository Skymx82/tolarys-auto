'use client';

import { useEffect, useState, Suspense } from 'react';
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
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CheckCircleIcon,
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
              <button className="px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#D81B60] transition-colors">
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
          </div>
        </div>
      </div>
    </div>
  );
}
