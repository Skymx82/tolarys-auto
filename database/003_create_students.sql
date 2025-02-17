-- Ajout des colonnes nécessaires pour les élèves
ALTER TABLE utilisateurs
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS postal_code text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'eleve',
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Création d'une politique pour les élèves
CREATE POLICY "Les élèves peuvent voir leurs propres données"
ON utilisateurs
FOR SELECT
USING (auth.uid() = id OR role = 'moniteur' OR role = 'admin');

-- Création d'une politique pour l'insertion d'élèves
CREATE POLICY "Les moniteurs peuvent ajouter des élèves"
ON utilisateurs
FOR INSERT
WITH CHECK (role = 'moniteur' OR role = 'admin');

-- Création d'une politique pour la modification d'élèves
CREATE POLICY "Les moniteurs peuvent modifier les données des élèves"
ON utilisateurs
FOR UPDATE
USING (role = 'moniteur' OR role = 'admin')
WITH CHECK (role = 'moniteur' OR role = 'admin');

-- Création d'une politique pour la suppression d'élèves
CREATE POLICY "Les moniteurs peuvent supprimer des élèves"
ON utilisateurs
FOR DELETE
USING (role = 'moniteur' OR role = 'admin');
