"use client";

import { useState } from "react";

// Favoritos ficam apenas no navegador, separados por usuário (o back-end não tem esse conceito).
function storageKey(email?: string) {
  return `_favoritos:${email ?? "anon"}`;
}

function load(email?: string): string[] {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Deve ser usado apenas em componentes renderizados no cliente (ex.: dentro de AuthenticatedPage). */
export function useFavorites(email?: string) {
  const [favorites, setFavorites] = useState<string[]>(() => load(email));

  function toggle(url?: string) {
    if (!url) return;
    const next = favorites.includes(url) ? favorites.filter((f) => f !== url) : [...favorites, url];
    setFavorites(next);
    try {
      localStorage.setItem(storageKey(email), JSON.stringify(next));
    } catch {
      // armazenamento indisponível: mantém só em memória
    }
  }

  return { favorites, isFavorite: (url?: string) => !!url && favorites.includes(url), toggle };
}
