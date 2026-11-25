// Endereço da API (Spring Boot). Em produção/Docker é definido por NEXT_PUBLIC_API_URL.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Erro lançado quando o token está ausente/expirado (HTTP 401/403). */
export class SessionExpiredError extends Error {
  constructor() {
    super("Sessão expirada. Faça login novamente.");
    this.name = "SessionExpiredError";
  }
}

/** Extrai a mensagem de erro do corpo JSON {"error": "..."} devolvido pela API. */
export async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return body?.error ?? fallback;
  } catch {
    return fallback;
  }
}
