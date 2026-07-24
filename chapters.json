import Stripe from 'stripe';
export const stripe=new Stripe(process.env.STRIPE_SECRET_KEY!,{apiVersion:'2024-06-20'});
export const PRICE_MAP:Record<string,string|undefined>={starter:process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,premium:process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,circle:process.env.NEXT_PUBLIC_STRIPE_PRICE_CIRCLE};
