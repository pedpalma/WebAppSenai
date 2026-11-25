"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSession } from "@/hooks/useUserSession";

interface AuthenticatedPageProps {
  children: React.ReactNode;
}

/** Só exibe o conteúdo com sessão válida; caso contrário, redireciona para o login (pré-condição CSU03–CSU06). */
export const AuthenticatedPage: React.FC<AuthenticatedPageProps> = ({ children }) => {
  const router = useRouter();
  const { ready, valid } = useUserSession();

  useEffect(() => {
    if (ready && !valid) {
      router.replace("/login");
    }
  }, [ready, valid, router]);

  if (!ready || !valid) {
    return null;
  }

  return <>{children}</>;
};
