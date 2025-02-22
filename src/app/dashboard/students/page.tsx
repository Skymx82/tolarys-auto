'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAutoEcole } from '@/hooks/useAutoEcole';
import { 
  MagnifyingGlassIcon, 
  PlusIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Types
type ProgressStatus = 'completed' | 'in_progress' | 'not_started';
type PaymentStatus = 'up_to_date' | 'pending' | 'overdue';

interface StudentProgress {
  theory: {
    status: ProgressStatus;
    score: string;
    examDate: string | null;
  };
  practical: {
    status: ProgressStatus;
    hours: number;
    totalHours: number;
    nextLesson: string | null;
  };
}

interface StudentPayments {
  status: PaymentStatus;
  totalPaid: number;
  totalDue: number;
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  postal_code: string;
  city: string;
  created_at: string;
  theory_status: ProgressStatus;
  theory_score: string;
  theory_exam_date: string | null;
  practical_status: ProgressStatus;
  practical_hours_done: number;
  practical_total_hours: number;
  practical_next_lesson: string | null;
  payment_status: PaymentStatus;
  payment_total_paid: number;
  payment_total_due: number;
}

const statusColors: Record<ProgressStatus | PaymentStatus, string> = {
  completed: 'bg-green-100 text-green-800',
  in_progress: 'bg-blue-100 text-blue-800',
  not_started: 'bg-gray-100 text-gray-800',
  up_to_date: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800'
};

const progressStatusLabels: Record<ProgressStatus, string> = {
  completed: 'Terminé',
  in_progress: 'En cours',
  not_started: 'Non commencé'
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  up_to_date: 'À jour',
  pending: 'En attente',
  overdue: 'En retard'
};

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showNewStudentModal, setShowNewStudentModal] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    address: '',
    postal_code: '',
    city: ''
  });

  const supabase = createClientComponentClient();
  const { autoEcole } = useAutoEcole();

  const fetchStudents = useCallback(async () => {
    if (!autoEcole?.id) {
      console.log('Pas d\'auto-école sélectionnée');
      return;
    }

    try {
      setLoading(true);
      console.log('Tentative de récupération des étudiants pour auto_ecole_id:', autoEcole.id);

      const response = await supabase
        .from('students')
        .select('*')
        .eq('auto_ecole_id', autoEcole.id);

      // Log de la réponse complète pour le débogage
      console.log('Réponse Supabase complète:', JSON.stringify(response, null, 2));

      if (response.error) {
        // Log détaillé de l'erreur
        const errorDetails = {
          status: response.status,
          statusText: response.statusText,
          error: {
            message: response.error.message,
            code: response.error?.code,
            details: response.error?.details,
            hint: response.error?.hint
          }
        };
        console.error('Erreur Supabase complète:', JSON.stringify(errorDetails, null, 2));
        setError(`Erreur de base de données: ${response.error.message}`);
        return;
      }

      if (!response.data) {
        console.log('Aucune donnée reçue de Supabase');
        setStudents([]);
        return;
      }

      console.log(`${response.data.length} étudiants trouvés`);

      const formattedStudents = response.data.map(student => {
        // Vérification des champs requis
        if (!student.first_name || !student.last_name) {
          console.warn('Étudiant avec données manquantes:', student);
        }

        return {
          id: student.id,
          first_name: student.first_name || '',
          last_name: student.last_name || '',
          email: student.email || '',
          phone: student.phone || '',
          birth_date: student.birth_date || '',
          address: student.address || '',
          postal_code: student.postal_code || '',
          city: student.city || '',
          created_at: student.created_at || new Date().toISOString(),
          theory_status: student.theory_status || 'not_started',
          theory_score: student.theory_score || '0',
          theory_exam_date: student.theory_exam_date || '',
          practical_status: student.practical_status || 'not_started',
          practical_hours_done: student.practical_hours_done || 0,
          practical_total_hours: student.practical_total_hours || 20,
          practical_next_lesson: student.practical_next_lesson || '',
          payment_status: student.payment_status || 'pending',
          payment_total_paid: student.payment_total_paid || 0,
          payment_total_due: student.payment_total_due || 1200
        };
      });

      console.log('Étudiants formatés avec succès:', formattedStudents.length);
      setStudents(formattedStudents);
      setError(null);

    } catch (err) {
      // Log détaillé de l'erreur générale
      const errorInfo = {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        raw: err
      };
      console.error('Erreur détaillée lors du chargement:', JSON.stringify(errorInfo, null, 2));
      setError('Une erreur est survenue lors du chargement des étudiants');
    } finally {
      setLoading(false);
    }
  }, [supabase, autoEcole?.id]);

  const createStudent = async (studentData: typeof newStudent) => {
    if (!autoEcole?.id) {
      setError('Pas d\'auto-école sélectionnée');
      return;
    }

    try {
      setLoading(true);
      console.log('Début de la création d\'un étudiant pour auto_ecole_id:', autoEcole.id);
      
      // Vérifier les données requises
      if (!studentData.first_name || !studentData.last_name) {
        throw new Error('Le nom et le prénom sont requis');
      }

      const newStudentWithDefaults = {
        ...studentData,
        auto_ecole_id: autoEcole.id,
        created_at: new Date().toISOString(),
        theory_status: 'not_started' as const,
        theory_score: '0',
        practical_status: 'not_started' as const,
        practical_hours_done: 0,
        practical_total_hours: 20,
        payment_status: 'pending' as const,
        payment_total_paid: 0,
        payment_total_due: 1200
      };

      console.log('Données de l\'étudiant à créer:', newStudentWithDefaults);

      const { data, error } = await supabase
        .from('students')
        .insert([newStudentWithDefaults])
        .select();

      if (error) {
        console.error('Erreur Supabase détaillée lors de la création:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setError(`Erreur lors de la création: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        throw new Error('Aucune donnée retournée après la création');
      }

      console.log('Étudiant créé avec succès:', data[0]);
      
      await fetchStudents();
      handleCloseNewStudentModal();
      setError(null);
    } catch (err) {
      console.error('Erreur détaillée lors de la création:', {
        error: err,
        message: err instanceof Error ? err.message : 'Erreur inconnue',
        stack: err instanceof Error ? err.stack : undefined
      });
      setError('Une erreur est survenue lors de la création de l\'étudiant. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('students')
        .update({
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
          phone: updates.phone,
          birth_date: updates.birth_date,
          address: updates.address,
          postal_code: updates.postal_code,
          city: updates.city,
          theory_status: updates.theory_status,
          theory_score: updates.theory_score,
          theory_exam_date: updates.theory_exam_date,
          practical_status: updates.practical_status,
          practical_hours_done: updates.practical_hours_done,
          practical_total_hours: updates.practical_total_hours,
          practical_next_lesson: updates.practical_next_lesson,
          payment_status: updates.payment_status,
          payment_total_paid: updates.payment_total_paid,
          payment_total_due: updates.payment_total_due
        })
        .eq('id', id);

      if (error) throw error;
      await fetchStudents();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'étudiant:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchStudents();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'étudiant:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoEcole?.id) {
      fetchStudents();
    }
  }, [fetchStudents, autoEcole?.id]);

  const handleCreateStudent = async () => {
    await createStudent(newStudent);
    handleCloseNewStudentModal();
  };

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedStudent(null);
  };

  const handleCloseNewStudentModal = () => {
    setShowNewStudentModal(false);
    setNewStudent({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      birth_date: '',
      address: '',
      postal_code: '',
      city: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <label htmlFor="search-student" className="sr-only">
              Rechercher un élève
            </label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search-student"
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
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          onClick={() => setShowNewStudentModal(true)}
          aria-label="Ajouter un nouvel élève"
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
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedStudent(student);
                  setShowDetails(true);
                }
              }}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {student.first_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{student.first_name} {student.last_name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Progression code */}
                    <div className="flex flex-col items-center">
                      <AcademicCapIcon className={`h-6 w-6 ${
                        student.theory_status === 'completed' ? 'text-green-500' :
                        student.theory_status === 'in_progress' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500">Code</span>
                    </div>
                    {/* Progression conduite */}
                    <div className="flex flex-col items-center">
                      <ClockIcon className={`h-6 w-6 ${
                        student.practical_status === 'completed' ? 'text-green-500' :
                        student.practical_status === 'in_progress' ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className="text-xs text-gray-500">Conduite</span>
                    </div>
                    {/* Statut paiement */}
                    <div className="flex flex-col items-center">
                      <CurrencyEuroIcon className={`h-6 w-6 ${
                        student.payment_status === 'up_to_date' ? 'text-green-500' :
                        student.payment_status === 'pending' ? 'text-yellow-500' : 'text-red-500'
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
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div 
                className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={handleCloseModal}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 id="modal-title" className="text-lg font-semibold leading-6 text-gray-900">
                      Détails de l'élève
                    </h3>
                    <div className="mt-8">
                      {/* Informations personnelles */}
                      <div className="grid grid-cols-2 gap-4 text-left mb-8">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Nom</h4>
                          <div className="mt-1 flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">{selectedStudent.first_name} {selectedStudent.last_name}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Email</h4>
                          <div className="mt-1 flex items-center">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">{selectedStudent.email}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                          <div className="mt-1 flex items-center">
                            <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">{selectedStudent.phone}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date d'inscription</h4>
                          <div className="mt-1 flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-900">{selectedStudent.created_at}</p>
                          </div>
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Progression</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {/* Code */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <h5 className="text-sm font-medium text-gray-900">Formation Code</h5>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[selectedStudent.theory_status]
                              }`}>
                                {progressStatusLabels[selectedStudent.theory_status]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Score: {selectedStudent.theory_score}</p>
                            {selectedStudent.theory_exam_date && (
                              <p className="text-sm text-gray-500">
                                Examen le: {selectedStudent.theory_exam_date}
                              </p>
                            )}
                          </div>

                          {/* Conduite */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                                <h5 className="text-sm font-medium text-gray-900">Formation Conduite</h5>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColors[selectedStudent.practical_status]
                              }`}>
                                {progressStatusLabels[selectedStudent.practical_status]}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Heures effectuées: {selectedStudent.practical_hours_done}/{selectedStudent.practical_total_hours}
                            </p>
                            {selectedStudent.practical_next_lesson && (
                              <p className="text-sm text-gray-500">
                                Prochaine leçon: {selectedStudent.practical_next_lesson}
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
                            <div className="flex items-center">
                              <CurrencyEuroIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <h5 className="text-sm font-medium text-gray-900">État des paiements</h5>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[selectedStudent.payment_status]
                            }`}>
                              {paymentStatusLabels[selectedStudent.payment_status]}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm text-gray-500">
                              Montant payé: {selectedStudent.payment_total_paid}€
                            </p>
                            <p className="text-sm text-gray-500">
                              Montant total: {selectedStudent.payment_total_due}€
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCloseModal}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseModal}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'un nouvel élève */}
      {showNewStudentModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-student-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseNewStudentModal}
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
                    onClick={handleCloseNewStudentModal}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Nouvel Élève
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Nom */}
                        <div>
                          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                            Prénom
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="first_name"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Prénom de l'élève"
                                value={newStudent.first_name}
                                onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Nom */}
                        <div>
                          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="last_name"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Nom de l'élève"
                                value={newStudent.last_name}
                                onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="email"
                                id="email"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="email@exemple.com"
                                value={newStudent.email}
                                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Téléphone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="tel"
                                id="phone"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="06 12 34 56 78"
                                value={newStudent.phone}
                                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Date de naissance */}
                        <div>
                          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">
                            Date de naissance
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="date"
                                id="birth_date"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                value={newStudent.birth_date}
                                onChange={(e) => setNewStudent({ ...newStudent, birth_date: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Adresse */}
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Adresse
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="address"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Adresse de l'élève"
                                value={newStudent.address}
                                onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Code postal */}
                        <div>
                          <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                            Code postal
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="postal_code"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Code postal de l'élève"
                                value={newStudent.postal_code}
                                onChange={(e) => setNewStudent({ ...newStudent, postal_code: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Ville */}
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Ville
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                id="city"
                                className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="Ville de l'élève"
                                value={newStudent.city}
                                onChange={(e) => setNewStudent({ ...newStudent, city: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCreateStudent}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseNewStudentModal}
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