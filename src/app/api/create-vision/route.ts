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

    // Important: Do not try to parse as JSON if the response might be empty or non-JSON
    const responseText = await pixApiResponse.text();
    let responseJson;

    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse PIX API response as JSON:", responseText);
      return NextResponse.json({ success: false, error: 'Resposta inválida do serviço de PIX', raw: responseText }, { status: 502 });
    }

    // The payment gateway should return a JSON response. We forward it to the client.
    // The client will handle the success/error state based on the response.
    return NextResponse.json(responseJson, { status: pixApiResponse.status });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor', details: err.message }, { status: 500 });
  }
}
