import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/container";

export async function POST(req: NextRequest) {
  const { userId, id } = await req.json();
  if (!userId || !id) return NextResponse.json({ error: "userId e id obrigatórios" }, { status: 400 });

  const ok = await getContainer().notifications.markAsRead(id, userId);
  return NextResponse.json({ ok }, { status: ok ? 200 : 404 });
}
