import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    // Vérifier le paiement avec Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Le paiement n\'a pas été effectué' },
        { status: 400 }
      );
    }

    // Récupérer les données du formulaire depuis les métadonnées
    const formData = session.metadata as any;
    if (!formData) {
      return NextResponse.json(
        { error: 'Données du formulaire non trouvées' },
        { status: 400 }
      );
    }

    // Créer un nouvel utilisateur dans Supabase Auth avec le mot de passe choisi
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: formData.password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Créer l'auto-école
    const { data: autoEcole, error: autoEcoleError } = await supabase
      .from('auto_ecoles')
      .insert({
        user_id: authData.user.id,
        nom: formData.nomAutoEcole,
        siret: formData.siret,
        adresse: formData.adresse,
        ville: formData.ville,
        code_postal: formData.codePostal,
        email: formData.email,
        telephone: formData.telephone,
        statut: 'actif'
      })
      .select()
      .single();

    if (autoEcoleError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw autoEcoleError;
    }

    // Créer l'utilisateur admin
    const [prenom, ...nomArray] = formData.nomResponsable.split(' ');
    const nom = nomArray.join(' ');

    const { error: utilisateurError } = await supabase
      .from('utilisateurs')
      .insert({
        auto_ecole_id: autoEcole.id,
        user_id: authData.user.id,
        nom: nom || 'Non spécifié',
        prenom: prenom,
        email: formData.email,
        telephone: formData.telephone,
        role: 'admin',
        statut: 'actif'
      });

    if (utilisateurError) {
      await supabase
        .from('auto_ecoles')
        .delete()
        .match({ id: autoEcole.id });
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw utilisateurError;
    }

    return NextResponse.json({
      email: formData.email
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue lors de l\'inscription' },
      { status: 500 }
    );
  }
}
