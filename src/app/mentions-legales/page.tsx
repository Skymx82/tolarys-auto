'use client';

import Footer from '@/components/Footer';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informations légales</h2>
              <p className="text-gray-600">
                Le site Tolarys est édité par :<br />
                Tolarys<br />
                11 Rue Lafayette<br />
                31000 Toulouse, France<br />
                Email : tolarystoulouse@gmail.com<br />
                Téléphone : +33 6 12 34 56 78
              </p>
              <p className="text-gray-600 mt-4">
                Entreprise en cours d'immatriculation<br />
                Forme juridique : Micro-entreprise<br />
                Directeur de la publication : Mattias Mathevon
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
              <p className="text-gray-600">
                Le site Tolarys est hébergé par :<br />
                Vercel Inc.<br />
                340 S Lemon Ave #4133<br />
                Walnut, CA 91789<br />
                États-Unis
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
              <p className="text-gray-600">
                L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, sons...) est la propriété exclusive de Tolarys ou de ses partenaires. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de Tolarys.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Protection des données personnelles</h2>
              <p className="text-gray-600">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant. Pour exercer ces droits, contactez-nous à l'adresse : contact@tolarys.fr
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies</h2>
              <p className="text-gray-600">
                Le site Tolarys utilise des cookies pour améliorer l'expérience utilisateur. En navigant sur ce site, vous acceptez l'utilisation de cookies conformément à notre politique de cookies.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
              <p className="text-gray-600">
                Tolarys s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger le contenu à tout moment et sans préavis. Toutefois, Tolarys ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Droit applicable</h2>
              <p className="text-gray-600">
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
