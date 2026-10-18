import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/container";

export const dynamic = "force-dynamic";

// DEMO: o usuário vem por query. No projeto real, use a sessão (cookies/JWT).
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId obrigatório" }, { status: 400 });

  const list = await getContainer().notifications.findByRecipient(userId);
  return NextResponse.json(list);
}
