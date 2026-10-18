import { NextRequest, NextResponse } from "next/server";
import { getContainer } from "@/lib/container";

// TODO projeto real: validar que o usuário logado é moderador.
export async function POST(req: NextRequest) {
  const { postId } = await req.json();
  try {
    await getContainer().moderation.approve(postId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 409 });
  }
}
