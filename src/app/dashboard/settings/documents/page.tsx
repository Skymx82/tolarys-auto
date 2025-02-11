'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'evaluation' | 'certificate' | 'other';
  description: string;
  lastModified: string;
  variables: string[];
  content?: string;
  file?: File;
  status: 'active' | 'draft' | 'archived';
}

const documentTypes = {
  contract: 'Contrat',
  invoice: 'Facture',
  evaluation: 'Fiche d\'évaluation',
  certificate: 'Attestation',
  other: 'Autre'
};

const initialTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Contrat de formation',
    type: 'contract',
    description: 'Contrat standard pour la formation au permis B',
    lastModified: '2025-02-01',
    variables: [
      '{{nom_eleve}}',
      '{{prenom_eleve}}',
      '{{date_naissance}}',
      '{{adresse}}',
      '{{formule_choisie}}',
      '{{montant_total}}',
      '{{date_debut}}'
    ],
    status: 'active'
  },
  {
    id: '2',
    name: 'Facture standard',
    type: 'invoice',
    description: 'Modèle de facture pour les prestations',
    lastModified: '2025-02-01',
    variables: [
      '{{numero_facture}}',
      '{{date_facture}}',
      '{{nom_client}}',
      '{{details_prestation}}',
      '{{montant_ht}}',
      '{{tva}}',
      '{{montant_ttc}}'
    ],
    status: 'active'
  },
  {
    id: '3',
    name: 'Fiche d\'évaluation de conduite',
    type: 'evaluation',
    description: 'Grille d\'évaluation pour les leçons de conduite',
    lastModified: '2025-02-01',
    variables: [
      '{{nom_eleve}}',
      '{{date_evaluation}}',
      '{{moniteur}}',
      '{{competences}}',
      '{{remarques}}',
      '{{note_globale}}'
    ],
    status: 'active'
  }
];

export default function DocumentsSettingsPage() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | keyof typeof documentTypes>('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddTemplate = () => {
    setIsEditing(true);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) {
      setTemplates(templates.filter(t => t.id !== templateId));
    }
  };

  const handleSaveTemplate = (templateData: DocumentTemplate) => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? templateData : t));
    } else {
      setTemplates([...templates, { ...templateData, id: Date.now().toString() }]);
    }
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documents et contrats</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos modèles de documents et contrats
          </p>
        </div>
        <button
          onClick={handleAddTemplate}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouveau modèle
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pr-10 focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Rechercher un modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <DocumentTextIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="sm:w-64">
          <select
            className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary sm:text-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="all">Tous les types</option>
            {Object.entries(documentTypes).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des modèles */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    template.status === 'active' ? 'bg-green-100' :
                    template.status === 'draft' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <DocumentDuplicateIcon className={`h-6 w-6 ${
                      template.status === 'active' ? 'text-green-600' :
                      template.status === 'draft' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-500">{documentTypes[template.type]}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      Modifié le {new Date(template.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <DocumentTextIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditTemplate(template)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{template.description}</p>
              {template.variables.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-700">Variables disponibles :</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.variables.map((variable, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'édition */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                {/* Contenu du formulaire d'édition à implémenter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}
                  </h3>
                  {/* Formulaire à implémenter */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                {/* Contenu de la prévisualisation à implémenter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Prévisualisation du document
                  </h3>
                  {/* Prévisualisation à implémenter */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
