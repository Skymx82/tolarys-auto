'use client';

import Footer from '@/components/Footer';

export default function CGV() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
              <p className="text-gray-600">
                Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du service Tolarys, une solution de gestion pour auto-écoles, fournie par Tolarys, micro-entreprise en cours d'immatriculation, située au 11 Rue Lafayette, 31000 Toulouse.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Services proposés</h2>
              <p className="text-gray-600">
                Tolarys propose une solution logicielle comprenant :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Gestion des élèves et du planning</li>
                <li>Suivi pédagogique</li>
                <li>Gestion administrative</li>
                <li>Facturation et comptabilité</li>
                <li>Support technique</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Prix et modalités de paiement</h2>
              <p className="text-gray-600">
                Les prix sont indiqués en euros et hors taxes. Le paiement s'effectue par prélèvement mensuel ou annuel. Un essai gratuit de 30 jours est proposé pour tester le service.
              </p>
              <p className="text-gray-600 mt-4">
                Tarification :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Abonnement mensuel : 149,99€ HT</li>
                <li>Engagement minimum : aucun</li>
                <li>Facturation : mensuelle, terme à échoir</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Durée et résiliation</h2>
              <p className="text-gray-600">
                L'abonnement est conclu pour une durée indéterminée. Le client peut résilier à tout moment avec un préavis de 30 jours. La résiliation doit être notifiée par email à tolarystoulouse@gmail.com.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Obligations de Tolarys</h2>
              <p className="text-gray-600">
                Tolarys s'engage à :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Assurer la disponibilité du service 99,9% du temps</li>
                <li>Sauvegarder les données quotidiennement</li>
                <li>Fournir un support technique réactif</li>
                <li>Maintenir la sécurité des données</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Obligations du client</h2>
              <p className="text-gray-600">
                Le client s'engage à :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Fournir des informations exactes</li>
                <li>Maintenir la confidentialité de ses identifiants</li>
                <li>Utiliser le service conformément à la loi</li>
                <li>Payer les factures aux échéances prévues</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
              <p className="text-gray-600">
                Tous les droits de propriété intellectuelle relatifs au service Tolarys restent la propriété exclusive de Tolarys. Le client bénéficie d'un droit d'utilisation limité pendant la durée de son abonnement.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Protection des données</h2>
              <p className="text-gray-600">
                Tolarys s'engage à respecter la réglementation en vigueur applicable au traitement de données à caractère personnel et, en particulier, le règlement (UE) 2016/679 du Parlement européen (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Loi applicable et juridiction</h2>
              <p className="text-gray-600">
                Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux de Toulouse seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
