import { createServerPB } from "@/pocketbase/core";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();

    if (!Array.isArray(res?.items) || res.items.length === 0) {
      return NextResponse.json({ error: "items vazio/ausente" }, { status: 400 });
    }

    const pb = createServerPB();

    const batch = pb.createBatch();
    for (const item of res.items) {
      if (!item?.collection || typeof item?.body !== "object") {
        return NextResponse.json({ error: "Item inválido no payload" }, { status: 400 });
      }
      batch.collection(item.collection).create(item.body);
    }

    const result = await batch.send();
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error("batch/create error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Erro interno ao criar batch" },
      { status: 500 }
    );
  }
}
