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
    
    // Validação do Endpoint
    if (!pixApiEndpoint || typeof pixApiEndpoint !== 'string' || !pixApiEndpoint.startsWith('http')) {
        return NextResponse.json({ success: false, error: 'Endpoint da API PIX inválido ou não fornecido.' }, { status: 400 });
    }

    // Validação de campos obrigatórios
    const requiredFields = ['valor', 'nome', 'produto', 'cpf', 'email', 'telefone'];
    const missingFields = requiredFields.filter(field => !data[field] || String(data[field]).trim() === '');
    if (missingFields.length > 0) {
      return NextResponse.json({ success: false, error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Limpeza e Validação dos Dados
    const cleanCpf = String(data.cpf).replace(/\D/g, '');
    const cleanTel = String(data.telefone).replace(/\D/g, '');
    const numericValue = parseFloat(String(data.valor).replace(',', '.'));

    if (isNaN(numericValue) || numericValue < 8) {
        return NextResponse.json({ success: false, error: 'Valor mínimo da doação é R$ 8,00', details: `Valor enviado: ${data.valor}` }, { status: 400 });
    }
     if (cleanCpf.length !== 11) {
        return NextResponse.json({ success: false, error: 'CPF inválido', details: 'CPF deve ter 11 dígitos.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return NextResponse.json({ success: false, error: 'Email inválido' }, { status: 400 });
    }
    if (cleanTel.length < 10) {
        return NextResponse.json({ success: false, error: 'Telefone inválido', details: 'O telefone deve ter pelo menos 10 dígitos.' }, { status: 400 });
    }

    // Payload para a API externa, incluindo dados de rastreamento
    const payload = {
      ...data,
      valor: numericValue.toFixed(2),
      cpf: cleanCpf,
      telefone: cleanTel,
    };
    delete payload.pixApiEndpoint; // Não enviar o endpoint para o serviço de pagamento

    // Chamada para a API Externa de PIX
    const pixApiResponse = await fetch(pixApiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    // Tratamento de Erro Robusto
    if (!pixApiResponse.ok) {
        let errorDetails: any;
        try {
            // Tenta analisar a resposta de erro como JSON
            errorDetails = await pixApiResponse.json();
        } catch (e) {
            // Se falhar (não for JSON), usa o texto bruto da resposta
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
    
    // Tratamento da Resposta de Sucesso
    const responseJson = await pixApiResponse.json();

    const pixQrCode = responseJson.pix?.pix_qr_code || responseJson.pix?.qrcode;
    const pixQrText = responseJson.pix?.pix_url || responseJson.pix?.qrcode_text;

    if (!pixQrCode || !pixQrText) {
        console.error('Resposta da API PIX bem-sucedida, mas sem QR Code ou texto válido:', responseJson);
        return NextResponse.json(
            { success: false, error: 'A resposta do serviço de pagamento não continha um código PIX válido.', details: responseJson }, 
            { status: 500 }
        );
    }
    
    // Garante que qrcode_text exista
    if (!responseJson.pix.qrcode_text) {
      responseJson.pix.qrcode_text = pixQrText;
    }

    return NextResponse.json({ ...responseJson, success: true }, { status: 200 });

  } catch (err: any) {
    console.error('[API Create-Vision Error]', err);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor.', details: err.message }, { status: 500 });
  }
}
