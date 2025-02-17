'use client';

import Link from 'next/link';
import { CheckIcon, StarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Footer from '@/components/Footer';

const testimonials = [
  {
    name: 'Marie Laurent',
    role: 'Directrice Auto-école Excellence',
    content: 'Depuis que nous utilisons Tolarys, notre chiffre d\'affaires a augmenté de 40%. La gestion automatisée nous fait gagner 20h par semaine.',
    rating: 5
  },
  {
    name: 'Thomas Dubois',
    role: 'Gérant Multi-agences',
    content: 'Tolarys nous a permis de passer de 1 à 3 agences en seulement 8 mois. Un investissement qui a révolutionné notre business.',
    rating: 5
  },
  {
    name: 'Sophie Martin',
    role: 'Auto-école du Centre',
    content: 'Le support client est exceptionnel. Nos élèves adorent l\'application mobile et nos moniteurs gagnent un temps précieux.',
    rating: 5
  }
];

const stats = [
  { value: '93%', label: 'de taux de satisfaction' },
  { value: '2.5x', label: 'de croissance moyenne' },
  { value: '20h', label: 'économisées par semaine' },
  { value: '40%', label: 'de CA supplémentaire' },
];

const features = [
  {
    name: 'Gestion tout-en-un',
    description: 'Planning, élèves, paiements, et véhicules dans une seule interface intuitive.'
  },
  {
    name: 'Application mobile',
    description: 'Vos élèves réservent leurs leçons directement depuis leur smartphone.'
  },
  {
    name: 'IA prédictive',
    description: 'Optimisez votre planning et anticipez vos besoins grâce à l\'intelligence artificielle.'
  },
  {
    name: 'Paiements automatisés',
    description: 'Fini les impayés avec notre système de prélèvement automatique.'
  }
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSecondImage, setIsSecondImage] = useState(false);

  return (
    <div className="bg-white">
      {/* Navbar */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#E91E63]">Tolarys-Auto</span>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/connexion"
                className="text-[#1E1E1E] hover:text-[#E91E63] transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="bg-[#E91E63] text-white px-4 py-2 rounded-md hover:bg-[#D81B60] transition-colors"
              >
                Démarrer maintenant
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-[#E91E63]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link
                href="/connexion"
                className="block text-[#1E1E1E] hover:text-[#E91E63] transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="block bg-[#E91E63] text-white px-4 py-2 rounded-md hover:bg-[#D81B60] transition-colors text-center"
              >
                Démarrer maintenant
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section avec Offre Limitée */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#E91E63] to-[#ff4081] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#E91E63]/10 text-[#E91E63] mb-8">
              <span className="text-sm font-semibold">🎉 Offre de lancement - 30% de réduction</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1E1E1E] mb-6">
              Révolutionnez la gestion de<br />votre auto-école
            </h1>
            <p className="text-xl text-[#1E1E1E]/70 mb-8 max-w-2xl mx-auto">
              Rejoignez les auto-écoles qui ont déjà multiplié leur chiffre d'affaires par 2.5 grâce à notre solution tout-en-un.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/inscription"
                className="w-full sm:w-auto px-8 py-4 bg-[#E91E63] text-white rounded-lg font-semibold hover:bg-[#D81B60] transition-all transform hover:scale-105 shadow-lg"
              >
                Commencer gratuitement pendant 30 jours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section Stats */}
      <div className="bg-[#F5F5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[#E91E63] mb-2">{stat.value}</div>
                <div className="text-sm text-[#1E1E1E]/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Fonctionnalités */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E1E]">
              Tout ce dont vous avez besoin pour réussir
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature) => (
              <div key={feature.name} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-[#E91E63]/10 flex items-center justify-center">
                    <CheckIcon className="w-6 h-6 text-[#E91E63]" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">{feature.name}</h3>
                  <p className="text-[#1E1E1E]/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Témoignages */}
      <div className="bg-[#F5F5F5] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E1E1E]">
              Ils ont transformé leur auto-école avec Tolarys
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-[#E91E63] fill-current" />
                  ))}
                </div>
                <p className="text-[#1E1E1E]/70 mb-4">{testimonial.content}</p>
                <div>
                  <div className="font-semibold text-[#1E1E1E]">{testimonial.name}</div>
                  <div className="text-sm text-[#1E1E1E]/70">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Démo Interactive */}
      <div className="py-24 bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#E91E63]/10 text-[#E91E63] mb-4">
              <span className="text-sm font-semibold">✨ Accès gratuit</span>
            </div>
            <h2 className="text-3xl font-bold text-[#1E1E1E] mb-4">
              Essayez Tolarys gratuitement
            </h2>
            <p className="text-xl text-[#1E1E1E]/70 max-w-2xl mx-auto">
              Découvrez comment Tolarys peut transformer votre auto-école. 
              Accédez à notre démo interactive sans engagement.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#1E1E1E] mb-6">
                  Ce qui vous attend dans la démo
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E91E63]/10 flex items-center justify-center">
                      <span className="text-[#E91E63] font-bold">1</span>
                    </div>
                    <span className="text-[#1E1E1E]">
                      Interface complète avec données de test
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E91E63]/10 flex items-center justify-center">
                      <span className="text-[#E91E63] font-bold">2</span>
                    </div>
                    <span className="text-[#1E1E1E]">
                      Guide interactif des fonctionnalités
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E91E63]/10 flex items-center justify-center">
                      <span className="text-[#E91E63] font-bold">3</span>
                    </div>
                    <span className="text-[#1E1E1E]">
                      Exemples de scénarios réels
                    </span>
                  </li>
                </ul>

                <div className="mt-8">
                  <Link
                    href="/dashboard-demo"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-[#E91E63] text-white rounded-lg font-semibold hover:bg-[#D81B60] transition-all transform hover:scale-105 shadow-lg group"
                  >
                    Accéder à la démo gratuite
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <p className="text-sm text-center text-[#1E1E1E]/60 mt-4">
                    Aucune carte bancaire requise • Accès immédiat
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#E91E63] to-[#ff4081] opacity-10" />
                <div className="relative p-8">
                  <div className="aspect-video rounded-lg bg-white shadow-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-[#1E1E1E]/5" />
                    <img
                      key={isSecondImage ? "planing" : "demo"}
                      src={isSecondImage ? "/planing-view.png" : "/demo-view.png"}
                      alt="Aperçu de l'interface Tolarys"
                      className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div 
                        onClick={() => setIsSecondImage(!isSecondImage)}
                        className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-colors"
                      >
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-[#E91E63] border-b-8 border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <div className="text-2xl font-bold text-[#E91E63] mb-1">15k+</div>
                      <div className="text-sm text-[#1E1E1E]/70">Leçons gérées</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-lg">
                      <div className="text-2xl font-bold text-[#E91E63] mb-1">98%</div>
                      <div className="text-sm text-[#1E1E1E]/70">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Prix avec Garantie */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-[#E91E63] p-8 text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white mb-4">
                <span className="text-sm font-semibold">Économisez 25% - Offre limitée</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-medium text-white/80 line-through">199€</span>
                <span className="text-5xl font-bold text-white">149€</span>
                <span className="text-xl text-white/80">/mois</span>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Gestion complète des élèves</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Planning des leçons optimisé</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Suivi des paiements automatisé</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Espace élève personnalisé</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Statistiques avancées</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Support dédié 24/7</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Multi-établissements</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-[#E91E63]" />
                  <span className="text-[#1E1E1E]">Formation sur site incluse</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/inscription"
                  className="block w-full py-4 px-8 bg-[#E91E63] text-white text-center rounded-lg font-semibold hover:bg-[#D81B60] transition-all transform hover:scale-105 shadow-lg"
                >
                  Commencer maintenant
                </Link>
                <p className="text-sm text-center text-[#1E1E1E]/60 mt-4">
                  30 jours d'essai gratuit • Sans engagement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
