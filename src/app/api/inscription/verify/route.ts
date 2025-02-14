import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Vérifier si l'email existe déjà
    const { data: existingUser, error: userError } = await supabase
      .from('auto_ecoles')
      .select('email')
      .eq('email', data.email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 = not found, c'est ce qu'on veut
      throw userError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cette adresse email est déjà utilisée' },
        { status: 400 }
      );
    }

    // Vérifier si le SIRET existe déjà
    const { data: existingSiret, error: siretError } = await supabase
      .from('auto_ecoles')
      .select('siret')
      .eq('siret', data.siret)
      .single();

    if (siretError && siretError.code !== 'PGRST116') {
      throw siretError;
    }

    if (existingSiret) {
      return NextResponse.json(
        { error: 'Ce numéro SIRET est déjà utilisé' },
        { status: 400 }
      );
    }

    // Si tout est ok, on peut passer au paiement
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la vérification' },
      { status: 500 }
    );
  }
}
