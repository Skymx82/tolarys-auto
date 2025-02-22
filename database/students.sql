-- Supprimer la table si elle existe (cela supprimera aussi automatiquement toutes les politiques)
DROP TABLE IF EXISTS students CASCADE;

-- Table des étudiants avec tous les champs nécessaires
CREATE TABLE students (
    -- Informations de base
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15),
    birth_date VARCHAR(10),
    address TEXT,
    postal_code VARCHAR(5),
    city VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif',
    
    -- Progression théorique
    theory_status VARCHAR(20) CHECK (theory_status IN ('completed', 'in_progress', 'not_started')) DEFAULT 'not_started',
    theory_score VARCHAR(5) DEFAULT '0',
    theory_exam_date VARCHAR(10),
    
    -- Progression pratique
    practical_status VARCHAR(20) CHECK (practical_status IN ('completed', 'in_progress', 'not_started')) DEFAULT 'not_started',
    practical_hours_done INTEGER DEFAULT 0,
    practical_total_hours INTEGER DEFAULT 20,
    practical_next_lesson VARCHAR(20),
    
    -- Paiements
    payment_status VARCHAR(20) CHECK (payment_status IN ('up_to_date', 'pending', 'overdue')) DEFAULT 'pending',
    payment_total_paid DECIMAL(10,2) DEFAULT 0,
    payment_total_due DECIMAL(10,2) DEFAULT 1200
);

-- Activer la sécurité niveau ligne pour la table students
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Lecture pour les moniteurs" ON students;
DROP POLICY IF EXISTS "Modification pour les moniteurs" ON students;

-- Politique pour les propriétaires d'auto-école
CREATE POLICY "Lecture pour l'auto-école" ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = students.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Insertion pour l'auto-école" ON students
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = students.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON students
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = students.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Suppression pour l'auto-école" ON students
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = students.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

-- Politique pour les moniteurs
CREATE POLICY "Lecture pour les moniteurs" ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM utilisateurs u 
            WHERE u.user_id = auth.uid() 
            AND u.role = 'moniteur'
            AND u.auto_ecole_id = students.auto_ecole_id
        )
    );

CREATE POLICY "Modification pour les moniteurs" ON students
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM utilisateurs u 
            WHERE u.user_id = auth.uid() 
            AND u.role = 'moniteur'
            AND u.auto_ecole_id = students.auto_ecole_id
        )
    );

-- Index pour améliorer les performances des requêtes
CREATE INDEX students_auto_ecole_id_idx ON students(auto_ecole_id);
CREATE INDEX students_email_idx ON students(email);
CREATE INDEX students_created_at_idx ON students(created_at);
