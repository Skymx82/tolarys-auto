-- Création des extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprime la table si elle existe (avec CASCADE pour supprimer aussi les politiques)
DROP TABLE IF EXISTS lessons CASCADE;

-- Création de la table lessons (leçons)
CREATE TABLE lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id) NOT NULL,
    student_id UUID REFERENCES students(id) NOT NULL,
    instructor_id UUID REFERENCES moniteurs(id) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- durée en minutes
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    location TEXT, -- lieu de rendez-vous
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_duration CHECK (
        EXTRACT(EPOCH FROM (end_time - start_time))/60 = duration
    )
);

-- Créer un index pour améliorer les performances des requêtes par date
CREATE INDEX idx_lessons_start_time ON lessons(start_time);
CREATE INDEX idx_lessons_auto_ecole ON lessons(auto_ecole_id);
CREATE INDEX idx_lessons_instructor ON lessons(instructor_id);
CREATE INDEX idx_lessons_student ON lessons(student_id);

-- Active RLS (Row Level Security)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Créer les politiques de sécurité
CREATE POLICY "Lecture pour l'auto-école" ON lessons
    FOR SELECT
    USING (
        auto_ecole_id IN (
            SELECT id FROM auto_ecoles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Insertion pour l'auto-école" ON lessons
    FOR INSERT
    WITH CHECK (
        auto_ecole_id IN (
            SELECT id FROM auto_ecoles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON lessons
    FOR UPDATE
    USING (
        auto_ecole_id IN (
            SELECT id FROM auto_ecoles
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        auto_ecole_id IN (
            SELECT id FROM auto_ecoles
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Suppression pour l'auto-école" ON lessons
    FOR DELETE
    USING (
        auto_ecole_id IN (
            SELECT id FROM auto_ecoles
            WHERE user_id = auth.uid()
        )
    );

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour vérifier les conflits de planning
CREATE OR REPLACE FUNCTION check_lesson_conflicts()
RETURNS TRIGGER AS $$
BEGIN
    -- Vérifie les conflits pour l'instructeur
    IF EXISTS (
        SELECT 1 FROM lessons
        WHERE instructor_id = NEW.instructor_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND status != 'cancelled'
        AND (
            (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Le moniteur a déjà une leçon prévue sur ce créneau';
    END IF;

    -- Vérifie les conflits pour l'étudiant (optionnel, décommentez si nécessaire)
    -- IF EXISTS (
    --     SELECT 1 FROM lessons
    --     WHERE student_id = NEW.student_id
    --     AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    --     AND status != 'cancelled'
    --     AND (
    --         (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
    --     )
    -- ) THEN
    --     RAISE EXCEPTION 'L''étudiant a déjà une leçon prévue sur ce créneau';
    -- END IF;

    -- Vérifie les conflits pour le véhicule (si un véhicule est spécifié)
    IF NEW.vehicle_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM lessons
        WHERE vehicle_id = NEW.vehicle_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
        AND status != 'cancelled'
        AND (
            (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
        )
    ) THEN
        RAISE EXCEPTION 'Le véhicule est déjà utilisé sur ce créneau';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour vérifier les conflits avant insertion ou mise à jour
DROP TRIGGER IF EXISTS check_lesson_conflicts_trigger ON lessons;
CREATE TRIGGER check_lesson_conflicts_trigger
    BEFORE INSERT OR UPDATE ON lessons
    FOR EACH ROW
    EXECUTE FUNCTION check_lesson_conflicts();
