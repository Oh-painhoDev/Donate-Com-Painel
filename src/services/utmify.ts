/*
 * 
 *  ═══════════════════════════════════════════════════
 *   [USUÁRIO]: Painho_Dev
 *   [DISCORD]: painhodev
 *   [CARGO]: Criador Profissional de Bugs
 *   [HABILIDADES]: Criar bugs novos, Consertar bugs antigos
 *   [STATUS]: Funcionou na minha máquina! 🤷
 *  ═══════════════════════════════════════════════════
 *            \
 *             \     ^__^
 *              \   (oo)\_______
 *                 (__)\       )\/\\
 *                     ||----Ō |
 *                     ||     ||
 * 
 * 
 */
'use server';

import { doc, getDoc } from 'firebase/firestore';
import { getSdks } from '@/firebase/index';

// Helper to get a value from a URL query string
const getQueryParam = (url: string, param: string): string | null => {
  const params = new URLSearchParams(new URL(url).search);
  return params.get(param);
};

// Main function to track a sale/donation
export async function trackSale(saleData: { amountInCents: number; productName: string }) {
  const { firestore } = getSdks();
  const contentRef = doc(firestore, 'pageContent', 'landingPage');
  const contentSnap = await getDoc(contentRef);

  if (!contentSnap.exists()) {
    throw new Error('Page content not found.');
  }

  const pageContent = contentSnap.data();
  const apiToken = pageContent.utmifyApiToken;

  if (!apiToken) {
    console.warn('Utmify API token is not set. Skipping sale tracking.');
    return; // Don't throw an error, just skip if token is not set
  }

  const checkoutUrl = window.location.href;
  const now = new Date();
  const utcNow = now.toISOString().slice(0, 19).replace('T', ' ');

  const payload = {
    orderId: `donation-${Date.now()}`, // Simple unique ID
    platform: 'SOSParanaSite',
    paymentMethod: 'pix', // Assuming all donations are like PIX for this example
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
      ip: null, // IP should ideally be captured from the request
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
      gatewayFeeInCents: 0, // Example: no fee
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
    throw new Error(`Utmify API request failed with status ${response.status}`);
  }

  return response.json();
}
