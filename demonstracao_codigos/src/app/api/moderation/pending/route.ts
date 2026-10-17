import { NextResponse } from "next/server";
import { getContainer } from "@/lib/container";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getContainer().moderation.pending());
}
