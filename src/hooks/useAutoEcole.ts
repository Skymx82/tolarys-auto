import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';

interface AutoEcole {
  id: string;
  nom: string;
  siret: string;
  email: string;
}

export function useAutoEcole() {
  const [autoEcole, setAutoEcole] = useState<AutoEcole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchAutoEcole() {
      try {
        // 1. Récupérer l'utilisateur
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error('Aucun utilisateur connecté');
        }

        // 2. Essayer d'abord de récupérer l'auto-école directement
        let { data: autoEcoleData, error: directAutoEcoleError } = await supabase
          .from('auto_ecoles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Si on ne trouve pas d'auto-école directement, essayer via la table utilisateurs
        if (directAutoEcoleError) {
          const { data: utilisateur, error: utilisateurError } = await supabase
            .from('utilisateurs')
            .select('auto_ecole_id')
            .eq('user_id', user.id)
            .single();

          if (utilisateurError) {
            // Si l'utilisateur vient de s'inscrire, il n'aura pas encore d'entrée
            setAutoEcole(null);
            return;
          }

          if (utilisateur?.auto_ecole_id) {
            const { data: linkedAutoEcole, error: linkedAutoEcoleError } = await supabase
              .from('auto_ecoles')
              .select('*')
              .eq('id', utilisateur.auto_ecole_id)
              .single();

            if (linkedAutoEcoleError) {
              throw linkedAutoEcoleError;
            }

            autoEcoleData = linkedAutoEcole;
          }
        }

        setAutoEcole(autoEcoleData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setAutoEcole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAutoEcole();
  }, [supabase]);

  return { autoEcole, loading, error };
}
