import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/container";

export async function POST(req: NextRequest) {
  const { postId, reason } = await req.json();
  if (!reason) return NextResponse.json({ error: "motivo obrigatório" }, { status: 400 });
  try {
    await getContainer().moderation.reject(postId, reason);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
