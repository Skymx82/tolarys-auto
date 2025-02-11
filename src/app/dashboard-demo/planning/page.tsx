'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import './styles.css';

// Types d'événements avec leurs couleurs
const eventTypes = {
  practical: { name: 'Leçon pratique', color: '#E91E63' },
  theory: { name: 'Cours de code', color: '#2196F3' },
  exam: { name: 'Examen', color: '#4CAF50' },
};

// Données de test pour le calendrier
const events = [
  {
    id: '1',
    title: 'Leçon - Sophie Martin',
    start: '2025-02-11T10:00:00',
    end: '2025-02-11T11:00:00',
    backgroundColor: eventTypes.practical.color,
    classNames: ['practical'],
    extendedProps: {
      type: 'practical',
      student: 'Sophie Martin',
      instructor: 'Jean Dupont',
      vehicle: 'Peugeot 208 - AB-123-CD'
    }
  },
  {
    id: '2',
    title: 'Cours Code - Groupe A',
    start: '2025-02-11T14:00:00',
    end: '2025-02-11T16:00:00',
    backgroundColor: eventTypes.theory.color,
    classNames: ['theory'],
    extendedProps: {
      type: 'theory',
      instructor: 'Marie Lambert',
      students: ['Lucas Bernard', 'Emma Petit', 'Thomas Richard']
    }
  },
  {
    id: '3',
    title: 'Examen Pratique - Emma Petit',
    start: '2025-02-12T09:00:00',
    end: '2025-02-12T10:00:00',
    backgroundColor: eventTypes.exam.color,
    classNames: ['exam'],
    extendedProps: {
      type: 'exam',
      student: 'Emma Petit',
      instructor: 'Jean Dupont',
      examType: 'Permis B'
    }
  }
];

const filters = [
  { id: 'all', name: 'Tout' },
  { id: 'practical', name: 'Leçons pratiques' },
  { id: 'theory', name: 'Cours de code' },
  { id: 'exam', name: 'Examens' },
];

const instructors = [
  { id: '1', name: 'Jean Dupont' },
  { id: '2', name: 'Marie Lambert' },
  { id: '3', name: 'Pierre Martin' },
];

export default function PlanningPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-dark" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="rounded-md border-gray-300 py-1.5 text-gray-dark focus:border-primary focus:ring-primary sm:text-sm"
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="rounded-md border-gray-300 py-1.5 text-gray-dark focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">Tous les moniteurs</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Nouvelle leçon
        </button>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          locale={frLocale}
          events={events}
          eventClick={handleEventClick}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          slotDuration="00:30:00"
          height="auto"
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          dayMaxEvents={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5, 6],
            startTime: '08:00',
            endTime: '20:00',
          }}
        />
      </div>

      {/* Modal des détails de l'événement */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-dark">
                      {selectedEvent.title}
                    </h3>
                    <div className="mt-4 text-left">
                      <p className="text-sm text-gray-dark">
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(selectedEvent.start).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-gray-dark">
                        <span className="font-semibold">Horaire:</span>{' '}
                        {new Date(selectedEvent.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(selectedEvent.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {selectedEvent.extendedProps.type === 'practical' && (
                        <>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Élève:</span>{' '}
                            {selectedEvent.extendedProps.student}
                          </p>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Moniteur:</span>{' '}
                            {selectedEvent.extendedProps.instructor}
                          </p>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Véhicule:</span>{' '}
                            {selectedEvent.extendedProps.vehicle}
                          </p>
                        </>
                      )}
                      {selectedEvent.extendedProps.type === 'theory' && (
                        <>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Moniteur:</span>{' '}
                            {selectedEvent.extendedProps.instructor}
                          </p>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Élèves:</span>{' '}
                            {selectedEvent.extendedProps.students.join(', ')}
                          </p>
                        </>
                      )}
                      {selectedEvent.extendedProps.type === 'exam' && (
                        <>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Élève:</span>{' '}
                            {selectedEvent.extendedProps.student}
                          </p>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Moniteur:</span>{' '}
                            {selectedEvent.extendedProps.instructor}
                          </p>
                          <p className="text-sm text-gray-dark">
                            <span className="font-semibold">Type d'examen:</span>{' '}
                            {selectedEvent.extendedProps.examType}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 sm:col-start-2"
                    onClick={() => setShowEventDetails(false)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-dark shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={() => setShowEventDetails(false)}
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
