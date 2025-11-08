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
import { firestore } from '@/firebase/admin';

type PixRequestData = {
  valor: string;
  nome: string;
  email: string;
  cpf: string;
  produto: string;
  [key: string]: any; // To allow for UTM params etc.
};

export async function createPix(data: PixRequestData) {
  const contentRef = doc(firestore, 'pageContent', 'landingPage');
  
  try {
    const contentSnap = await getDoc(contentRef);

    if (!contentSnap.exists()) {
      throw new Error('Configuração da página não encontrada.');
    }

    const pageContent = contentSnap.data();
    const pixApiEndpoint = pageContent.pixApiEndpoint;

    if (!pixApiEndpoint) {
      console.warn('Endpoint da API PIX não está configurado.');
      return { error: 'O serviço de pagamento não está configurado. Contacte o administrador.' };
    }

    const response = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Falha ao gerar PIX:', errorBody);
      throw new Error(`A API de pagamento retornou um erro: ${response.status}`);
    }

    const result = await response.json();
    return result;

  } catch (error: any) {
    console.error('Erro interno ao chamar a API PIX:', error);
    return { error: error.message || 'Ocorreu um erro inesperado.' };
  }
}
