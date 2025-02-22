-- Supprimer la table si elle existe
DROP TABLE IF EXISTS exams CASCADE;

-- Créer la table des examens
CREATE TABLE exams (
    -- Clé primaire
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Relations
    auto_ecole_id UUID REFERENCES auto_ecoles(id) NOT NULL,
    student_id UUID REFERENCES students(id) NOT NULL,
    instructor_id UUID REFERENCES moniteurs(id) NOT NULL,
    
    -- Informations sur l'examen
    type VARCHAR(20) CHECK (type IN ('code', 'practical')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'completed', 'cancelled')) NOT NULL DEFAULT 'scheduled',
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT,
    
    -- Résultats
    result VARCHAR(20) CHECK (result IN ('success', 'fail', 'pending')) DEFAULT 'pending',
    score VARCHAR(5),
    feedback TEXT,
    notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activer la sécurité niveau ligne
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Lecture pour les moniteurs" ON exams;

-- Politique pour les propriétaires d'auto-école
CREATE POLICY "Lecture pour l'auto-école" ON exams
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = exams.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Insertion pour l'auto-école" ON exams
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = exams.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON exams
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = exams.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Suppression pour l'auto-école" ON exams
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = exams.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

-- Politique pour les moniteurs (lecture seule)
CREATE POLICY "Lecture pour les moniteurs" ON exams
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM utilisateurs u 
            WHERE u.user_id = auth.uid() 
            AND u.role = 'moniteur'
            AND u.auto_ecole_id = exams.auto_ecole_id
        )
    );

-- Créer des index pour améliorer les performances
CREATE INDEX exams_auto_ecole_id_idx ON exams(auto_ecole_id);
CREATE INDEX exams_student_id_idx ON exams(student_id);
CREATE INDEX exams_instructor_id_idx ON exams(instructor_id);
CREATE INDEX exams_date_idx ON exams(date);
CREATE INDEX exams_status_idx ON exams(status);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON exams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
