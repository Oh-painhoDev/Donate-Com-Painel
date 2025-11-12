import { NextResponse } from 'next/server';

/**
 * API Route Handler for creating a PIX payment.
 * This acts as a secure backend proxy to the external Vision-PIX service.
 * It is responsible for validating data and forwarding it to the payment gateway.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const pixApiEndpoint = data.pixApiEndpoint;
    
    if (!pixApiEndpoint) {
        return NextResponse.json({ success: false, error: 'Endpoint da API PIX não fornecido.' }, { status: 400 });
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

    // Prepare o payload para a API externa, incluindo todos os dados recebidos.
    const payload = {
      ...data, // Inclui todos os campos do formulário, incluindo os de rastreamento
      valor: numericValue.toFixed(2),
      cpf: cleanCpf,
      telefone: cleanTel,
    };
    // Remove o pixApiEndpoint do payload a ser enviado para a API externa
    delete payload.pixApiEndpoint;
    
    const pixApiResponse = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!pixApiResponse.ok) {
        let errorDetails: any;
        try {
            // Tenta analisar a resposta de erro como JSON
            errorDetails = await pixApiResponse.json();
        } catch (e) {
            // Se falhar, a resposta não era JSON. Usa o texto bruto.
            errorDetails = await pixApiResponse.text();
        }

        const errorMessage = typeof errorDetails === 'object' && errorDetails?.error 
            ? errorDetails.error 
            : 'O serviço de pagamento retornou um erro.';
        
        console.error(`Error from PIX service: ${pixApiResponse.status}`, errorDetails);

        return NextResponse.json(
            { 
              success: false, 
              error: errorMessage,
              details: errorDetails,
            }, 
            { status: pixApiResponse.status }
        );
    }
    
    let responseJson;
    try {
        responseJson = await pixApiResponse.json();
    } catch (e) {
        const responseText = await pixApiResponse.text();
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
