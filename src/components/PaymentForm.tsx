'use client';

import { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useFormStore } from '@/app/store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  email: string;
}

export default function PaymentForm({ email }: PaymentFormProps) {
  const formData = useFormStore(state => state.formData);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ formData }),
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la création de la session');
        }

        const { sessionId } = await response.json();
        
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe n\'a pas pu être chargé');
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          throw error;
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
      }
    };

    createCheckoutSession();
  }, [email, formData]);

  return (
    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900">
          Redirection vers la page de paiement...
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Veuillez patienter pendant que nous préparons votre paiement.
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63] mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
