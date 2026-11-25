"use client";

import { useSyncExternalStore } from "react";
import { AuthService } from "@/resources/user/authentication.service";
import { UserSessionToken } from "@/resources/user/users.resources";

const SERVER = "__server__";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-change", callback);
  };
}

// O snapshot inclui a validade ("1|" ou "0|") para que a sessão expirada seja detectada sem Date.now() no render.
function getSnapshot(): string {
  try {
    const raw = localStorage.getItem(AuthService.AUTH_PARAM) ?? "";
    const valid = new AuthService().isSessionValid();
    return `${valid ? 1 : 0}|${raw}`;
  } catch {
    return "0|";
  }
}

/** Avisa os componentes que a sessão local mudou (login/logout na mesma aba). */
export function notifyAuthChange() {
  window.dispatchEvent(new Event("auth-change"));
}

/**
 * Lê a sessão salva no localStorage de forma segura para o SSR do Next.
 * `ready` é false enquanto a página ainda está sendo hidratada.
 */
export function useUserSession(): { ready: boolean; session: UserSessionToken | null; valid: boolean } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SERVER);

  if (snapshot === SERVER) {
    return { ready: false, session: null, valid: false };
  }

  const valid = snapshot.startsWith("1|");
  const raw = snapshot.slice(2);

  let session: UserSessionToken | null = null;
  try {
    session = raw ? (JSON.parse(raw) as UserSessionToken) : null;
  } catch {
    session = null;
  }

  return { ready: true, session, valid: valid && !!session };
}
