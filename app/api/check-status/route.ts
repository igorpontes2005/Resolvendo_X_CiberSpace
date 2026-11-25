import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 });
  }

  // Garantir que a URL possui o protocolo http/https
  const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;

  const startTime = Date.now();

  try {
    // Controller para cancelar a requisição se demorar mais de 5 segundos (timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(formattedUrl, {
      method: 'GET', // ou 'HEAD' caso o servidor alvo aceite rapidamente
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) StatusChecker/1.0',
      },
      cache: 'no-store', // Não guardar cache para a verificação ser sempre em tempo real
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    // Se o status HTTP for na faixa de 200 a 399, o site está no ar
    if (response.ok || (response.status >= 200 && response.status < 400)) {
      return NextResponse.json({
        status: latency > 5000 ? 'instavel' : 'online',
        statusCode: response.status,
        latencyMs: latency,
      });
    } else {
      return NextResponse.json({
        status: 'offline',
        statusCode: response.status,
        latencyMs: latency,
      });
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    return NextResponse.json({
      status: 'offline',
      error: 'Falha de conexão ou Timeout',
      latencyMs: latency,
    });
  }
}