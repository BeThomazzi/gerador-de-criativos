import chromium from "@sparticuz/chromium";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;

  try {
    const { slideIndex, state } = await req.json();

    const isLocal =
      !!process.env.CHROME_EXECUTABLE_PATH ||
      process.env.NODE_ENV === "development";
    const executablePath = isLocal
      ? process.env.CHROME_EXECUTABLE_PATH || "/usr/bin/google-chrome"
      : await chromium.executablePath();

    browser = await puppeteer.launch({
      args: isLocal
        ? ["--no-sandbox", "--disable-setuid-sandbox"]
        : chromium.args,
      defaultViewport: { width: 1080, height: 1350 },
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    await page.evaluateOnNewDocument((stateData) => {
      const targetWindow = window as typeof window & {
        __INJECTED_CAROUSEL_STATE__?: unknown;
      };

      targetWindow.__INJECTED_CAROUSEL_STATE__ = stateData;
    }, state);

    const forwardedProto = req.headers.get("x-forwarded-proto") ?? "http";
    const forwardedHost =
      req.headers.get("x-forwarded-host") ??
      req.headers.get("host") ??
      "localhost:3000";
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      `${forwardedProto}://${forwardedHost}`;

    await page.goto(`${baseUrl}/export-preview/${slideIndex}`, {
      waitUntil: "networkidle0",
      timeout: 120000,
    });

    const buffer = await page.screenshot({ type: "png" });

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Erro ao exportar imagem:", error);

    return NextResponse.json(
      { error: "Falha ao gerar a imagem de exportação." },
      { status: 500 },
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => undefined);
    }
  }
}
