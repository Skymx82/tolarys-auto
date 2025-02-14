import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia'
});

export async function POST(request: Request) {
  try {
    const { formData } = await request.json();

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/inscription`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: formData.email,
      metadata: formData, // Stocker les données du formulaire dans les métadonnées
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la session' },
      { status: 500 }
    );
  }
}
