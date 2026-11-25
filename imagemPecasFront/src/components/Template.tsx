"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/resources/user/authentication.service";
import { notifyAuthChange, useUserSession } from "@/hooks/useUserSession";
import { ArrowRightIcon, UserIcon } from "./icons";
import { Logo } from "./Logo";

interface TemplateProps {
  children: React.ReactNode;
  loading?: boolean;
}

export const Template: React.FC<TemplateProps> = ({ children, loading = false }) => {
  return (
    <>
      <Header />
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 pb-16 sm:px-8 ${loading ? "animate-pulse" : ""}`}>
        <RenderIf condition={loading}>
          <Loading />
        </RenderIf>
        {children}
      </main>
    </>
  );
};

interface RenderIfProps {
  condition?: boolean;
  children: React.ReactNode;
}

export const RenderIf: React.FC<RenderIfProps> = ({ condition = true, children }) => {
  if (condition) {
    return <>{children}</>;
  }
  return false;
};

// Spinner adaptado do Flowbite (flowbite.com/docs/components/spinner)
const Loading: React.FC = () => (
  <div role="status" className="fixed inset-x-0 top-24 z-40 flex justify-center">
    <div className="flex items-center gap-3 rounded-full bg-navy-700 px-5 py-2 font-mono text-sm shadow-xl shadow-black/40">
      <svg aria-hidden="true" className="h-5 w-5 animate-spin fill-white text-white/20" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      Carregando...
    </div>
  </div>
);

const Header: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();
  const { session } = useUserSession();

  // CSU03 - Encerrar Sessão
  function logout() {
    auth.invalidateSession();
    notifyAuthChange();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-navy-700 shadow-lg shadow-black/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Link href="/galeria" aria-label="Galeria">
          <Logo className="text-2xl sm:text-3xl" />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-8">
          <span className="flex items-center gap-2 font-mono text-sm text-white/90">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <UserIcon className="h-4 w-4" />
            </span>
            <span className="hidden max-w-40 truncate sm:inline">{session?.name}</span>
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-600 px-4 py-1.5 font-mono text-sm transition hover:bg-navy-500"
          >
            Sair <ArrowRightIcon className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
};
