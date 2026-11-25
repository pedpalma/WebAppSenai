"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Landscape, Logo } from "@/components";
import { useUserSession } from "@/hooks/useUserSession";

// Tela inicial (Index): boas-vindas com acesso ao login e ao cadastro
export default function Home() {
  const router = useRouter();
  const { ready, valid } = useUserSession();

  useEffect(() => {
    if (ready && valid) {
      router.replace("/galeria");
    }
  }, [ready, valid, router]);

  return (
    <main className="relative flex min-h-screen w-full overflow-hidden">
      <Landscape className="absolute inset-0 h-full w-full" />

      <section className="relative z-10 flex w-full flex-col items-center justify-center gap-10 border-r border-white/20 bg-white/10 px-8 py-16 backdrop-blur-xl sm:w-96 md:w-[30rem]">
        <Logo className="text-4xl sm:text-5xl" tagline />

        <p className="font-semibold">Seja Bem-vindo!</p>

        <div className="flex w-full max-w-60 flex-col gap-4">
          <Link href="/login" className="btn-primary w-full">
            Entre na sua conta!
          </Link>
          <Link href="/cadastro" className="btn-primary w-full">
            Cadastre-se!
          </Link>
        </div>
      </section>
    </main>
  );
}
