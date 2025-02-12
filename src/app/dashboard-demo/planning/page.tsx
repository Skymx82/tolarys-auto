'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, EventInput, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import './styles.css';

// Types
type EventTypeKey = 'practical' | 'theory' | 'exam';

interface EventType {
  name: string;
  color: string;
}

interface ExtendedEventProps {
  type: EventTypeKey;
  student?: string;
  instructor: string;
  vehicle?: string;
  students?: string[];
  examType?: string;
}

interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor: string;
  classNames: string[];
  extendedProps: ExtendedEventProps;
}

interface Filter {
  id: EventTypeKey | 'all';
  name: string;
}

interface Instructor {
  id: string;
  name: string;
}

// Constants
const eventTypes: Record<EventTypeKey, EventType> = {
  practical: { name: 'Leçon pratique', color: '#E91E63' },
  theory: { name: 'Cours de code', color: '#2196F3' },
  exam: { name: 'Examen', color: '#4CAF50' },
};

const events: CalendarEvent[] = [
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

const filters: Filter[] = [
  { id: 'all', name: 'Tout' },
  { id: 'practical', name: 'Leçons pratiques' },
  { id: 'theory', name: 'Cours de code' },
  { id: 'exam', name: 'Examens' },
];

const instructors: Instructor[] = [
  { id: '1', name: 'Jean Dupont' },
  { id: '2', name: 'Marie Lambert' },
  { id: '3', name: 'Pierre Martin' },
];

export default function PlanningPage() {
  const [selectedFilter, setSelectedFilter] = useState<Filter['id']>('all');
  const [selectedInstructor, setSelectedInstructor] = useState<string>('all');
  const [showEventDetails, setShowEventDetails] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [showNewLessonModal, setShowNewLessonModal] = useState<boolean>(false);
  const [newLessonType, setNewLessonType] = useState<EventTypeKey>('practical');

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };

  const closeModal = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  const closeNewLessonModal = () => {
    setShowNewLessonModal(false);
    setNewLessonType('practical');
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value as Filter['id']);
  };

  const filteredEvents = events.filter(event => {
    if (selectedFilter !== 'all' && event.extendedProps.type !== selectedFilter) return false;
    if (selectedInstructor !== 'all' && event.extendedProps.instructor !== selectedInstructor) return false;
    return true;
  });

  const formatEventDate = (date: string | Date): string => {
    try {
      const eventDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date');
      }
      return eventDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const formatEventTime = (date: string | Date): string => {
    try {
      const eventDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date');
      }
      return eventDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-dark" aria-hidden="true" />
            <label htmlFor="event-type-filter" className="sr-only">Filtrer par type d'événement</label>
            <select
              id="event-type-filter"
              value={selectedFilter}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 py-1.5 text-gray-dark focus:border-primary focus:ring-primary sm:text-sm"
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
          <label htmlFor="instructor-filter" className="sr-only">Filtrer par moniteur</label>
          <select
            id="instructor-filter"
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="rounded-md border-gray-300 py-1.5 text-gray-dark focus:border-primary focus:ring-primary sm:text-sm"
          >
            <option value="all">Tous les moniteurs</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.name}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => setShowNewLessonModal(true)}
          aria-label="Ajouter une nouvelle leçon"
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
          events={filteredEvents}
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
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 id="modal-title" className="text-lg font-semibold leading-6 text-gray-dark">
                      {selectedEvent.title}
                    </h3>
                    <div className="mt-4 text-left">
                      <p className="text-sm text-gray-dark">
                        <span className="font-semibold">Date:</span>{' '}
                        {formatEventDate(selectedEvent.startStr)}
                      </p>
                      <p className="text-sm text-gray-dark">
                        <span className="font-semibold">Horaire:</span>{' '}
                        {formatEventTime(selectedEvent.startStr)} - {formatEventTime(selectedEvent.endStr)}
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
                            {selectedEvent.extendedProps.students?.join(', ')}
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2"
                    onClick={closeModal}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-dark shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
                    onClick={closeModal}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'une nouvelle leçon */}
      {showNewLessonModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-lesson-modal"
          role="dialog"
          aria-modal="true"
          onClick={closeNewLessonModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 id="new-lesson-modal" className="text-lg font-semibold leading-6 text-gray-dark">
                      Nouvelle leçon
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="lesson-type" className="block text-sm font-medium text-gray-dark">
                            Type de leçon
                          </label>
                          <select
                            id="lesson-type"
                            value={newLessonType}
                            onChange={(e) => setNewLessonType(e.target.value as EventTypeKey)}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          >
                            {Object.entries(eventTypes).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-dark">
                            Moniteur
                          </label>
                          <select
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          >
                            {instructors.map((instructor) => (
                              <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {newLessonType === 'practical' && (
                          <>
                            <div>
                              <label htmlFor="student" className="block text-sm font-medium text-gray-dark">
                                Élève
                              </label>
                              <input
                                type="text"
                                id="student"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Nom de l'élève"
                              />
                            </div>

                            <div>
                              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-dark">
                                Véhicule
                              </label>
                              <input
                                type="text"
                                id="vehicle"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Ex: Peugeot 208 - AB-123-CD"
                              />
                            </div>
                          </>
                        )}

                        {newLessonType === 'theory' && (
                          <div>
                            <label htmlFor="students" className="block text-sm font-medium text-gray-dark">
                              Élèves
                            </label>
                            <textarea
                              id="students"
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              placeholder="Liste des élèves (un par ligne)"
                            />
                          </div>
                        )}

                        {newLessonType === 'exam' && (
                          <>
                            <div>
                              <label htmlFor="exam-student" className="block text-sm font-medium text-gray-dark">
                                Élève
                              </label>
                              <input
                                type="text"
                                id="exam-student"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Nom de l'élève"
                              />
                            </div>

                            <div>
                              <label htmlFor="exam-type" className="block text-sm font-medium text-gray-dark">
                                Type d'examen
                              </label>
                              <input
                                type="text"
                                id="exam-type"
                                className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                                placeholder="Ex: Permis B"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-dark">
                            Date et heure
                          </label>
                          <input
                            type="datetime-local"
                            id="date"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-dark">
                            Durée (minutes)
                          </label>
                          <input
                            type="number"
                            id="duration"
                            min="30"
                            step="30"
                            defaultValue="60"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-gray-dark focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:col-start-2"
                    onClick={closeNewLessonModal}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-dark shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
                    onClick={closeNewLessonModal}
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
