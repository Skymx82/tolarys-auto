'use client';

import { useState, useEffect } from 'react';
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
  TruckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase';

// Types
type ExamType = 'code' | 'practical';
type ExamStatus = 'upcoming' | 'passed' | 'failed';
type FilterType = 'all' | 'upcoming' | 'passed' | 'failed' | 'code' | 'practical';

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
  phone: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
}

// Types pour la base de données
interface DbExam {
  id: string;
  student: Student;
  instructor: Instructor;
  date: string;
  time: string;
  type: 'code' | 'practical';
  status: 'scheduled' | 'completed' | 'cancelled';
  result?: 'success' | 'fail';
  location?: string;
  score?: string;
  feedback?: string;
  notes?: string;
  student_id: string;
  instructor_id: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license_plate?: string;
}

// Labels et couleurs pour l'interface
const examTypeLabels: Record<string, string> = {
  'code': 'Examen Code',
  'practical': 'Examen Pratique'
};

const statusLabels: Record<string, string> = {
  'scheduled': 'Planifié',
  'completed': 'Terminé',
  'cancelled': 'Annulé'
};

const statusColors: Record<string, string> = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800'
};

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedExam, setSelectedExam] = useState<DbExam | null>(null);
  const [showNewExamModal, setShowNewExamModal] = useState<boolean>(false);
  const [showExamDetailsModal, setShowExamDetailsModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la base de données
  const [dbExams, setDbExams] = useState<DbExam[]>([]);
  const [dbInstructors, setDbInstructors] = useState<Instructor[]>([]);
  const [dbStudents, setDbStudents] = useState<Student[]>([]);
  const [dbVehicles, setDbVehicles] = useState<Vehicle[]>([]);
  const [newExam, setNewExam] = useState<{
    type: 'code' | 'practical';
    status: 'scheduled';
    studentId?: string;
    instructorId?: string;
    vehicleId?: string;
    date?: string;
    time?: string;
    location?: string;
  }>({
    type: 'code',
    status: 'scheduled'
  });

  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Récupérer l'auto-école de l'utilisateur connecté
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
          throw userError;
        }
        console.log('Utilisateur récupéré:', user);

        const { data: autoEcole, error: autoEcoleError } = await supabase
          .from('auto_ecoles')
          .select('id')
          .eq('user_id', user?.id)
          .single();

        if (autoEcoleError) {
          console.error('Erreur lors de la récupération de l\'auto-école:', autoEcoleError);
          throw autoEcoleError;
        }
        console.log('Auto-école récupérée:', autoEcole);
        
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
        console.log('Véhicules récupérés:', vehiclesData);

        const formattedVehicles = vehiclesData?.map(vehicle => ({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          license_plate: vehicle.license_plate
        })) || [];

        setDbVehicles(formattedVehicles);

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
        console.log('Étudiants récupérés:', studentsData);

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
        console.log('Moniteurs récupérés:', instructorsData);

        // Récupérer les examens
        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select(`
            id,
            type,
            status,
            date,
            time,
            location,
            result,
            score,
            feedback,
            notes,
            student_id,
            instructor_id,
            vehicle_brand,
            vehicle_model,
            vehicle_license_plate
          `)
          .eq('auto_ecole_id', autoEcole.id)
          .order('date', { ascending: true });

        if (examsError) {
          console.error('Erreur lors de la récupération des examens:', examsError);
          throw examsError;
        }
        console.log('Examens récupérés:', examsData);

        // Transformer les données des moniteurs
        const formattedInstructors = (instructorsData || []).map(instructor => ({
          id: instructor.id,
          nom: instructor.nom,
          prenom: instructor.prenom,
          email: instructor.email,
          phone: instructor.telephone
        }));

        // Créer un map pour un accès rapide aux étudiants et moniteurs
        const studentsMap = new Map(studentsData?.map(s => [s.id, s]));
        const instructorsMap = new Map(formattedInstructors?.map(i => [i.id, i]));

        // Formater les examens avec les données complètes des étudiants et moniteurs
        const formattedExams = (examsData || []).map(exam => {
          const student = studentsMap.get(exam.student_id);
          const instructor = instructorsMap.get(exam.instructor_id);
          
          if (!student || !instructor) return null;

          return {
            id: exam.id,
            student,
            instructor,
            date: exam.date,
            time: exam.time,
            type: exam.type as 'code' | 'practical',
            status: exam.status as 'scheduled' | 'completed' | 'cancelled',
            result: exam.result as 'success' | 'fail' | undefined,
            location: exam.location,
            score: exam.score,
            feedback: exam.feedback,
            notes: exam.notes,
            student_id: exam.student_id,
            instructor_id: exam.instructor_id,
            vehicle_brand: exam.vehicle_brand,
            vehicle_model: exam.vehicle_model,
            vehicle_license_plate: exam.vehicle_license_plate
          } as DbExam;
        }).filter((exam): exam is DbExam => exam !== null);

        setDbStudents(studentsData || []);
        setDbInstructors(formattedInstructors);
        setDbExams(formattedExams);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchExamsData();
  }, []);

  const handleCreateExam = async () => {
    try {
      if (!newExam.studentId || !newExam.instructorId || !newExam.date || !newExam.time) {
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

      const selectedVehicle = newExam.type === 'practical' && newExam.vehicleId ? 
        dbVehicles.find(v => v.id === newExam.vehicleId) : null;

      // Créer l'examen
      const { data: newExamData, error: createError } = await supabase
        .from('exams')
        .insert({
          auto_ecole_id: autoEcole.id,
          student_id: newExam.studentId,
          instructor_id: newExam.instructorId,
          type: newExam.type,
          status: 'scheduled',
          date: newExam.date,
          time: newExam.time,
          location: newExam.location || null,
          vehicle_brand: selectedVehicle?.brand || null,
          vehicle_model: selectedVehicle?.model || null,
          vehicle_license_plate: selectedVehicle?.license_plate || null
        })
        .select()
        .single();

      if (createError) throw createError;

      // Ajouter l'examen créé à la liste locale
      const student = dbStudents.find(s => s.id === newExam.studentId);
      const instructor = dbInstructors.find(i => i.id === newExam.instructorId);

      if (student && instructor) {
        setDbExams([...dbExams, {
          ...newExamData,
          student: student,
          instructor: instructor,
          vehicle_brand: selectedVehicle?.brand || null,
          vehicle_model: selectedVehicle?.model || null,
          vehicle_license_plate: selectedVehicle?.license_plate || null
        }]);
      }

      setShowNewExamModal(false);
      setNewExam({
        type: 'code',
        status: 'scheduled'
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création de l\'examen');
    }
  };

  const handleUpdateExam = async (examId: string, updates: Partial<DbExam>) => {
    try {
      // TODO: Implémenter la mise à jour de l'examen dans la base de données
      // const { error } = await supabase
      //   .from('exams')
      //   .update(updates)
      //   .eq('id', examId);

      // if (error) throw error;
      
      // Rafraîchir les données
      // fetchExamsData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour de l\'examen');
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      // TODO: Implémenter la suppression de l'examen dans la base de données
      // const { error } = await supabase
      //   .from('exams')
      //   .delete()
      //   .eq('id', examId);

      // if (error) throw error;
      
      // Rafraîchir les données
      // fetchExamsData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'examen');
    }
  };

  const handleCloseNewExamModal = () => {
    setShowNewExamModal(false);
    setNewExam({
      type: 'code',
      status: 'scheduled'
    });
    setError(null);
  };

  const handleExamClick = (exam: DbExam) => {
    setSelectedExam(exam);
    setShowExamDetailsModal(true);
  };

  const handleCloseExamDetailsModal = () => {
    setShowExamDetailsModal(false);
    setSelectedExam(null);
  };

  const filteredExams = dbExams.filter(exam => {
    // Filtre de recherche par nom d'étudiant
    const matchesSearch = exam.student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exam.student.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par type et statut
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'upcoming':
        matchesFilter = exam.status === 'scheduled';
        break;
      case 'passed':
        matchesFilter = exam.status === 'completed' && exam.result === 'success';
        break;
      case 'failed':
        matchesFilter = exam.status === 'completed' && exam.result === 'fail';
        break;
      case 'code':
        matchesFilter = exam.type === 'code';
        break;
      case 'practical':
        matchesFilter = exam.type === 'practical';
        break;
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">{error}</div>
    );
  }

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
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
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
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : dbExams.length === 0 ? (
              <div className="text-center text-gray-500">Aucun examen trouvé</div>
            ) : (
              <ul role="list" className="divide-y divide-gray-100">
                {filteredExams.map((exam) => (
                  <li
                    key={exam.id}
                    className="flex justify-between gap-x-6 py-5 px-4 cursor-pointer hover:bg-gray-50 sm:px-6"
                    onClick={() => handleExamClick(exam)}
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6 text-gray-900">
                          {exam.student.first_name} {exam.student.last_name}
                        </p>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {exam.student.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm leading-6 text-gray-900">
                        {exam.date} à {exam.time}
                      </p>
                      <div className="mt-1 flex items-center gap-x-1.5">
                        <div className={`flex-none rounded-full p-1 ${statusColors[exam.status]}`}>
                          <div className="h-1.5 w-1.5 rounded-full bg-current" />
                        </div>
                        <p className="text-xs leading-5 text-gray-500">
                          {statusLabels[exam.status]}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création d'un nouvel examen */}
      {showNewExamModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="modal-title"
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
                    <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                      Nouvel examen
                    </h3>
                    <div className="mt-2">
                      <form className="space-y-4">
                        {/* Type d'examen */}
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type d'examen
                          </label>
                          <select
                            id="type"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            value={newExam.type || 'code'}
                            onChange={(e) => setNewExam({ ...newExam, type: e.target.value as 'code' | 'practical' })}
                          >
                            <option value="code">Code</option>
                            <option value="practical">Pratique</option>
                          </select>
                        </div>

                        {/* Étudiant */}
                        <div>
                          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                            Étudiant
                          </label>
                          <select
                            id="student"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            value={newExam.studentId || ''}
                            onChange={(e) => setNewExam({ ...newExam, studentId: e.target.value })}
                          >
                            <option value="">Sélectionner un étudiant</option>
                            {dbStudents.map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.first_name} {student.last_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Moniteur */}
                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                            Moniteur
                          </label>
                          <select
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            value={newExam.instructorId || ''}
                            onChange={(e) => setNewExam({ ...newExam, instructorId: e.target.value })}
                          >
                            <option value="">Sélectionner un moniteur</option>
                            {dbInstructors.map((instructor) => (
                              <option key={instructor.id} value={instructor.id}>
                                {instructor.prenom} {instructor.nom}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Véhicule (uniquement pour les examens pratiques) */}
                        {newExam.type === 'practical' && (
                          <div>
                            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                              Véhicule
                            </label>
                            <select
                              id="vehicle"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              value={newExam.vehicleId || ''}
                              onChange={(e) => setNewExam({ ...newExam, vehicleId: e.target.value })}
                            >
                              <option value="">Sélectionner un véhicule</option>
                              {dbVehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Date et heure */}
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                              Date
                            </label>
                            <input
                              type="date"
                              id="date"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              value={newExam.date || ''}
                              onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                            />
                          </div>
                          <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                              Heure
                            </label>
                            <input
                              type="time"
                              id="time"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                              value={newExam.time || ''}
                              onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Lieu */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Lieu
                          </label>
                          <input
                            type="text"
                            id="location"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                            value={newExam.location || ''}
                            onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                            placeholder="Centre d'examen..."
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none"
                    onClick={handleCreateExam}
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
                {error && (
                  <div className="mt-3 text-sm text-red-600 text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal des détails de l'examen */}
      {showExamDetailsModal && selectedExam && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="exam-details-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseExamDetailsModal}
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
                            <p className="text-sm text-gray-900">{selectedExam.student.first_name} {selectedExam.student.last_name}</p>
                            <p className="text-sm text-gray-500">{selectedExam.student.email}</p>
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
                        {selectedExam.location && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Lieu</h4>
                            <div className="mt-1 flex items-center">
                              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{selectedExam.location}</span>
                            </div>
                          </div>
                        )}

                        {/* Moniteur */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Moniteur</h4>
                          <div className="mt-1 flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedExam.instructor.prenom} {selectedExam.instructor.nom}</span>
                          </div>
                        </div>

                        {/* Véhicule (si examen pratique) */}
                        {selectedExam.type === 'practical' && selectedExam.vehicle_brand && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Véhicule</h4>
                            <div className="mt-1 flex items-center">
                              <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {selectedExam.vehicle_brand} {selectedExam.vehicle_model} - {selectedExam.vehicle_license_plate}
                              </span>
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

                        {/* Feedback */}
                        {selectedExam.feedback && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Commentaires</h4>
                            <div className="mt-1">
                              <p className="text-sm text-gray-900">{selectedExam.feedback}</p>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {selectedExam.notes && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                            <div className="mt-1">
                              <p className="text-sm text-gray-900">{selectedExam.notes}</p>
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none"
                    onClick={handleCloseExamDetailsModal}
                  >
                    Fermer
                  </button>
                  {selectedExam.status === 'scheduled' && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={handleCloseExamDetailsModal}
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
    </div>
  );
}