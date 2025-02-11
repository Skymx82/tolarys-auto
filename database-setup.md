# Configuration de la Base de Données avec Supabase

## Étape 1 : Créer un compte Supabase
1. Aller sur [https://supabase.com](https://supabase.com)
2. Créer un compte gratuit
3. Créer un nouveau projet

## Étape 2 : Installation des dépendances
```bash
npm install @supabase/supabase-js
```

## Étape 3 : Configuration des variables d'environnement
Ajouter dans votre .env.local :
```
NEXT_PUBLIC_SUPABASE_URL=votre_url_projet
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

## Étape 4 : Initialisation du client Supabase
Créer un fichier lib/supabase.ts :
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Avantages de Supabase
1. Interface d'administration intuitive
2. Authentication intégrée
3. Stockage de fichiers inclus
4. API REST automatique
5. Temps réel inclus
6. Backups automatiques

## Limites du Plan Gratuit
- 500MB de stockage base de données
- 1GB de stockage fichiers
- 50MB de stockage auth
- 2GB de transfert
- 50,000 requêtes API par mois

Ces limites sont largement suffisantes pour démarrer et tester l'application. Quand votre activité grandira, vous pourrez passer à un plan payant (à partir de $25/mois).
