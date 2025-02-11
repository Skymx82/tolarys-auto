'use client';

import Footer from '@/components/Footer';

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de Gestion des Cookies</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p className="text-gray-600">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Les cookies que nous utilisons</h2>
              <p className="text-gray-600">
                Nous utilisons différents types de cookies :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Cookies essentiels : nécessaires au fonctionnement du site</li>
                <li>Cookies de performance : pour analyser l'utilisation du site</li>
                <li>Cookies de fonctionnalité : pour mémoriser vos préférences</li>
                <li>Cookies de ciblage : pour personnaliser votre expérience</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Durée de conservation</h2>
              <p className="text-gray-600">
                Les cookies peuvent être :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>Temporaires (supprimés à la fermeture du navigateur)</li>
                <li>Permanents (restent jusqu'à leur expiration ou suppression)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Gestion des cookies</h2>
              <p className="text-gray-600">
                Vous pouvez à tout moment choisir de désactiver ces cookies. Votre navigateur peut également être paramétré pour vous signaler les cookies qui sont déposés dans votre terminal et vous demander de les accepter ou non.
              </p>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comment gérer vos cookies :</h3>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Chrome : Menu → Paramètres → Confidentialité et sécurité</li>
                  <li>Firefox : Menu → Options → Vie privée et sécurité</li>
                  <li>Safari : Préférences → Confidentialité</li>
                  <li>Edge : Menu → Paramètres → Confidentialité et services</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Impact de la désactivation des cookies</h2>
              <p className="text-gray-600">
                La désactivation des cookies peut empêcher l'utilisation de certaines fonctionnalités du site. Notamment :
              </p>
              <ul className="list-disc pl-6 mt-4 text-gray-600">
                <li>La connexion automatique</li>
                <li>L'adaptation du site à vos préférences</li>
                <li>Certaines fonctionnalités interactives</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact</h2>
              <p className="text-gray-600">
                Pour toute question concernant notre politique de cookies, contactez-nous à :<br />
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
