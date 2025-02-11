-- Supprime d'abord toutes les politiques existantes
DROP POLICY IF EXISTS "Autoriser l'insertion publique" ON auto_ecoles;
DROP POLICY IF EXISTS "Lecture uniquement pour les propriétaires" ON auto_ecoles;
DROP POLICY IF EXISTS "Autoriser l'insertion publique" ON utilisateurs;
DROP POLICY IF EXISTS "Lecture uniquement pour les propriétaires" ON utilisateurs;

-- Supprime les tables existantes
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS auto_ecoles CASCADE;

-- Création de la table auto_ecoles
CREATE TABLE auto_ecoles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    adresse TEXT NOT NULL,
    ville VARCHAR(255) NOT NULL,
    code_postal VARCHAR(5) NOT NULL,
    telephone VARCHAR(15),
    email VARCHAR(255) NOT NULL UNIQUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    dernier_login TIMESTAMP WITH TIME ZONE,
    statut VARCHAR(20) DEFAULT 'actif'
);

-- Active RLS
ALTER TABLE auto_ecoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;

-- Crée des politiques simples pour permettre l'inscription
CREATE POLICY "Permettre toutes les opérations" ON auto_ecoles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permettre toutes les opérations" ON utilisateurs
    FOR ALL USING (true) WITH CHECK (true);
