'use client';

import Footer from '@/components/Footer';

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Confidentialité</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Collecte des données personnelles</h2>
              <p className="text-gray-600">
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Informations de connexion</li>
                <li>Données de navigation</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
              <p className="text-gray-600">
                Les données collectées sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Fournir et améliorer nos services</li>
                <li>Personnaliser votre expérience</li>
                <li>Communiquer avec vous</li>
                <li>Assurer la sécurité de votre compte</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Protection des données</h2>
              <p className="text-gray-600">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés. Ces mesures incluent le chiffrement des données, les pare-feu et les contrôles d'accès.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Vos droits</h2>
              <p className="text-gray-600">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ces droits, contactez-nous à l'adresse : tolarystoulouse@gmail.com
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
              <p className="text-gray-600">
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour être informé lorsqu'un cookie est envoyé.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Partage des données</h2>
              <p className="text-gray-600">
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec des tiers uniquement dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Avec votre consentement</li>
                <li>Pour des raisons légales</li>
                <li>Avec nos prestataires de services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-600">
                Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, contactez-nous à :<br />
                Email : tolarystoulouse@gmail.com<br />
                Adresse : 11 Rue Lafayette, 31000 Toulouse, France
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
