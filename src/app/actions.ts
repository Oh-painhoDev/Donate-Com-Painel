'use server';

import { getAdminFirestore } from '@/firebase/admin';

// Tipagem para os dados recebidos do frontend
type PixRequestData = {
  valor: string;
  nome: string;
  email: string;
  cpf: string;
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

    // Busca recursiva em objetos aninhados
    for (const key in data) {
        const found = findFieldInResponse(data[key], possibleNames);
        if (found) {
            return found;
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

    // === VALIDAÇÕES (Lógica do script PHP) ===
    const requiredFields = ["valor", "nome", "produto", "cpf", "email"];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        return { success: false, error: "Campos obrigatórios faltando", missing: missingFields };
    }
    
    const cleanCpf = (data.cpf || '').replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
        return { success: false, error: "CPF inválido (deve ter 11 dígitos)" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return { success: false, error: "Email inválido" };
    }
    
    const numericValue = parseFloat(data.valor);
    if (isNaN(numericValue) || numericValue <= 0) {
        return { success: false, error: "Valor inválido (deve ser um número maior que zero)" };
    }

    // === ENRIQUECIMENTO DE DADOS (Lógica do script PHP) ===
    const payload = { ...data };
    payload.cpf = cleanCpf; // Usa o CPF limpo
    payload.src = payload.src || "organic";
    payload.sck = payload.sck || "";
    payload.utm_source = payload.utm_source || "organic";
    payload.utm_campaign = payload.utm_campaign || "default";
    payload.utm_medium = payload.utm_medium || "web";
    payload.utm_content = payload.utm_content || "";
    payload.utm_term = payload.utm_term || "";

    // === CHAMADA PARA O ENDPOINT EXTERNO ===
    const response = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const responseBodyText = await response.text();
    let responseData;
    
    try {
        responseData = JSON.parse(responseBodyText);
    } catch (e) {
        return { success: false, error: "A resposta da API de pagamento não é um JSON válido.", details: responseBodyText };
    }
    
    // === NORMALIZAÇÃO DA RESPOSTA (Lógica do script PHP) ===
    const normalizedResponse: any = { ...responseData };
    normalizedResponse.success = response.ok;
    
    let pixCode = null;
    if (responseData?.pix?.qrcode && typeof responseData.pix.qrcode === 'string') {
        pixCode = responseData.pix.qrcode;
    } else if (responseData?.pix?.qrcode_text && typeof responseData.pix.qrcode_text === 'string') {
        pixCode = responseData.pix.qrcode_text;
    } else {
        pixCode = findFieldInResponse(responseData, [
            'pixCopyPaste', 'pix_copy_paste', 'pix_code', 'pixCode', 
            'codigo_pix', 'copy_paste', 'emv', 'chave_pix'
        ]);
    }
    
    if (pixCode) {
        normalizedResponse.pixCopyPaste = pixCode;
        normalizedResponse.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(pixCode)}&margin=2&format=png&ecc=M`;
    }

    return normalizedResponse;

  } catch (error: any) {
    console.error('Erro interno ao chamar a API PIX:', error);
    return { success: false, error: error.message || 'Ocorreu um erro inesperado.' };
  }
}
