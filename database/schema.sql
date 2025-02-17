-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS moniteurs CASCADE;
DROP TABLE IF EXISTS auto_ecoles CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;

-- Create auto_ecoles table
CREATE TABLE auto_ecoles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    nom VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    adresse TEXT,
    ville VARCHAR(255),
    code_postal VARCHAR(5),
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    logo_url TEXT,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

-- Create utilisateurs table
CREATE TABLE utilisateurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    user_id UUID REFERENCES auth.users(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'moniteur', 'eleve')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

-- Create moniteurs table
CREATE TABLE moniteurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    specialites TEXT[] DEFAULT '{}',
    disponibilites JSONB DEFAULT '{
        "lundi": [],
        "mardi": [],
        "mercredi": [],
        "jeudi": [],
        "vendredi": [],
        "samedi": [],
        "dimanche": []
    }'::jsonb,
    note_moyenne DECIMAL(2,1) DEFAULT 0.0,
    total_lecons INTEGER DEFAULT 0,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);

-- Enable Row Level Security
ALTER TABLE auto_ecoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moniteurs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Lecture pour l'utilisateur propriétaire" ON auto_ecoles;
DROP POLICY IF EXISTS "Modification pour l'utilisateur propriétaire" ON auto_ecoles;
DROP POLICY IF EXISTS "Lecture pour l'utilisateur de l'auto-école" ON utilisateurs;
DROP POLICY IF EXISTS "Modification pour l'admin de l'auto-école" ON utilisateurs;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON moniteurs;

-- Policies for auto_ecoles
CREATE POLICY "Lecture pour l'utilisateur propriétaire" ON auto_ecoles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Modification pour l'utilisateur propriétaire" ON auto_ecoles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policies for utilisateurs
CREATE POLICY "Lecture pour l'utilisateur de l'auto-école" ON utilisateurs
    FOR SELECT
    USING (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
        OR
        auth.uid() = user_id
    );

CREATE POLICY "Modification pour l'admin de l'auto-école" ON utilisateurs
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM utilisateurs u 
            WHERE u.user_id = auth.uid() 
            AND u.role = 'admin'
            AND u.auto_ecole_id = utilisateurs.auto_ecole_id
        )
    );

-- Policies for moniteurs
CREATE POLICY "Lecture pour l'auto-école" ON moniteurs
    FOR SELECT
    USING (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Insertion pour l'auto-école" ON moniteurs
    FOR INSERT
    WITH CHECK (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON moniteurs
    FOR UPDATE
    USING (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Suppression pour l'auto-école" ON moniteurs
    FOR DELETE
    USING (
        auto_ecole_id IN (
            SELECT ae.id 
            FROM auto_ecoles ae 
            WHERE ae.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_auto_ecoles_user_id ON auto_ecoles(user_id);
CREATE INDEX idx_utilisateurs_auto_ecole_id ON utilisateurs(auto_ecole_id);
CREATE INDEX idx_utilisateurs_user_id ON utilisateurs(user_id);
CREATE INDEX idx_moniteurs_auto_ecole_id ON moniteurs(auto_ecole_id);
