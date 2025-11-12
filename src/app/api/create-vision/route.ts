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
      // If the external API returns an error, it might not be JSON.
      // We capture the raw text and forward it for better debugging.
      const errorText = await pixApiResponse.text();
      console.error(`Error from PIX service: ${pixApiResponse.status}`, errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: 'O serviço de pagamento retornou um erro.',
          details: errorText,
        }, 
        { status: pixApiResponse.status } // Forward the original error status
      );
    }

    // If we get here, the response is likely valid JSON.
    const responseJson = await pixApiResponse.json();
    return NextResponse.json(responseJson, { status: pixApiResponse.status });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor', details: err.message }, { status: 500 });
  }
}
