import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types pour TypeScript
export type Database = {
  auto_ecoles: {
    id: string
    nom: string
    siret: string
    adresse: string
    ville: string
    code_postal: string
    telephone?: string
    email: string
    date_creation: string
    statut: 'actif' | 'inactif'
  }
  utilisateurs: {
    id: string
    auto_ecole_id: string
    nom: string
    prenom: string
    email: string
    mot_de_passe: string
    role: 'admin' | 'moniteur' | 'secretaire'
    telephone?: string
    date_creation: string
    dernier_login?: string
    statut: 'actif' | 'inactif'
  }
  eleves: {
    id: string
    auto_ecole_id: string
    nom: string
    prenom: string
    date_naissance: string
    email?: string
    telephone?: string
    adresse?: string
    ville?: string
    code_postal?: string
    numero_dossier: string
    date_inscription: string
    statut: 'actif' | 'inactif'
  }
}
