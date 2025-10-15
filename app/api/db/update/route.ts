import { createServerPB } from "@/pocketbase/core";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    if (!res?.collection || !res?.id || typeof res?.body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const pb = createServerPB();

    const updated = await pb.collection(res.collection).update(res.id, res.body);
    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    console.error("update error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Erro interno ao atualizar registro" },
      { status: 500 }
    );
  }
}
