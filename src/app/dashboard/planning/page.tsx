'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { 
  PlusIcon,
  XMarkIcon,
  UserIcon,
  ClockIcon,
  AcademicCapIcon,
  TruckIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Types pour les entités
interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Instructor {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

// Types pour la base de données
interface DbLesson {
  id: string;
  auto_ecole_id: string;
  student_id: string;
  instructor_id: string;
  vehicle_id?: string | null;
  start_time: string;
  end_time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string | null;
  notes?: string | null;
}

interface Lesson extends DbLesson {
  student: Student | null;
  instructor: Instructor | null;
  vehicle: Vehicle | null;
}

export default function PlanningPage() {
  // États
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);
  const [showLessonDetailsModal, setShowLessonDetailsModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const calendarRef = useRef(null);

  // État pour le nouveau cours
  const [newLesson, setNewLesson] = useState({
    student_id: '',
    instructor_id: '',
    vehicle_id: '',
    start_time: '',
    duration: 60, // durée par défaut en minutes
    location: '',
    notes: ''
  });

  // Tableau de couleurs pour les moniteurs
  const instructorColors = [
    { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
    { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  ];

  // Map pour stocker les couleurs attribuées à chaque moniteur
  const [instructorColorMap, setInstructorColorMap] = useState<Map<string, typeof instructorColors[0]>>(new Map());

  // Fonction pour obtenir la couleur d'un moniteur
  const getInstructorColor = (instructorId: string) => {
    if (!instructorColorMap.has(instructorId)) {
      const colorIndex = instructorColorMap.size % instructorColors.length;
      const newColorMap = new Map(instructorColorMap);
      newColorMap.set(instructorId, instructorColors[colorIndex]);
      setInstructorColorMap(newColorMap);
      return instructorColors[colorIndex];
    }
    return instructorColorMap.get(instructorId);
  };

  // Fonction pour formater les leçons pour le calendrier
  const formatLessonsForCalendar = (lessons: Lesson[]) => {
    return lessons.map(lesson => ({
      id: lesson.id,
      title: `${lesson.student?.first_name || 'N/A'} ${lesson.student?.last_name || ''} avec ${lesson.instructor?.prenom || 'N/A'}`,
      start: lesson.start_time,
      end: lesson.end_time,
      extendedProps: {
        student: lesson.student || null,
        instructor: lesson.instructor || null,
        vehicle: lesson.vehicle || null,
        status: lesson.status,
        location: lesson.location || null
      }
    }));
  };

  // Fonction pour filtrer les leçons par moniteur
  const getFilteredLessons = () => {
    if (!selectedInstructorId) return lessons;
    return lessons.filter(lesson => lesson.instructor_id === selectedInstructorId);
  };

  const handleCreateLesson = async () => {
    try {
      if (!newLesson.student_id || !newLesson.instructor_id || !newLesson.start_time || !newLesson.duration) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const supabase = createClient();

      // Récupérer l'auto-école de l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;

      const { data: autoEcole, error: autoEcoleError } = await supabase
        .from('auto_ecoles')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (autoEcoleError) throw autoEcoleError;

      // Calculer l'heure de fin
      const startDateTime = new Date(newLesson.start_time);
      const endDateTime = new Date(startDateTime.getTime() + newLesson.duration * 60000);

      // Créer la leçon
      const { data: newLessonData, error: createError } = await supabase
        .from('lessons')
        .insert({
          auto_ecole_id: autoEcole.id,
          student_id: newLesson.student_id,
          instructor_id: newLesson.instructor_id,
          vehicle_id: newLesson.vehicle_id || null,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          duration: newLesson.duration,
          status: 'scheduled',
          location: newLesson.location || null,
          notes: newLesson.notes || null
        })
        .select()
        .single();

      if (createError) {
        console.error('Erreur lors de la création de la leçon:', createError);
        throw createError;
      }

      console.log('Nouvelle leçon créée:', newLessonData);

      // Fermer le modal et réinitialiser les champs
      setShowNewLessonModal(false);
      setNewLesson({
        student_id: '',
        instructor_id: '',
        vehicle_id: '',
        start_time: '',
        duration: 60,
        location: '',
        notes: ''
      });

      // Rafraîchir la liste des leçons
      const student = students.find(s => s.id === newLesson.student_id);
      const instructor = instructors.find(i => i.id === newLesson.instructor_id);
      const vehicle = vehicles.find(v => v.id === newLesson.vehicle_id);

      if (student && instructor) {
        const formattedLesson = {
          ...newLessonData,
          student,
          instructor,
          vehicle: vehicle || null
        };
        setLessons([...lessons, formattedLesson]);
      }
      
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création de la leçon');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (deleteError) throw deleteError;

      // Mettre à jour la liste des leçons
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      setShowLessonDetailsModal(false);
      setSelectedLesson(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de la leçon');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Récupérer l'auto-école de l'utilisateur connecté
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
          throw userError;
        }

        const { data: autoEcole, error: autoEcoleError } = await supabase
          .from('auto_ecoles')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (autoEcoleError) {
          console.error('Erreur lors de la récupération de l\'auto-école:', autoEcoleError);
          throw autoEcoleError;
        }

        // Récupérer les moniteurs
        const { data: instructorsData, error: instructorsError } = await supabase
          .from('moniteurs')
          .select('id, nom, prenom, email, telephone')
          .eq('statut', 'actif')
          .eq('auto_ecole_id', autoEcole.id);

        if (instructorsError) {
          console.error('Erreur lors de la récupération des moniteurs:', instructorsError);
          throw instructorsError;
        }

        // Formater les données des moniteurs
        const formattedInstructors = instructorsData.map(instructor => ({
          id: instructor.id,
          nom: instructor.nom,
          prenom: instructor.prenom,
          email: instructor.email,
          telephone: instructor.telephone
        }));

        setInstructors(formattedInstructors);

        // Récupérer les étudiants
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('id, first_name, last_name, email, phone')
          .eq('statut', 'actif')
          .eq('auto_ecole_id', autoEcole.id);

        if (studentsError) {
          console.error('Erreur lors de la récupération des étudiants:', studentsError);
          throw studentsError;
        }

        setStudents(studentsData || []);

        // Récupérer les véhicules
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id, brand, model, license_plate')
          .eq('auto_ecole_id', autoEcole.id)
          .eq('status', 'active');

        if (vehiclesError) {
          console.error('Erreur lors de la récupération des véhicules:', vehiclesError);
          throw vehiclesError;
        }

        const formattedVehicles = vehiclesData?.map(vehicle => ({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          license_plate: vehicle.license_plate
        })) || [];

        setVehicles(formattedVehicles);

        // Récupérer les leçons avec les relations
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            id,
            auto_ecole_id,
            student_id,
            instructor_id,
            vehicle_id,
            start_time,
            end_time,
            duration,
            status,
            location,
            notes
          `)
          .eq('auto_ecole_id', autoEcole.id)
          .order('start_time', { ascending: true });

        if (lessonsError) {
          console.error('Erreur lors de la récupération des leçons:', lessonsError);
          throw lessonsError;
        }

        // Formater les leçons avec les informations complètes
        const formattedLessons = (lessonsData || []).map((lesson: DbLesson) => {
          const student = studentsData?.find(s => s.id === lesson.student_id) || null;
          const instructor = instructorsData?.find(i => i.id === lesson.instructor_id) || null;
          const vehicle = vehiclesData?.find(v => v.id === lesson.vehicle_id) || null;

          return {
            ...lesson,
            student,
            instructor,
            vehicle
          };
        });

        setLessons(formattedLessons);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Planning des leçons</h1>
          <div className="flex items-center space-x-4">
            {/* Filtre par moniteur */}
            <div className="min-w-[200px]">
              <select
                value={selectedInstructorId}
                onChange={(e) => setSelectedInstructorId(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Tous les moniteurs</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.prenom} {instructor.nom}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={() => setShowNewLessonModal(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle leçon
            </button>
          </div>
        </div>

        {/* Calendrier */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            slotMinTime="07:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            events={formatLessonsForCalendar(getFilteredLessons())}
            eventOverlap={false}
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              const student = event.extendedProps.student;
              const instructor = event.extendedProps.instructor;
              if (!event.end || !event.start) return; // Add safety check for both event.end and event.start
              const duration = event.end.getTime() - event.start.getTime();
              const durationMinutes = duration / (1000 * 60);
              
              const colors = getInstructorColor(instructor.id);
              if (!colors || !colors.border || !colors.bg || !colors.text) return; // Add safety check for colors
              
              // Style commun pour tous les événements
              const commonClasses = `w-full h-full flex items-center justify-center border-l-4 ${colors.border} ${colors.bg} ${colors.text} overflow-hidden whitespace-nowrap`;
              
              // Si la durée est de 30 minutes ou moins
              if (durationMinutes <= 30) {
                return (
                  <div className={`${commonClasses} text-[10px] py-0 px-1`}>
                    <div className="font-medium truncate text-center">
                      {student?.first_name?.charAt(0)}. {student?.last_name?.charAt(0)}.
                    </div>
                  </div>
                );
              }

              // Pour les leçons plus longues
              return (
                <div className={`${commonClasses} text-xs py-0.5 px-1`}>
                  <div className="font-medium truncate text-center">
                    {student?.first_name} {student?.last_name?.charAt(0)}.
                  </div>
                </div>
              );
            }}
            eventClassNames="!bg-transparent hover:!bg-gray-50 !p-0 overflow-visible"
            slotEventOverlap={false}
            slotLaneClassNames="!h-8"
            dayMaxEvents={false}
            locale={frLocale}
            height="auto"
            expandRows={true}
            stickyHeaderDates={true}
            nowIndicator={true}
            eventClick={(info) => {
              const lesson = lessons.find(l => l.id === info.event.id);
              if (lesson) {
                setSelectedLesson(lesson);
                setShowLessonDetailsModal(true);
              }
            }}
          />
        </div>

        {/* Modal de création de leçon */}
        {showNewLessonModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Nouvelle leçon</h2>
                  <button
                    onClick={() => setShowNewLessonModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateLesson();
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Élève */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Élève</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.student_id}
                        onChange={(e) => setNewLesson({ ...newLesson, student_id: e.target.value })}
                      >
                        <option value="">Sélectionner un élève</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Moniteur */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Moniteur</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.instructor_id}
                        onChange={(e) => setNewLesson({ ...newLesson, instructor_id: e.target.value })}
                      >
                        <option value="">Sélectionner un moniteur</option>
                        {instructors.map((instructor) => (
                          <option key={instructor.id} value={instructor.id}>
                            {instructor.prenom} {instructor.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date et Heure */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
                      <input
                        type="datetime-local"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.start_time}
                        onChange={(e) => setNewLesson({ ...newLesson, start_time: e.target.value })}
                      />
                    </div>

                    {/* Durée */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.duration}
                        onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="90">1 heure 30</option>
                        <option value="120">2 heures</option>
                      </select>
                    </div>

                    {/* Véhicule */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.vehicle_id}
                        onChange={(e) => setNewLesson({ ...newLesson, vehicle_id: e.target.value })}
                      >
                        <option value="">Sélectionner un véhicule</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lieu de RDV */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de rendez-vous</label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newLesson.location}
                        onChange={(e) => setNewLesson({ ...newLesson, location: e.target.value })}
                        placeholder="Adresse du point de rendez-vous"
                      />
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewLessonModal(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    >
                      Créer la leçon
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails de la leçon */}
        {showLessonDetailsModal && selectedLesson && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute right-0 top-0 pr-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLessonDetailsModal(false);
                        setSelectedLesson(null);
                      }}
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                        Détails de la leçon
                      </h3>
                      
                      <div className="mt-4 space-y-4">
                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <UserIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">Élève:</span>
                          </div>
                          <p className="text-gray-900 ml-7">
                            {selectedLesson.student?.first_name} {selectedLesson.student?.last_name}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <AcademicCapIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">Moniteur:</span>
                          </div>
                          <p className="text-gray-900 ml-7">
                            {selectedLesson.instructor?.prenom} {selectedLesson.instructor?.nom}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <ClockIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">Horaires:</span>
                          </div>
                          <p className="text-gray-900 ml-7">
                            {new Date(selectedLesson.start_time).toLocaleString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {' - '}
                            {new Date(selectedLesson.end_time).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        {selectedLesson.vehicle && (
                          <div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <TruckIcon className="h-5 w-5 mr-2" />
                              <span className="font-medium">Véhicule:</span>
                            </div>
                            <p className="text-gray-900 ml-7">
                              {selectedLesson.vehicle.brand} {selectedLesson.vehicle.model} - {selectedLesson.vehicle.license_plate}
                            </p>
                          </div>
                        )}

                        {selectedLesson.location && (
                          <div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPinIcon className="h-5 w-5 mr-2" />
                              <span className="font-medium">Lieu de RDV:</span>
                            </div>
                            <p className="text-gray-900 ml-7">{selectedLesson.location}</p>
                          </div>
                        )}

                        {selectedLesson.notes && (
                          <div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <span className="font-medium">Notes:</span>
                            </div>
                            <p className="text-gray-900 ml-7">{selectedLesson.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowLessonDetailsModal(false);
                            setSelectedLesson(null);
                          }}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Fermer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedLesson) {
                              handleDeleteLesson(selectedLesson.id);
                            }
                          }}
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
