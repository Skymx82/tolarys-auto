import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { generatePassword } from '@/utils/auth';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Générer un mot de passe aléatoire sécurisé
    const password = generatePassword();

    // Créer un nouvel utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: password,
      email_confirm: true // Confirmer automatiquement l'email
    });

    if (authError) throw authError;

    // Créer l'entrée dans la table companies
    const { error: dbError } = await supabase
      .from('companies')
      .insert({
        id: authData.user.id,
        name: data.nomAutoEcole,
        siret: data.siret,
        address: data.adresse,
        city: data.ville,
        postal_code: data.codePostal,
        manager_name: data.nomResponsable,
        email: data.email,
        phone: data.telephone,
        status: 'active'
      });

    if (dbError) throw dbError;

    // Retourner les identifiants
    return NextResponse.json({
      email: data.email,
      password: password
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
