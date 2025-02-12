'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import frLocale from '@fullcalendar/core/locales/fr';
import { PlusIcon } from '@heroicons/react/24/outline';
import './styles.css';
import { 
  DbLesson, 
  DbInstructor, 
  DbVehicle, 
  DbStudent,
  CalendarEvent,
  PlanningFilters,
  PlanningStats 
} from './types';


export default function PlanningPage() {
  // États pour les données
  const [lessons, setLessons] = useState<DbLesson[]>([]);
  const [instructors, setInstructors] = useState<DbInstructor[]>([]);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [students, setStudents] = useState<DbStudent[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<PlanningStats | null>(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState<PlanningFilters>({
    date: new Date(),
    view: 'week',
    instructors: [],
    vehicles: [],
    lessonTypes: ['driving', 'theory'],
    status: ['confirmed', 'pending']
  });

  // États pour l'UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchPlanningData();
  }, []);

  // Fonction pour charger les données
  const fetchPlanningData = async () => {
    try {
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour convertir les leçons en événements du calendrier
  const convertToCalendarEvents = (lessons: DbLesson[]): CalendarEvent[] => {
    return lessons.map(lesson => ({
      id: lesson.id,
      title: `${lesson.type === 'driving' ? 'Conduite' : 'Code'} - ${lesson.student_name}`,
      start: new Date(lesson.start_time),
      end: new Date(lesson.end_time),
      groupId: lesson.instructor_id, // Utiliser l'ID de l'instructeur comme groupId
      color: lesson.color || (lesson.type === 'driving' ? '#E91E63' : '#2196F3'),
      status: lesson.status,
      type: lesson.type,
      student: {
        id: lesson.student_id,
        name: lesson.student_name
      },
      instructor: {
        id: lesson.instructor_id,
        name: lesson.instructor_name
      },
      vehicle: lesson.vehicle_id ? {
        id: lesson.vehicle_id,
        name: lesson.vehicle_name || ''
      } : undefined,
      location: lesson.location,
      notes: lesson.notes,
      extendedProps: {
        instructorName: lesson.instructor_name,
        vehicleName: lesson.vehicle_name
      }
    }));
  };

  // Gestionnaires d'événements
  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };

  const handleNewLesson = async (lessonData: Partial<DbLesson>) => {
    try {
      // TODO: Implémenter la création de leçon dans la base de données
      closeNewLessonModal();
      await fetchPlanningData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de la leçon');
    }
  };

  const closeNewLessonModal = () => {
    setShowNewLessonModal(false);
  };

  const closeEventDetailsModal = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête avec filtres et statistiques */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Planning</h1>
          <button
            onClick={() => setShowNewLessonModal(true)}
            className="px-4 py-2 bg-[#E91E63] text-white rounded-lg hover:bg-[#D81B60] transition-colors"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-2" />
            Nouvelle leçon
          </button>
        </div>

        {/* Filtres */}
        <div className="mt-4 flex gap-4">
          {/* TODO: Ajouter les filtres */}
        </div>

        {/* Statistiques */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODO: Ajouter les statistiques */}
        </div>
      </div>

      {/* Calendrier */}
      <div className="bg-white rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,dayGridMonth,listWeek'
          }}
          locale={frLocale}
          events={calendarEvents}
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
          eventContent={renderEventContent}
          eventGroupSet={instructors.map(instructor => ({
            groupId: instructor.id,
            title: `${instructor.first_name} ${instructor.last_name}`
          }))}
        />
      </div>

      {/* Modals */}
      {showEventDetails && selectedEvent && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={closeEventDetailsModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 
                      className="text-lg font-semibold leading-6 text-gray-900"
                      id="modal-title"
                    >
                      {selectedEvent.title}
                    </h3>
                    <div className="mt-4 text-left space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(selectedEvent.start).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Horaire:</span>{' '}
                        {new Date(selectedEvent.start).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(selectedEvent.end).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Type:</span>{' '}
                        {selectedEvent.extendedProps.type === 'driving' ? 'Leçon de conduite' : 'Cours de code'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Moniteur:</span>{' '}
                        {selectedEvent.extendedProps.instructorName}
                      </p>
                      {selectedEvent.extendedProps.vehicleName && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Véhicule:</span>{' '}
                          {selectedEvent.extendedProps.vehicleName}
                        </p>
                      )}
                      {selectedEvent.extendedProps.location && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Lieu:</span>{' '}
                          {selectedEvent.extendedProps.location}
                        </p>
                      )}
                      {selectedEvent.extendedProps.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Notes:</span>{' '}
                          {selectedEvent.extendedProps.notes}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Statut:</span>{' '}
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          selectedEvent.extendedProps.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedEvent.extendedProps.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#E91E63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63] sm:col-start-2"
                    onClick={() => {
                      // TODO: Implémenter la modification
                      closeEventDetailsModal();
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
                    onClick={closeEventDetailsModal}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Leçon */}
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
                    <h3 
                      className="text-lg font-semibold leading-6 text-gray-900"
                      id="new-lesson-modal"
                    >
                      Nouvelle leçon
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Type de leçon */}
                        <div>
                          <label htmlFor="lesson-type" className="block text-sm font-medium text-gray-700">
                            Type de leçon
                          </label>
                          <select
                            id="lesson-type"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                          >
                            <option value="driving">Leçon de conduite</option>
                            <option value="theory">Cours de code</option>
                          </select>
                        </div>

                        {/* Moniteur */}
                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                            Moniteur
                          </label>
                          <select
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                          >
                            {instructors.map(instructor => (
                              <option key={instructor.id} value={instructor.id}>
                                {instructor.first_name} {instructor.last_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Élève */}
                        <div>
                          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                            Élève
                          </label>
                          <select
                            id="student"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                          >
                            {students.map(student => (
                              <option key={student.id} value={student.id}>
                                {student.first_name} {student.last_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Véhicule */}
                        <div>
                          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                            Véhicule
                          </label>
                          <select
                            id="vehicle"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                          >
                            {vehicles.map(vehicle => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.name} ({vehicle.license_plate})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Date et heure */}
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Date et heure de début
                          </label>
                          <input
                            type="datetime-local"
                            id="date"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                          />
                        </div>

                        {/* Durée */}
                        <div>
                          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                            Durée (minutes)
                          </label>
                          <select
                            id="duration"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                            defaultValue="60"
                          >
                            <option value="30">30 minutes</option>
                            <option value="60">1 heure</option>
                            <option value="90">1 heure 30</option>
                            <option value="120">2 heures</option>
                          </select>
                        </div>

                        {/* Lieu */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Lieu
                          </label>
                          <input
                            type="text"
                            id="location"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                            placeholder="Ex: 123 rue de la Paix"
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            id="notes"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 text-base focus:border-[#E91E63] focus:outline-none focus:ring-[#E91E63] sm:text-sm"
                            placeholder="Notes additionnelles..."
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#E91E63] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#D81B60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63] sm:col-start-2"
                    onClick={() => {
                      // TODO: Implémenter la création
                      closeNewLessonModal();
                    }}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-1 sm:mt-0"
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

// Fonction pour personnaliser l'affichage des événements
function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      <div className="text-xs">
        {eventInfo.event.extendedProps.instructorName}
        {eventInfo.event.extendedProps.vehicleName && ` - ${eventInfo.event.extendedProps.vehicleName}`}
      </div>
    </>
  );
}
