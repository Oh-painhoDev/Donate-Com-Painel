'use server';

import { getAdminFirestore } from '@/firebase/admin-sdk';

// ====================================================================
// AÇÃO PARA GERAR PIX
// ====================================================================

type PixRequestData = {
  valor: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  produto: string;
  [key: string]: any; // Permite outros campos como UTMs
};

// Função auxiliar para buscar campos recursivamente em um objeto
function findFieldInResponse(data: any, possibleNames: string[]): string | null {
    if (typeof data !== 'object' || data === null) {
        return null;
    }
    for (const name of possibleNames) {
        if (data[name] && typeof data[name] === 'string' && data[name].length > 10) {
            return data[name];
        }
    }
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const found = findFieldInResponse(data[key], possibleNames);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

export async function createPixAction(data: PixRequestData) {
  try {
    const firestore = getAdminFirestore();
    const contentRef = firestore.collection('pageContent').doc('landingPage');
    
    const contentSnap = await contentRef.get();
    if (!contentSnap.exists) {
      return { success: false, error: 'Configuração da página não encontrada.' };
    }
    const pageContent = contentSnap.data();
    const pixApiEndpoint = pageContent?.pixApiEndpoint;

    if (!pixApiEndpoint) {
      return { success: false, error: 'O serviço de pagamento não está configurado. Contacte o administrador.' };
    }

    const requiredFields = ["valor", "nome", "produto", "cpf", "email", "telefone"];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        return { success: false, error: "Campos obrigatórios faltando", missing: missingFields };
    }
    
    const cleanCpf = (data.cpf || '').replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
        return { success: false, error: "CPF inválido (deve ter 11 dígitos)" };
    }
    
    const cleanTel = (data.telefone || '').replace(/\D/g, '');
    if (cleanTel.length < 10) {
        return { success: false, error: "Telefone inválido" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { success: false, error: "Email inválido" };
    }
    
    const numericValue = parseFloat(data.valor);
    if (isNaN(numericValue) || numericValue <= 0) {
        return { success: false, error: "Valor inválido (deve ser um número maior que zero)" };
    }

    const payload = { ...data };
    payload.cpf = cleanCpf;
    payload.telefone = cleanTel;
    payload.src = payload.src || "organic";
    payload.sck = payload.sck || "";
    payload.utm_source = payload.utm_source || "organic";
    payload.utm_campaign = payload.utm_campaign || "default";
    payload.utm_medium = payload.utm_medium || "web";
    payload.utm_content = payload.utm_content || "";
    payload.utm_term = payload.utm_term || "";

    const response = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const responseBodyText = await response.text();
    let responseData;
    
    try {
        responseData = JSON.parse(responseBodyText);
    } catch (e) {
        return { success: false, error: "A resposta da API de pagamento não é um JSON válido.", details: responseBodyText };
    }
    
    const normalizedResponse: any = { ...responseData };
    normalizedResponse.success = response.ok;
    
    const pixCodeKeys = [
        'pixCopyPaste', 'pix_copy_paste', 'pixCode', 'pix_code', 
        'codigo_pix', 'copy_paste', 'emv', 'chave_pix', 'qrcode', 'qrcode_text'
    ];
    
    const pixCode = findFieldInResponse(responseData, pixCodeKeys);
    
    if (pixCode) {
        normalizedResponse.pixCopyPaste = pixCode;
        normalizedResponse.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(pixCode)}&margin=2&format=png&ecc=M`;
    } else if (normalizedResponse.success) {
        return { success: false, error: "API retornou sucesso, mas o código PIX não foi encontrado na resposta.", details: responseData };
    }

    return normalizedResponse;

  } catch (error: any) {
    console.error('Erro interno ao chamar a API PIX:', error);
    return { success: false, error: error.message || 'Ocorreu um erro inesperado.' };
  }
}

// ====================================================================
// AÇÃO PARA RASTREAR VENDA/DOAÇÃO COM UTIFY
// ====================================================================

// Helper to get a value from a URL query string
const getQueryParam = (url: string, param: string): string | null => {
  try {
    const params = new URL(url).searchParams;
    return params.get(param);
  } catch (error) {
    console.error("Invalid URL for getQueryParam:", url, error);
    return null;
  }
};

export async function trackSale(saleData: { amountInCents: number; productName: string; checkoutUrl: string; }) {
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
