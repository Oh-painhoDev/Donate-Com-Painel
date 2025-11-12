import { NextResponse } from 'next/server';

/**
 * API Route Handler for creating a PIX payment.
 * This acts as a secure backend proxy to the external Vision-PIX service.
 */
export async function POST(req: Request) {
  try {
    // 1. Get the external API endpoint from environment variables for security.
    const VISION_ENDPOINT = process.env.VISION_ENDPOINT || 'https://api-consulta.site/vision-pix-doacao/pix/create-vision';

    // 2. Parse the incoming request body.
    const data = await req.json();
    if (!data) {
      return NextResponse.json({ success: false, error: 'JSON inválido ou vazio' }, { status: 400 });
    }

    // 3. Validate required fields, exactly like the reference PHP script.
    const required = ['valor', 'nome', 'produto', 'cpf', 'email', 'telefone'];
    const missing = [];
    for (const field of required) {
        // Use a more robust check for empty/null/undefined values
      if (!data[field] || String(data[field]).trim() === '') {
        missing.push(field);
      }
    }
    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: 'Campos obrigatórios faltando', missing }, { status: 400 });
    }

    // 4. Sanitize and validate data types and formats.
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

    // 5. Build the final payload, merging defaults with provided data.
    const payload = {
        ...data,
        cpf: cleanCpf,
        telefone: cleanTel,
        valor: numericValue.toFixed(2),
        src: data.src || 'organic',
        sck: data.sck || '',
        utm_source: data.utm_source || 'organic',
        utm_campaign: data.utm_campaign || 'default',
        utm_medium: data.utm_medium || 'web',
        utm_content: data.utm_content || '',
        utm_term: data.utm_term || '',
    };
    
    // 6. Make the server-to-server request to the external PIX API.
    const pixApiResponse = await fetch(VISION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await pixApiResponse.text();
    let responseJson;

    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      // If the external API returns non-JSON, we return it for debugging.
      return NextResponse.json({ success: false, error: 'Resposta inválida do serviço de PIX', raw: responseText }, { status: 502 });
    }

    // 7. Find the PIX code in the response using a robust recursive function.
    const findPixCode = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      const keys = ['pixCopyPaste','pix_code','qrcode','qrcode_text','codigo_pix','emv','copy_paste','pix'];
      for (const k of keys) {
        if (obj[k] && typeof obj[k] === 'string' && obj[k].length > 10) return obj[k];
      }
      for (const v of Object.values(obj)) {
        if (typeof v === 'object') {
          const found = findPixCode(v);
          if (found) return found;
        }
      }
      return null;
    };

    const pixCode = findPixCode(responseJson);

    // 8. Normalize the final response for our frontend.
    const normalizedResponse = { 
        ...responseJson, 
        success: pixApiResponse.ok 
    };

    if (pixCode) {
      normalizedResponse.pixCopyPaste = pixCode;
      normalizedResponse.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(pixCode)}&margin=2&format=png&ecc=M`;
    } else if (normalizedResponse.success) {
      // Handle case where API call was successful but no PIX code was found.
      return NextResponse.json({ success: false, error: 'PIX code not found in API response', details: responseJson }, { status: 502 });
    }

    return NextResponse.json(normalizedResponse, { status: pixApiResponse.status });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor', details: err.message }, { status: 500 });
  }
}
