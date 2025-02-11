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
  const [filter, setFilter] = useState<FilterType>('all');

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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Détails du paiement
                    </h3>
                    <div className="mt-8 text-left">
                      {/* En-tête avec statut */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-2" />
                          <span className="text-lg font-medium">{selectedPayment.invoice}</span>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[selectedPayment.status]
                        }`}>
                          {statusLabels[selectedPayment.status]}
                        </span>
                      </div>

                      {/* Informations principales */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Élève</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedPayment.student.name}</p>
                          <p className="text-sm text-gray-500">ID: {selectedPayment.student.id}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Description</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedPayment.description}</p>
                        </div>
                      </div>

                      {/* Montants */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Montant total</h4>
                            <p className="text-lg font-medium text-gray-900">
                              {formatCurrency(selectedPayment.amount)}
                            </p>
                          </div>
                          {selectedPayment.paidAmount && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Montant payé</h4>
                              <p className="text-lg font-medium text-gray-900">
                                {formatCurrency(selectedPayment.paidAmount)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dates et méthode de paiement */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Date d'échéance</h4>
                          <p className="mt-1 text-sm text-gray-900">{selectedPayment.dueDate}</p>
                        </div>
                        {selectedPayment.paidDate && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Date de paiement</h4>
                            <p className="mt-1 text-sm text-gray-900">{selectedPayment.paidDate}</p>
                          </div>
                        )}
                      </div>

                      {selectedPayment.method && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500">Méthode de paiement</h4>
                          <p className="mt-1 text-sm text-gray-900">{methodLabels[selectedPayment.method]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  {(selectedPayment.status === 'pending' || selectedPayment.status === 'partial' || selectedPayment.status === 'overdue') && (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 sm:col-start-2"
                      onClick={handleCloseModal}
                    >
                      Enregistrer un paiement
                    </button>
                  )}
                  <button
                    type="button"
                    className={`mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
                      selectedPayment.status === 'paid' ? 'sm:col-span-2' : 'sm:col-start-1'
                    } sm:mt-0`}
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
    </div>
  );
}
