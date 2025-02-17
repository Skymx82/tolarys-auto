'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  XMarkIcon,
  AcademicCapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAutoEcole } from '@/hooks/useAutoEcole';

// Types
interface TimeSlot {
  start: string;
  end: string;
}

interface Schedule {
  lundi: TimeSlot[];
  mardi: TimeSlot[];
  mercredi: TimeSlot[];
  jeudi: TimeSlot[];
  vendredi: TimeSlot[];
  samedi: TimeSlot[];
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
  schedule: Schedule;
  rating: number;
  totalLessons: number;
  created_at?: string;
  updated_at?: string;
}

const emptySchedule: Schedule = {
  lundi: [],
  mardi: [],
  mercredi: [],
  jeudi: [],
  vendredi: [],
  samedi: []
};



export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showNewInstructorModal, setShowNewInstructorModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState<Partial<Instructor>>({
    specialties: [],
    schedule: { ...emptySchedule }
  });
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const { autoEcole } = useAutoEcole();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('moniteurs')
        .select('*');

      if (error) throw error;

      if (data) {
        const formattedInstructors = data.map(moniteur => ({
          id: moniteur.id,
          name: `${moniteur.nom} ${moniteur.prenom}`,
          email: moniteur.email,
          phone: moniteur.telephone || '',
          specialties: moniteur.specialites || [],
          schedule: moniteur.disponibilites || emptySchedule,
          rating: moniteur.note_moyenne || 0,
          totalLessons: moniteur.total_lecons || 0,
        }));
        setInstructors(formattedInstructors);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des moniteurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des moniteurs');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.phone.includes(searchTerm)
  );

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedInstructor(null);
  };

  const handleCloseNewInstructorModal = () => {
    setShowNewInstructorModal(false);
    setNewInstructor({
      specialties: [],
      schedule: { ...emptySchedule }
    });
  };

  const handleInstructorClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setShowDetails(true);
  };

  const handleCreateInstructor = async () => {
    try {
      if (!newInstructor.name || !newInstructor.email || !newInstructor.phone) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (!autoEcole?.id) {
        throw new Error('Impossible de créer un moniteur : auto-école non trouvée');
      }

      const [nom, prenom] = newInstructor.name.split(' ');
      
      if (!nom || !prenom) {
        throw new Error('Veuillez entrer un nom et un prénom');
      }

      // Créer l'objet à insérer
      const moniteurData = {
        nom,
        prenom,
        email: newInstructor.email,
        telephone: newInstructor.phone,
        specialites: newInstructor.specialties || [],
        disponibilites: newInstructor.schedule || emptySchedule,
        statut: 'actif',
        auto_ecole_id: autoEcole.id
      };

      console.log('Données à insérer:', moniteurData);

      const { data, error } = await supabase
        .from('moniteurs')
        .insert([moniteurData])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase détaillée:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('Moniteur créé avec succès:', data);

      await fetchInstructors();
      handleCloseNewInstructorModal();
    } catch (err) {
      console.error('Erreur complète:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du moniteur');
    }
  };

  const handleUpdateInstructor = async (instructorId: string, updates: Partial<Instructor>) => {
    try {
      const { error } = await supabase
        .from('moniteurs')
        .update({
          nom: updates.name?.split(' ')[0],
          prenom: updates.name?.split(' ')[1],
          email: updates.email,
          telephone: updates.phone,
          specialites: updates.specialties,
          disponibilites: updates.schedule
        })
        .eq('id', instructorId);

      if (error) throw error;

      await fetchInstructors();
      handleCloseModal();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du moniteur:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du moniteur');
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedInstructor, setEditedInstructor] = useState<Instructor | null>(null);

  const handleDeleteInstructor = async (instructorId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce moniteur ?')) {
      try {
        const { error } = await supabase
          .from('moniteurs')
          .delete()
          .eq('id', instructorId);

        if (error) throw error;

        await fetchInstructors();
        handleCloseModal();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du moniteur');
      }
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedInstructor(selectedInstructor);
  };

  const handleSaveEdit = async () => {
    if (!editedInstructor) return;

    try {
      const { error } = await supabase
        .from('moniteurs')
        .update({
          nom: editedInstructor.name.split(' ')[0],
          prenom: editedInstructor.name.split(' ')[1],
          email: editedInstructor.email,
          telephone: editedInstructor.phone,
          specialites: editedInstructor.specialties,
          disponibilites: editedInstructor.schedule
        })
        .eq('id', editedInstructor.id);

      if (error) throw error;

      await fetchInstructors();
      setIsEditing(false);
      setEditedInstructor(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du moniteur');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedInstructor(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec recherche et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            placeholder="Rechercher un moniteur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setShowNewInstructorModal(true)}
        >
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
          Nouveau moniteur
        </button>
      </div>

      {/* Liste des moniteurs */}
      <div className="overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
        <ul role="list" className="divide-y divide-gray-100">
          {filteredInstructors.map((instructor) => (
            <li
              key={instructor.id}
              className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer"
              onClick={() => handleInstructorClick(instructor)}
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {instructor.name}
                  </p>
                  <div className="mt-1 flex items-center gap-x-4 text-xs leading-5 text-gray-500">
                    <div className="flex items-center gap-x-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      {instructor.email}
                    </div>
                    <div className="flex items-center gap-x-1">
                      <PhoneIcon className="h-4 w-4" />
                      {instructor.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="flex items-center gap-x-1 text-sm leading-6 text-gray-900">
                    <AcademicCapIcon className="h-4 w-4" />
                    {instructor.totalLessons} leçons
                  </p>
                  <p className="flex items-center gap-x-1 mt-1 text-xs leading-5 text-gray-500">
                    <ChartBarIcon className="h-4 w-4" />
                    {instructor.rating}/5
                  </p>
                </div>
                <ChevronDownIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de détails */}
      {showDetails && selectedInstructor && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="instructor-details-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseModal}
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
                    onClick={handleCloseModal}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Détails du moniteur
                    </h3>
                    <div className="mt-4 text-left">
                      <div className="space-y-4">
                        {/* Informations de base */}
                        {isEditing ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                              <input
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={editedInstructor?.name || ''}
                                onChange={(e) => setEditedInstructor(prev => prev ? {...prev, name: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                type="email"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={editedInstructor?.email || ''}
                                onChange={(e) => setEditedInstructor(prev => prev ? {...prev, email: e.target.value} : null)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                              <input
                                type="tel"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                value={editedInstructor?.phone || ''}
                                onChange={(e) => setEditedInstructor(prev => prev ? {...prev, phone: e.target.value} : null)}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Nom</h4>
                              <p className="mt-1 text-sm text-gray-900">{selectedInstructor.name}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Email</h4>
                              <p className="mt-1 text-sm text-gray-900">{selectedInstructor.email}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                              <p className="mt-1 text-sm text-gray-900">{selectedInstructor.phone}</p>
                            </div>
                          </>
                        )}

                        {/* Spécialités */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Spécialités</h4>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedInstructor.specialties.map((specialty, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Horaires */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Horaires</h4>
                          <div className="mt-2 space-y-4">
                            {(Object.entries({
                              lundi: 'Lundi',
                              mardi: 'Mardi',
                              mercredi: 'Mercredi',
                              jeudi: 'Jeudi',
                              vendredi: 'Vendredi',
                              samedi: 'Samedi'
                            }) as [keyof Schedule, string][]).map(([day, label]) => (
                              <div key={day} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">{label}</span>
                                  {isEditing && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (editedInstructor) {
                                          const updatedSchedule = { ...editedInstructor.schedule };
                                          updatedSchedule[day] = [
                                            ...(updatedSchedule[day] || []),
                                            { start: '', end: '' }
                                          ];
                                          setEditedInstructor({
                                            ...editedInstructor,
                                            schedule: updatedSchedule
                                          });
                                        }
                                      }}
                                      className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                                    >
                                      <PlusIcon className="h-4 w-4 mr-1" />
                                      Ajouter un créneau
                                    </button>
                                  )}
                                </div>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    {editedInstructor?.schedule[day]?.map((slot, index) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <input
                                          type="time"
                                          value={slot.start}
                                          onChange={(e) => {
                                            if (editedInstructor) {
                                              const updatedSchedule = { ...editedInstructor.schedule };
                                              updatedSchedule[day][index] = {
                                                ...updatedSchedule[day][index],
                                                start: e.target.value
                                              };
                                              setEditedInstructor({
                                                ...editedInstructor,
                                                schedule: updatedSchedule
                                              });
                                            }
                                          }}
                                          className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        />
                                        <span>à</span>
                                        <input
                                          type="time"
                                          value={slot.end}
                                          onChange={(e) => {
                                            if (editedInstructor) {
                                              const updatedSchedule = { ...editedInstructor.schedule };
                                              updatedSchedule[day][index] = {
                                                ...updatedSchedule[day][index],
                                                end: e.target.value
                                              };
                                              setEditedInstructor({
                                                ...editedInstructor,
                                                schedule: updatedSchedule
                                              });
                                            }
                                          }}
                                          className="block rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (editedInstructor) {
                                              const updatedSchedule = { ...editedInstructor.schedule };
                                              updatedSchedule[day] = updatedSchedule[day].filter((_, i) => i !== index);
                                              setEditedInstructor({
                                                ...editedInstructor,
                                                schedule: updatedSchedule
                                              });
                                            }
                                          }}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <XMarkIcon className="h-5 w-5" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">
                                    {selectedInstructor.schedule[day]?.length > 0 ? (
                                      selectedInstructor.schedule[day].map((slot, index) => (
                                        <span key={index} className="mr-2">
                                          {slot.start} - {slot.end}
                                          {index < selectedInstructor.schedule[day].length - 1 && ', '}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-gray-400">Non disponible</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Note moyenne</h4>
                            <p className="mt-1 text-sm text-gray-900">{selectedInstructor.rating}/5</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Total des leçons</h4>
                            <p className="mt-1 text-sm text-gray-900">{selectedInstructor.totalLessons}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={handleCancelEdit}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={handleSaveEdit}
                      >
                        Enregistrer
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        onClick={handleStartEdit}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={() => handleDeleteInstructor(selectedInstructor.id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'un nouveau moniteur */}
      {showNewInstructorModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-instructor-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseNewInstructorModal}
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
                    onClick={handleCloseNewInstructorModal}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Nouveau moniteur
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Nom */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newInstructor.name || ''}
                            onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newInstructor.email || ''}
                            onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                          />
                        </div>

                        {/* Téléphone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={newInstructor.phone || ''}
                            onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                          />
                        </div>

                        {/* Spécialités */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Spécialités
                          </label>
                          <div className="mt-2 space-y-2">
                            {['Code', 'Conduite', 'Conduite accompagnée', 'Perfectionnement'].map((specialty) => (
                              <label key={specialty} className="inline-flex items-center mr-4">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                  checked={newInstructor.specialties?.includes(specialty) || false}
                                  onChange={(e) => {
                                    const specialties = newInstructor.specialties || [];
                                    if (e.target.checked) {
                                      setNewInstructor({
                                        ...newInstructor,
                                        specialties: [...specialties, specialty]
                                      });
                                    } else {
                                      setNewInstructor({
                                        ...newInstructor,
                                        specialties: specialties.filter(s => s !== specialty)
                                      });
                                    }
                                  }}
                                />
                                <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Horaires */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Horaires de travail
                          </label>
                          <div className="mt-2 space-y-4">
                            {(Object.entries({
                              lundi: 'Lundi',
                              mardi: 'Mardi',
                              mercredi: 'Mercredi',
                              jeudi: 'Jeudi',
                              vendredi: 'Vendredi',
                              samedi: 'Samedi'
                            }) as [keyof Schedule, string][]).map(([day, label]) => (
                              <div key={day} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">{label}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updatedSchedule = {
                                        ...(newInstructor.schedule || emptySchedule)
                                      };
                                      updatedSchedule[day] = [
                                        ...(updatedSchedule[day] || []),
                                        { start: '', end: '' }
                                      ];
                                      setNewInstructor({
                                        ...newInstructor,
                                        schedule: updatedSchedule
                                      });
                                    }}
                                    className="inline-flex items-center text-sm text-primary hover:text-primary/80"
                                  >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Ajouter un créneau
                                  </button>
                                </div>
                                {newInstructor.schedule?.[day]?.map((slot, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <input
                                      type="time"
                                      value={slot.start}
                                      onChange={(e) => {
                                        const updatedSchedule = {
                                          ...(newInstructor.schedule || emptySchedule)
                                        };
                                        const updatedSlots = [...updatedSchedule[day]];
                                        updatedSlots[index] = {
                                          ...updatedSlots[index],
                                          start: e.target.value
                                        };
                                        updatedSchedule[day] = updatedSlots;
                                        setNewInstructor({
                                          ...newInstructor,
                                          schedule: updatedSchedule
                                        });
                                      }}
                                      className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                      required
                                    />
                                    <span>à</span>
                                    <input
                                      type="time"
                                      value={slot.end}
                                      onChange={(e) => {
                                        const updatedSchedule = {
                                          ...(newInstructor.schedule || emptySchedule)
                                        };
                                        const updatedSlots = [...updatedSchedule[day]];
                                        updatedSlots[index] = {
                                          ...updatedSlots[index],
                                          end: e.target.value
                                        };
                                        updatedSchedule[day] = updatedSlots;
                                        setNewInstructor({
                                          ...newInstructor,
                                          schedule: updatedSchedule
                                        });
                                      }}
                                      className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                      required
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedSchedule = {
                                          ...(newInstructor.schedule || emptySchedule)
                                        };
                                        updatedSchedule[day] = updatedSchedule[day].filter(
                                          (_, i) => i !== index
                                        );
                                        setNewInstructor({
                                          ...newInstructor,
                                          schedule: updatedSchedule
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                      aria-label="Supprimer le créneau"
                                    >
                                      <XMarkIcon className="h-5 w-5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ))}
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
                    onClick={handleCreateInstructor}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseNewInstructorModal}
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
