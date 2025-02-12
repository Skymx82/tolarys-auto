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

// Types
type ExamType = 'code' | 'practical';
type ExamStatus = 'upcoming' | 'passed' | 'failed';
type FilterType = 'all' | 'upcoming' | 'passed' | 'failed' | 'code' | 'practical';

// Types pour les entités
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Vehicle {
  id: string;
  name: string;
  plate: string;
}

// Données de test temporaires
const testStudent: Student = {
  id: "S001",
  name: "Jean Dupont",
  email: "jean.dupont@email.com",
  phone: "06 12 34 56 78"
};

const testInstructor: Instructor = {
  id: "I001",
  name: "Marie Martin",
  email: "marie.martin@auto-ecole.com",
  phone: "06 98 76 54 32"
};

const testVehicle: Vehicle = {
  id: "V001",
  name: "Peugeot 208",
  plate: "AA-123-BB"
};

const testExam: DbExam = {
  id: "E001",
  student: testStudent,
  instructor: testInstructor,
  vehicle: testVehicle,
  date: "2025-02-15",
  time: "14:30",
  type: "practical",
  status: "scheduled",
  location: "Centre d'examen Paris 15"
};

// Types pour la base de données
interface DbExam {
  id: string;
  student: Student;
  instructor: Instructor;
  vehicle?: Vehicle;
  date: string;
  time: string;
  type: 'code' | 'practical';
  status: 'scheduled' | 'completed' | 'cancelled';
  result?: 'success' | 'fail';
  notes?: string;
  location?: string;
  score?: string;
  feedback?: string;
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
        // TODO: Remplacer par les appels à la base de données
        // const { data: examsData, error: examsError } = await supabase
        //   .from('exams')
        //   .select('*, student:students(*), instructor:instructors(*), vehicle:vehicles(*)');
        
        // const { data: instructorsData } = await supabase
        //   .from('instructors')
        //   .select('*');
        
        // const { data: studentsData } = await supabase
        //   .from('students')
        //   .select('*');
        
        // const { data: vehiclesData } = await supabase
        //   .from('vehicles')
        //   .select('*');

        // Pour l'instant, on utilise les données de test
        setDbExams([testExam]);
        setDbInstructors([testInstructor]);
        setDbStudents([testStudent]);
        setDbVehicles([testVehicle]);
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
      // Vérifier que tous les champs requis sont remplis
      if (!newExam.studentId || !newExam.instructorId || !newExam.date || !newExam.time) {
        setError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Trouver les objets complets
      const student = dbStudents.find(s => s.id === newExam.studentId);
      const instructor = dbInstructors.find(i => i.id === newExam.instructorId);
      const vehicle = newExam.vehicleId ? dbVehicles.find(v => v.id === newExam.vehicleId) : undefined;

      if (!student || !instructor) {
        setError('Étudiant ou instructeur non trouvé');
        return;
      }

      if (newExam.type === 'practical' && !vehicle) {
        setError('Véhicule requis pour un examen pratique');
        return;
      }

      const examToCreate: DbExam = {
        id: `E${Date.now()}`, // Temporaire, sera généré par la base de données
        student,
        instructor,
        vehicle,
        date: newExam.date,
        time: newExam.time,
        type: newExam.type,
        status: 'scheduled',
        location: newExam.location
      };

      // TODO: Implémenter la création de l'examen dans la base de données
      // const { data, error } = await supabase.from('exams').insert([examToCreate]);

      // Pour l'instant, on ajoute juste à notre état local
      setDbExams([...dbExams, examToCreate]);
      
      handleCloseNewExamModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création de l\'examen');
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
    const matchesSearch = exam.student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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
            value="all"
            onChange={(e) => console.log(e.target.value)}
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
                          {exam.student.name}
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
                          <label htmlFor="exam-type" className="block text-sm font-medium text-gray-700">
                            Type d'examen
                          </label>
                          <select
                            id="exam-type"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newExam.type}
                            onChange={(e) => setNewExam({ ...newExam, type: e.target.value as 'code' | 'practical' })}
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
                          <select
                            id="student"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newExam.studentId || ''}
                            onChange={(e) => setNewExam({ ...newExam, studentId: e.target.value })}
                          >
                            <option value="">Sélectionner un étudiant</option>
                            {dbStudents.map((student) => (
                              <option key={student.id} value={student.id}>
                                {student.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Instructeur */}
                        <div>
                          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                            Instructeur
                          </label>
                          <select
                            id="instructor"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newExam.instructorId || ''}
                            onChange={(e) => setNewExam({ ...newExam, instructorId: e.target.value })}
                          >
                            <option value="">Sélectionner un instructeur</option>
                            {dbInstructors.map((instructor) => (
                              <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
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
                              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                              value={newExam.vehicleId || ''}
                              onChange={(e) => setNewExam({ ...newExam, vehicleId: e.target.value })}
                            >
                              <option value="">Sélectionner un véhicule</option>
                              {dbVehicles.map((vehicle) => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.name} - {vehicle.plate}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Date et heure */}
                        <div className="grid grid-cols-2 gap-4">
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
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
                            <p className="text-sm text-gray-900">{selectedExam.student.name}</p>
                            <p className="text-sm text-gray-500">ID: {selectedExam.student.id}</p>
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
                            <span className="text-sm text-gray-900">{selectedExam.instructor.name}</span>
                          </div>
                        </div>

                        {/* Véhicule (si examen pratique) */}
                        {selectedExam.type === 'practical' && selectedExam.vehicle && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Véhicule</h4>
                            <div className="mt-1 flex items-center">
                              <TruckIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{selectedExam.vehicle.name} - {selectedExam.vehicle.plate}</span>
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
