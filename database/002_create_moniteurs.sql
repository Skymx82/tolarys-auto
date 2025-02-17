-- Supprimer la table si elle existe
DROP TABLE IF EXISTS moniteurs CASCADE;

-- Création de la table moniteurs de manière indépendante
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

-- Active RLS
ALTER TABLE moniteurs ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Permettre la lecture publique" ON moniteurs;
DROP POLICY IF EXISTS "Permettre l'insertion" ON moniteurs;
DROP POLICY IF EXISTS "Permettre la modification" ON moniteurs;

-- Créer les nouvelles politiques
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

-- Index pour améliorer les performances des recherches
CREATE INDEX idx_moniteurs_nom ON moniteurs(nom);
CREATE INDEX idx_moniteurs_email ON moniteurs(email);
CREATE INDEX idx_moniteurs_statut ON moniteurs(statut);
CREATE INDEX idx_moniteurs_auto_ecole ON moniteurs(auto_ecole_id);
