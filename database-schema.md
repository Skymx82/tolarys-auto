# Structure de la Base de Données - Tolarys Auto-École

## Tables Principales

### 1. auto_ecoles
```sql
CREATE TABLE auto_ecoles (
    id UUID PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    siret VARCHAR(14) NOT NULL UNIQUE,
    adresse TEXT NOT NULL,
    ville VARCHAR(255) NOT NULL,
    code_postal VARCHAR(5) NOT NULL,
    telephone VARCHAR(15),
    email VARCHAR(255) NOT NULL UNIQUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 2. utilisateurs
```sql
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'admin', 'moniteur', 'secretaire'
    telephone VARCHAR(15),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dernier_login TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 3. eleves
```sql
CREATE TABLE eleves (
    id UUID PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(15),
    adresse TEXT,
    ville VARCHAR(255),
    code_postal VARCHAR(5),
    numero_dossier VARCHAR(50) UNIQUE,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 4. forfaits
```sql
CREATE TABLE forfaits (
    id UUID PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    nombre_heures INT NOT NULL,
    type_permis VARCHAR(50) NOT NULL, -- 'B', 'A', 'A1', etc.
    inclus_code BOOLEAN DEFAULT false,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 5. inscriptions_forfaits
```sql
CREATE TABLE inscriptions_forfaits (
    id UUID PRIMARY KEY,
    eleve_id UUID REFERENCES eleves(id),
    forfait_id UUID REFERENCES forfaits(id),
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP,
    montant_paye DECIMAL(10,2) DEFAULT 0,
    statut_paiement VARCHAR(20) DEFAULT 'en_attente',
    heures_effectuees INT DEFAULT 0,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 6. lecons
```sql
CREATE TABLE lecons (
    id UUID PRIMARY KEY,
    eleve_id UUID REFERENCES eleves(id),
    moniteur_id UUID REFERENCES utilisateurs(id),
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    type_lecon VARCHAR(50) NOT NULL, -- 'conduite', 'code', 'evaluation'
    statut VARCHAR(20) DEFAULT 'planifie',
    commentaire TEXT,
    note INT,
    inscription_forfait_id UUID REFERENCES inscriptions_forfaits(id)
);
```

### 7. paiements
```sql
CREATE TABLE paiements (
    id UUID PRIMARY KEY,
    inscription_forfait_id UUID REFERENCES inscriptions_forfaits(id),
    montant DECIMAL(10,2) NOT NULL,
    date_paiement TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    mode_paiement VARCHAR(50) NOT NULL, -- 'cb', 'especes', 'cheque'
    reference_transaction VARCHAR(255),
    statut VARCHAR(20) DEFAULT 'complete'
);
```

### 8. examens
```sql
CREATE TABLE examens (
    id UUID PRIMARY KEY,
    eleve_id UUID REFERENCES eleves(id),
    type_examen VARCHAR(50) NOT NULL, -- 'code', 'conduite'
    date_examen TIMESTAMP NOT NULL,
    centre_examen VARCHAR(255),
    resultat VARCHAR(20), -- 'reussite', 'echec', 'absent'
    commentaire TEXT,
    moniteur_id UUID REFERENCES utilisateurs(id)
);
```

### 9. documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY,
    eleve_id UUID REFERENCES eleves(id),
    type_document VARCHAR(50) NOT NULL, -- 'carte_identite', 'justificatif_domicile', etc.
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    date_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut VARCHAR(20) DEFAULT 'valide'
);
```

### 10. vehicules
```sql
CREATE TABLE vehicules (
    id UUID PRIMARY KEY,
    auto_ecole_id UUID REFERENCES auto_ecoles(id),
    marque VARCHAR(255) NOT NULL,
    modele VARCHAR(255) NOT NULL,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    date_mise_service DATE NOT NULL,
    prochaine_revision DATE,
    statut VARCHAR(20) DEFAULT 'actif'
);
```

### 11. disponibilites_moniteurs
```sql
CREATE TABLE disponibilites_moniteurs (
    id UUID PRIMARY KEY,
    moniteur_id UUID REFERENCES utilisateurs(id),
    jour_semaine INT NOT NULL, -- 1 à 7
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    recurrent BOOLEAN DEFAULT true
);
```

### 12. statistiques_eleves
```sql
CREATE TABLE statistiques_eleves (
    id UUID PRIMARY KEY,
    eleve_id UUID REFERENCES eleves(id),
    nombre_heures_conduites INT DEFAULT 0,
    nombre_examens_code INT DEFAULT 0,
    nombre_examens_conduite INT DEFAULT 0,
    moyenne_notes DECIMAL(4,2),
    derniere_mise_a_jour TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes Recommandés

```sql
-- Indexes pour les recherches fréquentes
CREATE INDEX idx_eleves_auto_ecole ON eleves(auto_ecole_id);
CREATE INDEX idx_lecons_date ON lecons(date_debut);
CREATE INDEX idx_lecons_moniteur ON lecons(moniteur_id);
CREATE INDEX idx_lecons_eleve ON lecons(eleve_id);
CREATE INDEX idx_paiements_inscription ON paiements(inscription_forfait_id);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX idx_examens_date ON examens(date_examen);
CREATE INDEX idx_documents_type ON documents(type_document);
```

## Notes Importantes

1. Utilisation d'UUID pour les clés primaires pour faciliter la distribution et éviter les conflits
2. Timestamps pour suivre la création et les modifications
3. Champs statut pour la gestion des soft deletes
4. Relations établies via les clés étrangères
5. Indexes sur les colonnes fréquemment utilisées pour les recherches

## Considérations de Sécurité

1. Mots de passe hashés dans la table utilisateurs
2. Données sensibles (comme les informations personnelles) à encoder
3. Mise en place de politiques RGPD pour la gestion des données personnelles
4. Logs d'audit à implémenter pour les modifications sensibles
