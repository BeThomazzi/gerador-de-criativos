// @ts-expect-error - no types for sparticuz/chromium
import chromium from '@sparticuz/chromium';
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function POST(req: NextRequest) {
  const { slideIndex, state } = await req.json();
  
  // No localhost ele usa o Chrome local, na Vercel usa o binário do sparticuz
  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH || process.env.NODE_ENV === 'development';
  const executablePath = isLocal 
    ? process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome' 
    : await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: isLocal ? ['--no-sandbox', '--disable-setuid-sandbox'] : chromium.args,
    defaultViewport: { width: 1080, height: 1350 },
    executablePath,
    headless: isLocal ? true : chromium.headless,
  });

  const page = await browser.newPage();
  
  // Injetar o state no window antes de navegar, para contornar qualquer limite de quota do localStorage (5MB)
  await page.evaluateOnNewDocument((stateData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__INJECTED_CAROUSEL_STATE__ = stateData;
  }, state);
  
  // URL da sua rota de preview (localhost em dev, ou URL da vercel em prod)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  await page.goto(`${baseUrl}/export-preview/${slideIndex}`, {
    waitUntil: 'networkidle0', // Espera fontes e imagens carregarem 100%
  });

  const buffer = await page.screenshot({ type: 'png' });
  await browser.close();

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: { 'Content-Type': 'image/png' },
  });
}