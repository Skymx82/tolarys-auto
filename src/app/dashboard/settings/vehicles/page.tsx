'use client';

import { useState } from 'react';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  WrenchIcon,
  CalendarIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  licensePlate: string;
  year: number;
  type: 'manual' | 'automatic';
  status: 'active' | 'maintenance' | 'inactive';
  insurance: {
    company: string;
    policyNumber: string;
    expiryDate: string;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    mileage: number;
    documents: string[];
  };
  features: string[];
  assignedInstructors: string[];
}

const initialVehicles: Vehicle[] = [
  {
    id: '1',
    brand: 'Peugeot',
    model: '208',
    licensePlate: 'AB-123-CD',
    year: 2023,
    type: 'manual',
    status: 'active',
    insurance: {
      company: 'AXA',
      policyNumber: 'POL123456',
      expiryDate: '2025-12-31'
    },
    maintenance: {
      lastService: '2024-12-01',
      nextService: '2025-03-01',
      mileage: 15000,
      documents: ['revision_2024.pdf', 'carnet_entretien.pdf']
    },
    features: ['Double commande', 'GPS', 'Caméra de recul'],
    assignedInstructors: ['Jean Dupont', 'Marie Lambert']
  }
];

export default function VehiclesSettingsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  const handleAddVehicle = () => {
    setIsEditing(true);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
  };

  const handleSaveVehicle = (vehicleData: Vehicle) => {
    if (selectedVehicle) {
      setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? vehicleData : v));
    } else {
      setVehicles([...vehicles, { ...vehicleData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter(v => v.id !== vehicleId));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des véhicules</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez votre flotte de véhicules, leur maintenance et leurs documents
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddVehicle}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Ajouter un véhicule
        </button>
      </div>

      {/* Liste des véhicules */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TruckIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>Immatriculation: {vehicle.licensePlate}</p>
                    <p>Type: {vehicle.type === 'manual' ? 'Manuelle' : 'Automatique'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'active' ? 'bg-green-100 text-green-800' :
                  vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status === 'active' ? 'Actif' :
                   vehicle.status === 'maintenance' ? 'En maintenance' :
                   'Inactif'}
                </span>
                <button
                  onClick={() => handleEditVehicle(vehicle)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Détails du véhicule */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Assurance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Assurance</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Compagnie: {vehicle.insurance.company}</p>
                  <p>Police n°: {vehicle.insurance.policyNumber}</p>
                  <p>Expiration: {vehicle.insurance.expiryDate}</p>
                </div>
              </div>

              {/* Maintenance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Maintenance</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Dernier entretien: {vehicle.maintenance.lastService}</p>
                  <p>Prochain entretien: {vehicle.maintenance.nextService}</p>
                  <p>Kilométrage: {vehicle.maintenance.mileage} km</p>
                </div>
              </div>

              {/* Moniteurs assignés */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Moniteurs assignés</h4>
                <div className="space-y-1">
                  {vehicle.assignedInstructors.map((instructor, index) => (
                    <p key={index} className="text-sm text-gray-600">{instructor}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents et équipements */}
            <div className="mt-4 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <DocumentIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {vehicle.maintenance.documents.length} documents
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <WrenchIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {vehicle.features.length} équipements
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'édition (à implémenter) */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          {/* Formulaire d'édition complet à implémenter */}
        </div>
      )}
    </div>
  );
}
