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
        return NextResponse.json({ success: false, error: 'Serviço de pagamento não configurado.' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Campos obrigatórios faltando', missing }, { status: 400 });
    }

    const cleanCpf = String(data.cpf).replace(/\D/g, '');
    const cleanTel = String(data.telefone).replace(/\D/g, '');
    const numericValue = parseFloat(String(data.valor).replace(',', '.'));

    if (cleanCpf.length !== 11) {
        return NextResponse.json({ success: false, error: 'CPF inválido (deve ter 11 dígitos)' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return NextResponse.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }
    if (cleanTel.length < 10) {
        return NextResponse.json({ success: false, error: 'Telefone inválido' }, { status: 400 });
    }
    if (isNaN(numericValue) || numericValue < 8) {
        return NextResponse.json({ success: false, error: 'Valor inválido ou menor que o mínimo de R$ 8,00' }, { status: 400 });
    }

    // Build the final payload, forwarding all data including UTM parameters.
    const payload = {
      ...data,
      valor: numericValue.toFixed(2), // Ensure value is correctly formatted
      cpf: cleanCpf,
      telefone: cleanTel,
    };
    
    const pixApiResponse = await fetch(VISION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!pixApiResponse.ok) {
        const errorText = await pixApiResponse.text();
        console.error(`Error from PIX service: ${pixApiResponse.status}`, errorText);
        // Tenta extrair a mensagem de erro do JSON, se houver, caso contrário usa o texto bruto
        let errorMessage = 'O serviço de pagamento retornou um erro.';
        try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.error && typeof errorJson.error === 'string') {
                errorMessage = errorJson.error;
            } else if (errorJson.message) {
                 errorMessage = errorJson.message;
            }
        } catch (e) {
            // Se o errorText não for um JSON válido, usamos o texto como está (se for curto)
            if (errorText.length < 100) {
                errorMessage = errorText;
            }
        }

        return NextResponse.json(
            { 
              success: false, 
              error: errorMessage, // Retorna a mensagem de erro principal
              details: errorText, // Retorna o texto completo para depuração no frontend
            }, 
            { status: pixApiResponse.status }
        );
    }

    // If we get here, the response is likely valid JSON.
    const responseJson = await pixApiResponse.json();
    
    // Procura pelo código PIX em diferentes locais da resposta da API
    const pixQrCode = responseJson.pix?.pix_qr_code || responseJson.pix?.qrcode;
    if (!pixQrCode) {
        console.error('Resposta da API PIX não continha um QR Code válido:', responseJson);
        return NextResponse.json(
            { 
              success: false, 
              error: 'A resposta do serviço de pagamento não continha um QR Code válido.',
              details: responseJson
            }, 
            { status: 500 }
        );
    }


    return NextResponse.json(responseJson, { status: pixApiResponse.status });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor', details: err.message }, { status: 500 });
  }
}
