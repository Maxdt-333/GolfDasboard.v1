import { NextRequest, NextResponse } from "next/server";
import products from "@/data/products.json";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const requestedDelay = Number(params.get("delay") ?? 0);
  const delay = Number.isFinite(requestedDelay) ? Math.min(5000, Math.max(0, requestedDelay)) : 0;
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  if (params.get("fail") === "1") {
    return NextResponse.json({ error: "Simulated server error" }, { status: 500 });
  }
  return NextResponse.json({ products });
}
