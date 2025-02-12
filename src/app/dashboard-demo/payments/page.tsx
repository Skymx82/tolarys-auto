'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Types
type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
type PaymentMethod = 'card' | 'cash' | 'transfer' | 'check';
type FilterType = 'all' | 'paid' | 'pending' | 'overdue' | 'partial';

interface Payment {
  id: number;
  student: {
    name: string;
    id: string;
  };
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  method?: PaymentMethod;
  invoice: string;
  description: string;
  paidAmount?: number;
  paidDate?: string;
}

// Données de test pour les paiements
const payments: Payment[] = [
  {
    id: 1,
    student: {
      name: 'Sophie Martin',
      id: 'SM123'
    },
    amount: 1500,
    status: 'paid',
    dueDate: '2025-02-01',
    method: 'card',
    invoice: 'INV-2025-001',
    description: 'Formation permis B - Pack 20h',
    paidAmount: 1500,
    paidDate: '2025-01-28'
  },
  {
    id: 2,
    student: {
      name: 'Lucas Bernard',
      id: 'LB456'
    },
    amount: 1500,
    status: 'partial',
    dueDate: '2025-02-15',
    method: 'cash',
    invoice: 'INV-2025-002',
    description: 'Formation permis B - Pack 20h',
    paidAmount: 750,
    paidDate: '2025-01-15'
  },
  {
    id: 3,
    student: {
      name: 'Emma Petit',
      id: 'EP789'
    },
    amount: 800,
    status: 'pending',
    dueDate: '2025-02-20',
    invoice: 'INV-2025-003',
    description: 'Code de la route - Pack complet'
  },
  {
    id: 4,
    student: {
      name: 'Thomas Richard',
      id: 'TR101'
    },
    amount: 1500,
    status: 'overdue',
    dueDate: '2025-01-31',
    invoice: 'INV-2025-004',
    description: 'Formation permis B - Pack 20h'
  }
];

const statusColors: Record<PaymentStatus, string> = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-blue-100 text-blue-800',
  overdue: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800'
};

const statusLabels: Record<PaymentStatus, string> = {
  paid: 'Payé',
  pending: 'En attente',
  overdue: 'En retard',
  partial: 'Partiel'
};

const methodLabels: Record<PaymentMethod, string> = {
  card: 'Carte bancaire',
  cash: 'Espèces',
  transfer: 'Virement',
  check: 'Chèque'
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    status: 'pending'
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || payment.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedPayment(null);
  };

  const handleCloseNewPaymentModal = () => {
    setShowNewPaymentModal(false);
    setNewPayment({ status: 'pending' });
  };

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

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
              placeholder="Rechercher un paiement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <option value="all">Tous les paiements</option>
            <option value="paid">Payés</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
            <option value="partial">Partiels</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90 focus:outline-none"
            onClick={() => setShowNewPaymentModal(true)}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nouveau paiement
          </button>
        </div>
      </div>

      {/* Liste des paiements */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul role="list" className="divide-y divide-gray-200">
          {filteredPayments.map((payment) => (
            <li
              key={payment.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handlePaymentClick(payment)}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100' :
                        payment.status === 'partial' ? 'bg-yellow-100' :
                        payment.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                      } flex items-center justify-center`}>
                        {payment.status === 'paid' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : payment.status === 'partial' ? (
                          <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                        ) : payment.status === 'overdue' ? (
                          <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
                        ) : (
                          <ClockIcon className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">{payment.student.name}</div>
                        <span className="ml-2 text-sm text-gray-500">({payment.student.id})</span>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[payment.status]
                        }`}>
                          {statusLabels[payment.status]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{payment.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      <div className="text-gray-500">Échéance : {payment.dueDate}</div>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal des détails du paiement */}
      {showDetails && selectedPayment && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="payment-details-modal"
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
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Détails du paiement
                    </h3>
                    <div className="mt-4 text-left">
                      <div className="space-y-4">
                        {/* Montant et statut */}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <BanknotesIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-lg font-medium text-gray-900">
                              {formatCurrency(selectedPayment.amount)}
                            </span>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedPayment.status]}`}>
                            {statusLabels[selectedPayment.status]}
                          </span>
                        </div>

                        {/* Informations de l'étudiant */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Étudiant</h4>
                          <div className="mt-1 flex items-center">
                            <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm text-gray-900">{selectedPayment.student.name}</p>
                              <p className="text-sm text-gray-500">ID: {selectedPayment.student.id}</p>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <div className="mt-1 flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedPayment.description}</span>
                          </div>
                        </div>

                        {/* Numéro de facture */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Facture</h4>
                          <div className="mt-1 flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedPayment.invoice}</span>
                          </div>
                        </div>

                        {/* Date d'échéance */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date d'échéance</h4>
                          <div className="mt-1 flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{selectedPayment.dueDate}</span>
                          </div>
                        </div>

                        {/* Méthode de paiement */}
                        {selectedPayment.method && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Méthode de paiement</h4>
                            <div className="mt-1 flex items-center">
                              <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{methodLabels[selectedPayment.method]}</span>
                            </div>
                          </div>
                        )}

                        {/* Montant payé et date (si applicable) */}
                        {selectedPayment.paidAmount && selectedPayment.paidDate && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Paiement effectué</h4>
                            <div className="mt-1 flex items-center">
                              <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {formatCurrency(selectedPayment.paidAmount)} le {selectedPayment.paidDate}
                              </span>
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
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCloseModal}
                  >
                    Fermer
                  </button>
                  {selectedPayment.status !== 'paid' && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={handleCloseModal}
                    >
                      Marquer comme payé
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création d'un nouveau paiement */}
      {showNewPaymentModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50"
          aria-labelledby="new-payment-modal"
          role="dialog"
          aria-modal="true"
          onClick={handleCloseNewPaymentModal}
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
                      Nouveau Paiement
                    </h3>
                    <div className="mt-4">
                      <form className="space-y-4">
                        {/* Étudiant */}
                        <div>
                          <label htmlFor="student" className="block text-sm font-medium text-gray-700">
                            Étudiant
                          </label>
                          <input
                            type="text"
                            id="student"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Nom de l'étudiant"
                          />
                        </div>

                        {/* Montant */}
                        <div>
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Montant
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">€</span>
                            </div>
                            <input
                              type="number"
                              id="amount"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <input
                            type="text"
                            id="description"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Ex: Formation permis B - Pack 20h"
                          />
                        </div>

                        {/* Date d'échéance */}
                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                            Date d'échéance
                          </label>
                          <input
                            type="date"
                            id="dueDate"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          />
                        </div>

                        {/* Méthode de paiement */}
                        <div>
                          <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                            Méthode de paiement
                          </label>
                          <select
                            id="method"
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                          >
                            <option value="">Sélectionner une méthode</option>
                            <option value="card">Carte bancaire</option>
                            <option value="cash">Espèces</option>
                            <option value="transfer">Virement</option>
                            <option value="check">Chèque</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus:outline-none sm:col-start-2"
                    onClick={handleCloseNewPaymentModal}
                  >
                    Créer
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    onClick={handleCloseNewPaymentModal}
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
