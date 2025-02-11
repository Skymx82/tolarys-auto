-- Supprime les tables si elles existent
DROP TABLE IF EXISTS utilisateurs;
DROP TABLE IF EXISTS auto_ecoles;

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

-- Désactive temporairement RLS pour l'inscription
CREATE POLICY "Permettre toutes les opérations pendant l'inscription" ON auto_ecoles
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permettre toutes les opérations pendant l'inscription" ON utilisateurs
    FOR ALL USING (true) WITH CHECK (true);
