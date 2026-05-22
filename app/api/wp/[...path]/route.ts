import { NextRequest, NextResponse } from "next/server";

const WP_BASE = process.env.WP_API_URL ?? "";

async function proxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const url = `${WP_BASE}/wp-json/nathan-rozsa/v1/${path}`;

  const body = req.method !== "GET" && req.method !== "HEAD"
    ? await req.text()
    : undefined;

  const res = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.text();
  // WordPress wp_send_json() can return 500 even for handled errors because it
  // doesn't always set an explicit status code. Normalize to 200 here since
  // all auth endpoints communicate outcome via the JSON body (success: true/false).
  const status = res.status >= 500 ? 200 : res.status;
  return new NextResponse(data, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(req, await params);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(req, await params);
}
