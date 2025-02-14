-- Création de la table pour les mots de passe temporaires
CREATE TABLE temp_passwords (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);

-- Active RLS
ALTER TABLE temp_passwords ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion
CREATE POLICY "Permettre l'insertion admin" ON temp_passwords
    FOR INSERT WITH CHECK (true);

-- Politique pour la lecture (uniquement pour l'utilisateur concerné)
CREATE POLICY "Lecture pour le propriétaire" ON temp_passwords
    FOR SELECT USING (auth.uid() = user_id);

-- Fonction pour supprimer les mots de passe temporaires utilisés après 24h
CREATE OR REPLACE FUNCTION cleanup_temp_passwords()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM temp_passwords
    WHERE used = true
    OR created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Créer un job pour nettoyer les mots de passe toutes les heures
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('cleanup_temp_passwords', '0 * * * *', 'SELECT cleanup_temp_passwords();');
