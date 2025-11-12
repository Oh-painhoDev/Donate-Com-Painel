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
import { NextResponse } from 'next/server';

/**
 * API Route Handler for creating a PIX payment.
 * This acts as a secure backend proxy to the external Vision-PIX service.
 * It is responsible for validating data and forwarding it to the payment gateway.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { valor, nome, cpf, email, telefone, produto, ...trackingParams } = data;
    
    // O endpoint da API PIX agora está fixo e não é mais configurável.
    const pixApiEndpoint = "https://api-consulta.site/vision-pix-doacao/pix/create-vision";

    const requiredFields = ['valor', 'nome', 'produto', 'cpf', 'email', 'telefone'];
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json({ success: false, error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const numericValue = parseFloat(String(valor).replace(',', '.'));

    if (isNaN(numericValue) || numericValue < 8) {
        return NextResponse.json({ success: false, error: 'Valor da doação deve ser de no mínimo R$ 8,00', details: `Valor enviado: ${valor}` }, { status: 400 });
    }
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }
    
    // O teste em PHP mostrou que a API externa espera os dados com formatação.
    // Portanto, removemos a limpeza dos campos CPF e telefone.
    const payload = {
      valor: numericValue.toFixed(2),
      nome,
      email,
      cpf, // Enviando o CPF como recebido (com formatação)
      telefone, // Enviando o telefone como recebido (com formatação)
      produto,
      ...trackingParams
    };

    const pixApiResponse = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!pixApiResponse.ok) {
        let errorDetails: any;
        try {
            // Tenta ler a resposta como JSON primeiro.
            errorDetails = await pixApiResponse.json();
        } catch (e) {
            // Se falhar, lê como texto (pode ser um erro HTML do servidor).
            errorDetails = await pixApiResponse.text();
        }

        const errorMessage = (typeof errorDetails === 'object' && errorDetails?.error) 
            ? errorDetails.error 
            : 'O serviço de pagamento retornou um erro inesperado.';
        
        console.error(`Erro do serviço de PIX: ${pixApiResponse.status}`, errorDetails);

        return NextResponse.json(
            { success: false, error: errorMessage, details: errorDetails }, 
            { status: pixApiResponse.status }
        );
    }
    
    const responseJson = await pixApiResponse.json();

    const pixQrCode = responseJson.pix?.pix_qr_code || responseJson.pix?.qrcode;
    const pixQrText = responseJson.pix?.pix_url || responseJson.pix?.qrcode_text;

    if (!pixQrCode && !pixQrText) {
        console.error('Resposta da API PIX bem-sucedida, mas sem QR Code ou texto válido:', responseJson);
        return NextResponse.json(
            { success: false, error: 'A resposta do serviço de pagamento não continha um código PIX válido.', details: responseJson }, 
            { status: 500 }
        );
    }
    
    if (responseJson.pix && !responseJson.pix.qrcode_text) {
      responseJson.pix.qrcode_text = pixQrText;
    }
     if (responseJson.pix && !responseJson.pix.pix_qr_code) {
      responseJson.pix.pix_qr_code = pixQrCode;
    }


    return NextResponse.json({ ...responseJson, success: true }, { status: 200 });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.', details: err.message }, { status: 500 });
  }
}
