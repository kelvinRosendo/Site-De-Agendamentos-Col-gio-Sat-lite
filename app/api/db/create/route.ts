import { createServerPB } from "@/pocketbase/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    if (!res?.collection || typeof res?.body !== "object") {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const pb = createServerPB();

    const created = await pb.collection(res.collection).create(res.body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("create error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Erro interno ao criar registro" },
      { status: 500 }
    );
  }
}
