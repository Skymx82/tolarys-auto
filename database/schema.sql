-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS moniteurs CASCADE;
DROP TABLE IF EXISTS auto_ecoles CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS vehicle_features CASCADE;
DROP TABLE IF EXISTS vehicle_maintenance CASCADE;
DROP TABLE IF EXISTS vehicle_insurance CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;

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

-- Create students table
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

-- Create exams table
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
    
    -- Informations sur le véhicule (pour les examens pratiques)
    vehicle_brand VARCHAR(255),
    vehicle_model VARCHAR(255),
    vehicle_license_plate VARCHAR(20),
    
    -- Résultats
    result VARCHAR(20) CHECK (result IN ('success', 'fail', 'pending')) DEFAULT 'pending',
    score VARCHAR(5),
    feedback TEXT,
    notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Contrainte pour s'assurer que les informations du véhicule sont renseignées uniquement pour les examens pratiques
    CONSTRAINT vehicle_info_for_practical CHECK (
        (type = 'practical' AND vehicle_brand IS NOT NULL AND vehicle_model IS NOT NULL AND vehicle_license_plate IS NOT NULL) OR
        (type = 'code' AND vehicle_brand IS NULL AND vehicle_model IS NULL AND vehicle_license_plate IS NULL)
    )
);

-- Create vehicles table
CREATE TABLE vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    year INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('manual', 'automatic')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'maintenance', 'inactive')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicle_insurance table
CREATE TABLE vehicle_insurance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    policy_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_id)
);

-- Create vehicle_maintenance table
CREATE TABLE vehicle_maintenance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    last_service DATE NOT NULL,
    next_service DATE NOT NULL,
    mileage INTEGER NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_id)
);

-- Create vehicle_features table
CREATE TABLE vehicle_features (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    feature VARCHAR(50) NOT NULL,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vehicle_id, feature)
);

-- Enable Row Level Security
ALTER TABLE auto_ecoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisateurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moniteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Lecture pour l'utilisateur propriétaire" ON auto_ecoles;
DROP POLICY IF EXISTS "Modification pour l'utilisateur propriétaire" ON auto_ecoles;
DROP POLICY IF EXISTS "Lecture pour l'utilisateur de l'auto-école" ON utilisateurs;
DROP POLICY IF EXISTS "Modification pour l'admin de l'auto-école" ON utilisateurs;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON moniteurs;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON students;
DROP POLICY IF EXISTS "Lecture pour les moniteurs" ON students;
DROP POLICY IF EXISTS "Modification pour les moniteurs" ON students;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Insertion pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON exams;
DROP POLICY IF EXISTS "Lecture pour les moniteurs" ON exams;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON vehicles;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON vehicles;
DROP POLICY IF EXISTS "Mise à jour pour l'auto-école" ON vehicles;
DROP POLICY IF EXISTS "Suppression pour l'auto-école" ON vehicles;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON vehicle_insurance;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON vehicle_insurance;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON vehicle_maintenance;
DROP POLICY IF EXISTS "Lecture pour l'auto-école" ON vehicle_features;
DROP POLICY IF EXISTS "Modification pour l'auto-école" ON vehicle_features;

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
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = utilisateurs.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
        OR auth.uid() = user_id
    );

CREATE POLICY "Modification pour l'admin de l'auto-école" ON utilisateurs
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = utilisateurs.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
        OR (
            auth.uid() = user_id 
            AND role = 'admin'
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

-- Policies for students
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

-- Policies for exams
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

-- Policies for vehicles
CREATE POLICY "Lecture pour l'auto-école" ON vehicles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = vehicles.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON vehicles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Mise à jour pour l'auto-école" ON vehicles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = vehicles.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Suppression pour l'auto-école" ON vehicles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 
            FROM auto_ecoles ae 
            WHERE ae.id = vehicles.auto_ecole_id 
            AND ae.user_id = auth.uid()
        )
    );

-- Create policies for vehicle_insurance
CREATE POLICY "Lecture pour l'auto-école" ON vehicle_insurance
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_insurance.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON vehicle_insurance
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_insurance.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

-- Create policies for vehicle_maintenance
CREATE POLICY "Lecture pour l'auto-école" ON vehicle_maintenance
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_maintenance.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON vehicle_maintenance
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_maintenance.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

-- Create policies for vehicle_features
CREATE POLICY "Lecture pour l'auto-école" ON vehicle_features
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_features.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

CREATE POLICY "Modification pour l'auto-école" ON vehicle_features
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM vehicles v
            JOIN auto_ecoles ae ON ae.id = v.auto_ecole_id 
            WHERE v.id = vehicle_features.vehicle_id
            AND ae.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_auto_ecoles_user_id ON auto_ecoles(user_id);
CREATE INDEX idx_utilisateurs_auto_ecole_id ON utilisateurs(auto_ecole_id);
CREATE INDEX idx_utilisateurs_user_id ON utilisateurs(user_id);
CREATE INDEX idx_moniteurs_auto_ecole_id ON moniteurs(auto_ecole_id);
CREATE INDEX students_auto_ecole_id_idx ON students(auto_ecole_id);
CREATE INDEX students_email_idx ON students(email);
CREATE INDEX students_created_at_idx ON students(created_at);
CREATE INDEX exams_auto_ecole_id_idx ON exams(auto_ecole_id);
CREATE INDEX exams_student_id_idx ON exams(student_id);
CREATE INDEX exams_instructor_id_idx ON exams(instructor_id);
CREATE INDEX exams_date_idx ON exams(date);
CREATE INDEX exams_status_idx ON exams(status);
CREATE INDEX IF NOT EXISTS vehicles_auto_ecole_id_idx ON vehicles(auto_ecole_id);
CREATE INDEX IF NOT EXISTS vehicle_insurance_vehicle_id_idx ON vehicle_insurance(vehicle_id);
CREATE INDEX IF NOT EXISTS vehicle_maintenance_vehicle_id_idx ON vehicle_maintenance(vehicle_id);
CREATE INDEX IF NOT EXISTS vehicle_features_vehicle_id_idx ON vehicle_features(vehicle_id);

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
