import { createClient } from '@supabase/supabase-js';

// Types
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'check';

export interface Payment {
  id: number;
  student_id: string;
  student_name: string;
  amount: number;
  status: PaymentStatus;
  due_date: string;
  method?: PaymentMethod;
  invoice_number: string;
  description: string;
  paid_amount?: number;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentDTO {
  student_id: string;
  student_name: string;
  amount: number;
  status: PaymentStatus;
  due_date: string;
  method?: PaymentMethod;
  description: string;
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonctions d'accès aux données
export async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPayment(payment: CreatePaymentDTO) {
  const { data, error } = await supabase
    .from('payments')
    .insert([{
      ...payment,
      invoice_number: generateInvoiceNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updatePaymentStatus(id: number, status: PaymentStatus) {
  const { data, error } = await supabase
    .from('payments')
    .update({ 
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'paid' ? { paid_date: new Date().toISOString() } : {})
    })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
}

// Fonction utilitaire pour générer un numéro de facture
function generateInvoiceNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}
