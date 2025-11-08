// This file is being deprecated for PIX generation.
// The logic has been moved to an API route at /api/create-vision/route.ts
// to avoid server/client context conflicts.
// The trackSale logic remains here for now but might be refactored later if needed.

'use server';

import { getAdminFirestore } from '@/firebase/admin-sdk';


// ====================================================================
// AÇÃO PARA RASTREAR VENDA/DOAÇÃO COM UTIFY (Helper interno)
// ====================================================================

const getQueryParam = (url: string, param: string): string | null => {
  try {
    const params = new URL(url).searchParams;
    return params.get(param);
  } catch (error) {
    console.error("Invalid URL for getQueryParam:", url, error);
    return null;
  }
};

async function trackSale(saleData: { amountInCents: number; productName: string; checkoutUrl: string; }) {
  let firestore;
  try {
    firestore = getAdminFirestore();
  } catch (error: any) {
     console.warn("Firestore not initialized on the server. Skipping Utmify tracking.", error.message);
     return;
  }
  
  const contentRef = firestore.collection('pageContent').doc('landingPage');
  
  try {
    const contentSnap = await contentRef.get();
    if (!contentSnap.exists) {
      throw new Error('Page content not found for Utmify.');
    }

    const pageContent = contentSnap.data();
    const apiToken = pageContent?.utmifyApiToken;

    if (!apiToken) {
      console.warn('Utmify API token is not set. Skipping sale tracking.');
      return;
    }

    const { checkoutUrl } = saleData;
    const now = new Date();
    const utcNow = now.toISOString().slice(0, 19).replace('T', ' ');

    const payload = {
      orderId: `donation-${Date.now()}`,
      platform: 'SOSParanaSite',
      paymentMethod: 'pix',
      status: 'paid',
      createdAt: utcNow,
      approvedDate: utcNow,
      refundedAt: null,
      customer: {
        name: 'Anonymous Donor',
        email: `donor+${Date.now()}@example.com`,
        phone: null,
        document: null,
        country: 'BR',
        ip: null,
      },
      products: [
        {
          id: `prod-${saleData.productName.replace(/\s+/g, '-')}`,
          name: saleData.productName,
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: saleData.amountInCents,
        },
      ],
      trackingParameters: {
        src: getQueryParam(checkoutUrl, 'src'),
        sck: getQueryParam(checkoutUrl, 'sck'),
        utm_source: getQueryParam(checkoutUrl, 'utm_source'),
        utm_campaign: getQueryParam(checkoutUrl, 'utm_campaign'),
        utm_medium: getQueryParam(checkoutUrl, 'utm_medium'),
        utm_content: getQueryParam(checkoutUrl, 'utm_content'),
        utm_term: getQueryParam(checkoutUrl, 'utm_term'),
      },
      commission: {
        totalPriceInCents: saleData.amountInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: saleData.amountInCents,
        currency: 'BRL',
      },
      isTest: false,
    };

    const response = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': apiToken,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Failed to send sale to Utmify:', errorBody);
    }

  } catch (error) {
    console.error("Error in trackSale action:", error);
  }
}