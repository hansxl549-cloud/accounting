import { NextRequest, NextResponse } from "next/server";

function safeEqual(left: string, right: string) {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const expectedPassword = process.env.APP_PASSWORD;
  const expectedUsername = process.env.APP_USERNAME || "lin";

  // Allow local development without credentials. Production fails closed.
  if (!expectedPassword && process.env.NODE_ENV !== "production") return NextResponse.next();
  if (!expectedPassword) return new NextResponse("APP_PASSWORD is not configured.", { status: 503 });

  const authorization = request.headers.get("authorization") || "";
  const encoded = authorization.match(/^Basic\s+(.+)$/i)?.[1];
  if (encoded) {
    try {
      const binary = atob(encoded);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const credentials = new TextDecoder().decode(bytes);
      const separator = credentials.indexOf(":");
      const username = separator >= 0 ? credentials.slice(0, separator) : "";
      const password = separator >= 0 ? credentials.slice(separator + 1) : "";
      if (safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword)) {
        return NextResponse.next();
      }
    } catch {
      // Malformed credentials are treated as a failed login.
    }
  }

  return new NextResponse("需要登录后访问。", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="小账本", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"]
};
