import PocketBase from "pocketbase";
import { cookies } from "next/headers";
import { setGlobalDispatcher, Agent } from 'undici';

async function buildAllowedCookieHeader() {
  const c = await cookies();

  // nomes comuns do NextAuth (prod/dev):
  const names = [
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url"
  ];

  const parts: string[] = [];
  for (const name of names) {
    const v = c.get(name)?.value;
    if (v) parts.push(`${name}=${v}`);
  }
  return parts.join("; ");
}

export function createServerPB() {
  setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));
  const base = process.env.pburl!;
  const pb = new PocketBase(base);
  pb.autoCancellation(false);
  pb.beforeSend = async (url, options) => {
    const c = await buildAllowedCookieHeader();
    if (c) options.headers = { ...options.headers, Cookie: c };
    return { url, options };
  };
  return pb;
}