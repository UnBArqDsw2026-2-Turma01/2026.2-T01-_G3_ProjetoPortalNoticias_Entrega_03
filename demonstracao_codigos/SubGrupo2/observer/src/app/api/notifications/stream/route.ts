import { NextRequest } from "next/server";
import { getContainer } from "@/lib/container";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** SSE: mantém a conexão aberta e recebe pushes do SseWebChannel. */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return new Response("userId obrigatório", { status: 400 });

  const { channel } = getContainer();
  const encoder = new TextEncoder();
  let disconnect: () => void = () => {};
  let heartbeat: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => controller.enqueue(encoder.encode(chunk));
      disconnect = channel.connect(userId, send);
      send(": connected\n\n");
      heartbeat = setInterval(() => send(": ping\n\n"), 25_000);

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        disconnect();
        try { controller.close(); } catch {}
      });
    },
    cancel() {
      clearInterval(heartbeat);
      disconnect();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
