import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePassword } from '@/utils/auth';
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

    // Générer un mot de passe sécurisé
    const password = generatePassword();

    // Créer un nouvel utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: password,
      email_confirm: true
    });

    if (authError) throw authError;

    // Stocker le mot de passe temporaire
    const { error: tempPasswordError } = await supabase
      .from('temp_passwords')
      .insert({
        user_id: authData.user.id,
        password: password
      });

    if (tempPasswordError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw tempPasswordError;
    }

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
      // En cas d'erreur, supprimer l'utilisateur et le mot de passe temporaire
      await supabase
        .from('temp_passwords')
        .delete()
        .match({ user_id: authData.user.id });
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
      // En cas d'erreur, tout nettoyer
      await supabase
        .from('auto_ecoles')
        .delete()
        .match({ id: autoEcole.id });
      await supabase
        .from('temp_passwords')
        .delete()
        .match({ user_id: authData.user.id });
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw utilisateurError;
    }

    // Retourner les identifiants
    return NextResponse.json({
      email: formData.email,
      password: password
    });

  } catch (error) {
    console.error('Erreur lors de la finalisation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la finalisation' },
      { status: 500 }
    );
  }
}
