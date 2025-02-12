import { createClient } from '@supabase/supabase-js';

export type StudentStatus = 'active' | 'inactive' | 'pending';
export type LicenseType = 'B' | 'A' | 'A1' | 'A2';

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  postal_code: string;
  city: string;
  license_type: LicenseType;
  status: StudentStatus;
  hours_done: number;
  hours_total: number;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  postal_code: string;
  city: string;
  license_type: LicenseType;
  hours_total: number;
}

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Student[];
}

export async function getStudentById(id: string) {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Student;
}

export async function createStudent(student: CreateStudentDTO) {
  const { data, error } = await supabase
    .from('students')
    .insert([{
      ...student,
      status: 'pending',
      hours_done: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function updateStudent(id: string, updates: Partial<Omit<Student, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('students')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Student;
}

export async function deleteStudent(id: string) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
