import { NextResponse } from 'next/server';

/**
 * API Route Handler for creating a PIX payment.
 * This acts as a secure backend proxy to the external Vision-PIX service.
 * It is responsible for validating data and forwarding it to the payment gateway.
 */
export async function POST(req: Request) {
  try {
    const VISION_ENDPOINT = process.env.VISION_ENDPOINT;
    
    if (!VISION_ENDPOINT) {
        console.error("VISION_ENDPOINT environment variable is not set.");
        return NextResponse.json({ success: false, error: 'Serviço de pagamento não configurado.', details: 'A variável de ambiente VISION_ENDPOINT não foi definida.' }, { status: 500 });
    }

    const data = await req.json();
    if (!data) {
      return NextResponse.json({ success: false, error: 'JSON inválido ou vazio' }, { status: 400 });
    }

    const required = ['valor', 'nome', 'produto', 'cpf', 'email', 'telefone'];
    const missing = [];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim() === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios faltando', details: `Campos faltando: ${missing.join(', ')}` }, { status: 400 });
    }

    const cleanCpf = String(data.cpf).replace(/\D/g, '');
    const cleanTel = String(data.telefone).replace(/\D/g, '');
    const numericValue = parseFloat(String(data.valor).replace(',', '.'));

    if (cleanCpf.length !== 11) {
        return NextResponse.json({ success: false, error: 'CPF inválido', details: 'CPF deve ter 11 dígitos.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return NextResponse.json({ success: false, error: 'Email inválido', details: 'O formato do e-mail não é válido.' }, { status: 400 });
    }
    if (cleanTel.length < 10) {
        return NextResponse.json({ success: false, error: 'Telefone inválido', details: 'O telefone deve ter pelo menos 10 dígitos.' }, { status: 400 });
    }
    if (isNaN(numericValue) || numericValue < 8) {
        return NextResponse.json({ success: false, error: 'Valor mínimo da doação é R$ 8,00', details: `Valor enviado: ${numericValue}` }, { status: 400 });
    }

    const payload = {
      ...data,
      valor: numericValue.toFixed(2),
      cpf: cleanCpf,
      telefone: cleanTel,
    };
    
    const pixApiResponse = await fetch(VISION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await pixApiResponse.text();

    if (!pixApiResponse.ok) {
        console.error(`Error from PIX service: ${pixApiResponse.status}`, responseText);
        let errorDetails = responseText;
        let errorMessage = 'O serviço de pagamento retornou um erro.';
        try {
            const errorJson = JSON.parse(responseText);
            if (errorJson.error && typeof errorJson.error === 'string') {
                errorMessage = errorJson.error;
            } else if (errorJson.message && typeof errorJson.message === 'string') {
                 errorMessage = errorJson.message;
            }
            errorDetails = errorJson;
        } catch (e) {
            // Ignore if parsing fails, errorDetails is already the raw text
        }

        return NextResponse.json(
            { 
              success: false, 
              error: errorMessage,
              details: errorDetails,
            }, 
            { status: 502 } // 502 Bad Gateway is more appropriate here
        );
    }
    
    let responseJson;
    try {
        responseJson = JSON.parse(responseText);
    } catch (e) {
        console.error('Failed to parse successful PIX API response as JSON:', responseText);
        return NextResponse.json({ success: false, error: 'Resposta inválida do serviço de pagamento.', details: responseText }, { status: 500 });
    }

    const pixQrCode = responseJson.pix?.pix_qr_code || responseJson.pix?.qrcode;
    const pixQrText = responseJson.pix?.pix_url || responseJson.pix?.qrcode_text;

    if (!pixQrCode || !pixQrText) {
        console.error('Resposta da API PIX não continha um QR Code ou texto válido:', responseJson);
        return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta do serviço de pagamento não continha um código PIX válido.',
              details: responseJson,
            }, 
            { status: 500 }
        );
    }
    
    if (!responseJson.pix.qrcode_text) {
      responseJson.pix.qrcode_text = pixQrText;
    }

    return NextResponse.json({ ...responseJson, success: true }, { status: 200 });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.', details: err.message }, { status: 500 });
  }
}
