-- Suppression des anciennes politiques
DROP POLICY IF EXISTS "Autoriser l'insertion publique" ON auto_ecoles;
DROP POLICY IF EXISTS "Lecture uniquement pour les propriétaires" ON auto_ecoles;
DROP POLICY IF EXISTS "Autoriser l'insertion publique" ON utilisateurs;
DROP POLICY IF EXISTS "Lecture uniquement pour les propriétaires" ON utilisateurs;

-- Suppression des tables existantes
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS auto_ecoles CASCADE;
DROP TABLE IF EXISTS temp_passwords CASCADE;

-- Création de la table auto_ecoles
CREATE TABLE auto_ecoles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    nom VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    adresse TEXT NOT NULL,
    ville VARCHAR(255) NOT NULL,
    code_postal VARCHAR(5) NOT NULL,
    telephone VARCHAR(15),
    email VARCHAR(255) NOT NULL UNIQUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    UNIQUE(user_id)
);

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    dernier_login TIMESTAMP WITH TIME ZONE,
    statut VARCHAR(20) DEFAULT 'actif',
    UNIQUE(user_id)
);

-- Active RLS pour toutes les tables
ALTER TABLE auto_ecoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Politiques pour auto_ecoles
CREATE POLICY "Permettre l'insertion publique" ON auto_ecoles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture pour le propriétaire" ON auto_ecoles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Modification pour le propriétaire" ON auto_ecoles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppression pour le propriétaire" ON auto_ecoles
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour utilisateurs
CREATE POLICY "Permettre l'insertion publique" ON utilisateurs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Lecture pour le propriétaire" ON utilisateurs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Modification pour le propriétaire" ON utilisateurs
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppression pour le propriétaire" ON utilisateurs
    FOR DELETE USING (auth.uid() = user_id);
