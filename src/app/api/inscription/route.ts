import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Données reçues:', body)  // Log des données reçues
    
    const {
      nomAutoEcole,
      siret,
      adresse,
      ville,
      codePostal,
      nomResponsable,
      email,
      telephone
    } = body

    // 1. Créer l'auto-école
    const { data: autoEcole, error: autoEcoleError } = await supabase
      .from('auto_ecoles')
      .insert([
        {
          nom: nomAutoEcole,
          siret: siret,
          adresse: adresse,
          ville: ville,
          code_postal: codePostal,
          email: email,
          telephone: telephone,
          statut: 'actif'
        }
      ])
      .select()
      .single()

    if (autoEcoleError) {
      console.error('Erreur Supabase:', autoEcoleError)  // Log de l'erreur Supabase
      return NextResponse.json(
        { error: `Erreur lors de la création de l'auto-école: ${autoEcoleError.message}` },
        { status: 400 }
      )
    }

    // 2. Créer l'utilisateur admin
    const [prenom, ...nomArray] = nomResponsable.split(' ')
    const nom = nomArray.join(' ')
    
    const { data: utilisateur, error: utilisateurError } = await supabase
      .from('utilisateurs')
      .insert([
        {
          auto_ecole_id: autoEcole.id,
          nom: nom || 'Non spécifié',
          prenom: prenom,
          email: email,
          role: 'admin',
          telephone: telephone,
          statut: 'actif'
        }
      ])
      .select()
      .single()

    if (utilisateurError) {
      console.error('Erreur Supabase (utilisateur):', utilisateurError)  // Log de l'erreur Supabase
      // Supprimer l'auto-école si la création de l'utilisateur échoue
      await supabase
        .from('auto_ecoles')
        .delete()
        .match({ id: autoEcole.id })

      return NextResponse.json(
        { error: `Erreur lors de la création de l'utilisateur: ${utilisateurError.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      autoEcole,
      utilisateur
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'inscription: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
