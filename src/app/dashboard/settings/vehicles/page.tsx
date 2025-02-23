'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  WrenchIcon,
  CalendarIcon,
  DocumentIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Insurance {
  company: string;
  policy_number: string;
  expiry_date: string;
}

interface Maintenance {
  last_service: string;
  next_service: string;
  mileage: number;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  type: 'manual' | 'automatic';
  status: 'active' | 'maintenance' | 'inactive';
  auto_ecole_id: string;
  date_creation?: string;
  date_modification?: string;
  insurance?: Insurance | null;
  maintenance?: Maintenance | null;
  features: string[];
}

type VehicleFormData = Omit<Vehicle, 'id' | 'auto_ecole_id' | 'date_creation' | 'date_modification'> & {
  insurance: Insurance;
  maintenance: Maintenance;
};

const emptyVehicleForm: VehicleFormData = {
  brand: '',
  model: '',
  license_plate: '',
  year: new Date().getFullYear(),
  type: 'manual',
  status: 'active',
  insurance: {
    company: '',
    policy_number: '',
    expiry_date: ''
  },
  maintenance: {
    last_service: '',
    next_service: '',
    mileage: 0
  },
  features: []
};

function VehicleFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VehicleFormData) => void;
  initialData: Vehicle | null;
}) {
  const [formData, setFormData] = useState<VehicleFormData>(() => {
    if (!initialData) return emptyVehicleForm;
    
    return {
      brand: initialData.brand,
      model: initialData.model,
      license_plate: initialData.license_plate,
      year: initialData.year,
      type: initialData.type,
      status: initialData.status,
      insurance: initialData.insurance || emptyVehicleForm.insurance,
      maintenance: initialData.maintenance || emptyVehicleForm.maintenance,
      features: initialData.features
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInsuranceChange = (field: keyof Insurance, value: string) => {
    setFormData(prev => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [field]: value
      }
    }));
  };

  const handleMaintenanceChange = (field: keyof Maintenance, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        [field]: field === 'mileage' ? Number(value) : value
      }
    }));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {initialData ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
                    </h3>
                  </div>

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Marque
                      </label>
                      <input
                        type="text"
                        name="brand"
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Modèle
                      </label>
                      <input
                        type="text"
                        name="model"
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="license_plate" className="block text-sm font-medium text-gray-700">
                        Immatriculation
                      </label>
                      <input
                        type="text"
                        name="license_plate"
                        id="license_plate"
                        value={formData.license_plate}
                        onChange={(e) => handleInputChange('license_plate', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Année
                      </label>
                      <input
                        type="number"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="manual">Manuelle</option>
                        <option value="automatic">Automatique</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Statut
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      >
                        <option value="active">Actif</option>
                        <option value="maintenance">En maintenance</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  </div>

                  {/* Assurance */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Assurance</h4>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="insurance-company" className="block text-sm font-medium text-gray-700">
                          Compagnie
                        </label>
                        <input
                          type="text"
                          name="insurance-company"
                          id="insurance-company"
                          value={formData.insurance.company}
                          onChange={(e) => handleInsuranceChange('company', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="insurance-policy" className="block text-sm font-medium text-gray-700">
                          Numéro de police
                        </label>
                        <input
                          type="text"
                          name="insurance-policy"
                          id="insurance-policy"
                          value={formData.insurance.policy_number}
                          onChange={(e) => handleInsuranceChange('policy_number', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="insurance-expiry" className="block text-sm font-medium text-gray-700">
                          Date d'expiration
                        </label>
                        <input
                          type="date"
                          name="insurance-expiry"
                          id="insurance-expiry"
                          value={formData.insurance.expiry_date}
                          onChange={(e) => handleInsuranceChange('expiry_date', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Maintenance</h4>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="last-service" className="block text-sm font-medium text-gray-700">
                          Dernier entretien
                        </label>
                        <input
                          type="date"
                          name="last-service"
                          id="last-service"
                          value={formData.maintenance.last_service}
                          onChange={(e) => handleMaintenanceChange('last_service', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="next-service" className="block text-sm font-medium text-gray-700">
                          Prochain entretien
                        </label>
                        <input
                          type="date"
                          name="next-service"
                          id="next-service"
                          value={formData.maintenance.next_service}
                          onChange={(e) => handleMaintenanceChange('next_service', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                          Kilométrage
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          id="mileage"
                          value={formData.maintenance.mileage}
                          onChange={(e) => handleMaintenanceChange('mileage', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Équipements */}
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">Équipements</h4>
                    <div className="mt-4 space-y-4">
                      {['Double commande', 'GPS', 'Caméra de recul', 'Bluetooth', 'Climatisation'].map((feature) => (
                        <div key={feature} className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              type="checkbox"
                              checked={formData.features.includes(feature)}
                              onChange={() => handleFeatureChange(feature)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label className="font-medium text-gray-700">{feature}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    >
                      {initialData ? 'Sauvegarder' : 'Ajouter'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      onClick={onClose}
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function VehiclesSettingsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [autoEcoleId, setAutoEcoleId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      console.log('Current session:', session);

      const { data: autoEcole, error: autoEcoleError } = await supabase
        .from('auto_ecoles')
        .select('id')
        .single();

      console.log('Auto-école fetch result:', { autoEcole, error: autoEcoleError });

      if (autoEcoleError || !autoEcole) {
        console.error('Error fetching auto-école:', autoEcoleError);
        toast.error('Auto-école non trouvée');
        return;
      }

      setAutoEcoleId(autoEcole.id);
      const { data: vehiclesData, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          vehicle_insurance (
            id,
            company,
            policy_number,
            expiry_date
          ),
          vehicle_maintenance (
            id,
            last_service,
            next_service,
            mileage
          ),
          vehicle_features (
            feature
          )
        `)
        .eq('auto_ecole_id', autoEcole.id);

      if (error) {
        throw error;
      }

      console.log('Raw vehicle data:', vehiclesData); // Debug log

      // Transform the data to match our interface
      const transformedVehicles = vehiclesData.map((vehicle: any) => {
        console.log('Processing vehicle:', vehicle.id, {
          insurance: vehicle.vehicle_insurance,
          maintenance: vehicle.vehicle_maintenance
        });
        
        return {
          ...vehicle,
          insurance: vehicle.vehicle_insurance?.[0] || null,
          maintenance: vehicle.vehicle_maintenance?.[0] || null,
          features: vehicle.vehicle_features?.map((f: any) => f.feature) || []
        };
      });

      console.log('Transformed vehicles:', transformedVehicles); // Debug log

      setVehicles(transformedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Erreur lors du chargement des véhicules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsEditing(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  const handleSaveVehicle = async (vehicleData: VehicleFormData) => {
    try {
      if (!autoEcoleId) {
        console.error('No auto-école ID found');
        toast.error('Auto-école non trouvée');
        return;
      }

      console.log('Attempting to save vehicle with data:', {
        ...vehicleData,
        auto_ecole_id: autoEcoleId
      });

      if (selectedVehicle) {
        // Update existing vehicle
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .update({
            brand: vehicleData.brand,
            model: vehicleData.model,
            license_plate: vehicleData.license_plate,
            year: vehicleData.year,
            type: vehicleData.type,
            status: vehicleData.status
          })
          .eq('id', selectedVehicle.id);

        if (vehicleError) throw vehicleError;

        // Update insurance
        const { error: insuranceError } = await supabase
          .from('vehicle_insurance')
          .upsert({
            vehicle_id: selectedVehicle.id,
            company: vehicleData.insurance.company,
            policy_number: vehicleData.insurance.policy_number,
            expiry_date: vehicleData.insurance.expiry_date
          });

        if (insuranceError) throw insuranceError;

        // Update maintenance
        const { error: maintenanceError } = await supabase
          .from('vehicle_maintenance')
          .upsert({
            vehicle_id: selectedVehicle.id,
            last_service: vehicleData.maintenance.last_service,
            next_service: vehicleData.maintenance.next_service,
            mileage: vehicleData.maintenance.mileage
          });

        if (maintenanceError) throw maintenanceError;

        // Update features
        await supabase
          .from('vehicle_features')
          .delete()
          .eq('vehicle_id', selectedVehicle.id);

        if (vehicleData.features.length > 0) {
          const { error: featuresError } = await supabase
            .from('vehicle_features')
            .insert(
              vehicleData.features.map(feature => ({
                vehicle_id: selectedVehicle.id,
                feature
              }))
            );

          if (featuresError) throw featuresError;
        }

      } else {
        // Create new vehicle
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert({
            auto_ecole_id: autoEcoleId,
            brand: vehicleData.brand,
            model: vehicleData.model,
            license_plate: vehicleData.license_plate,
            year: vehicleData.year,
            type: vehicleData.type,
            status: vehicleData.status
          })
          .select()
          .single();

        console.log('Vehicle creation result:', { newVehicle, error: vehicleError });

        if (vehicleError || !newVehicle) {
          console.error('Error creating vehicle:', vehicleError);
          throw vehicleError;
        }

        // Insert insurance
        const { error: insuranceError } = await supabase
          .from('vehicle_insurance')
          .insert({
            vehicle_id: newVehicle.id,
            company: vehicleData.insurance.company,
            policy_number: vehicleData.insurance.policy_number,
            expiry_date: vehicleData.insurance.expiry_date
          });

        if (insuranceError) throw insuranceError;

        // Insert maintenance
        const { error: maintenanceError } = await supabase
          .from('vehicle_maintenance')
          .insert({
            vehicle_id: newVehicle.id,
            last_service: vehicleData.maintenance.last_service,
            next_service: vehicleData.maintenance.next_service,
            mileage: vehicleData.maintenance.mileage
          });

        if (maintenanceError) throw maintenanceError;

        // Insert features
        if (vehicleData.features.length > 0) {
          const { error: featuresError } = await supabase
            .from('vehicle_features')
            .insert(
              vehicleData.features.map(feature => ({
                vehicle_id: newVehicle.id,
                feature
              }))
            );

          if (featuresError) throw featuresError;
        }
      }

      toast.success(selectedVehicle ? 'Véhicule modifié avec succès' : 'Véhicule ajouté avec succès');
      await fetchVehicles();
      setIsEditing(false);
      setSelectedVehicle(null);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Erreur lors de l\'enregistrement du véhicule');
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;

      toast.success('Véhicule supprimé avec succès');
      await fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast.error('Erreur lors de la suppression du véhicule');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Véhicules</h2>
        <button
          onClick={handleAddVehicle}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>Immatriculation: {vehicle.license_plate}</p>
                    <p>Type: {vehicle.type === 'manual' ? 'Manuelle' : 'Automatique'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditVehicle(vehicle)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">État</h4>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vehicle.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : vehicle.status === 'maintenance'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vehicle.status === 'active'
                        ? 'Actif'
                        : vehicle.status === 'maintenance'
                        ? 'En maintenance'
                        : 'Inactif'}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Assurance</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Compagnie: {vehicle.insurance?.company || '-'}</p>
                    <p>Police n°: {vehicle.insurance?.policy_number || '-'}</p>
                    <p>Expiration: {vehicle.insurance?.expiry_date || '-'}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Maintenance</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Dernier entretien: {vehicle.maintenance?.last_service || '-'}</p>
                    <p>Prochain entretien: {vehicle.maintenance?.next_service || '-'}</p>
                    <p>Kilométrage: {vehicle.maintenance?.mileage || 0} km</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {vehicle.features.length} équipements
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <VehicleFormModal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedVehicle(null);
        }}
        onSave={handleSaveVehicle}
        initialData={selectedVehicle}
      />
    </div>
  );
}
