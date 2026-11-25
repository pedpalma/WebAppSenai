"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { notifyAuthChange, useUserSession } from "@/hooks/useUserSession";
import { SessionExpiredError } from "@/resources/api";
import { Image } from "@/resources/image/image.resource";
import { useImageService } from "@/resources/image/image.service";
import { useAuth } from "@/resources/user/authentication.service";
import { HeartIcon, ImageIcon, PlusIcon, SearchIcon } from "../icons";
import { ImageCard } from "../ImageCard";
import { NovaImagemModal } from "../NovaImagemModal";
import { useNotification } from "../notification";
import { RenderIf, Template } from "../Template";

interface GaleriaProps {
  formularioAberto?: boolean;
}

export const Galeria: React.FC<GaleriaProps> = ({ formularioAberto = false }) => {
  const useService = useImageService();
  const auth = useAuth();
  const notification = useNotification();
  const router = useRouter();
  const { session } = useUserSession();
  const { isFavorite, toggle } = useFavorites(session?.email);

  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState<string>("");
  const [extension, setExtension] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
  const [somenteFavoritos, setSomenteFavoritos] = useState<boolean>(false);
  const [modalAberto, setModalAberto] = useState<boolean>(formularioAberto);

  // CSU05 - Pesquisar Imagens
  const searchImages = useCallback(
    async (q: string, ext: string, avisarSemResultado = true) => {
      setLoading(true);
      try {
        const result = await useService.buscar(q, ext);
        setImages(result);
        if (!result.length && avisarSemResultado) {
          notification.notify("Nenhuma imagem encontrada!", "warning");
        }
      } catch (error) {
        if (error instanceof SessionExpiredError) {
          auth.invalidateSession();
          notifyAuthChange();
          notification.notify(error.message, "warning");
          router.push("/login");
          return;
        }
        notification.notify((error as Error).message || "Erro ao pesquisar imagens.", "error");
      } finally {
        setSearched(true);
        setLoading(false);
      }
    },
    // os serviços são recriados a cada render, mas não guardam estado
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router]
  );

  // A1: sem filtros, a galeria já abre com todas as imagens cadastradas
  useEffect(() => {
    const timer = setTimeout(() => searchImages("", "", false), 0);
    return () => clearTimeout(timer);
  }, [searchImages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    searchImages(query, extension);
  }

  function fecharModal() {
    setModalAberto(false);
    if (formularioAberto) {
      window.history.replaceState(null, "", "/galeria");
    }
  }

  function aposSalvar() {
    fecharModal();
    searchImages(query, extension, false);
  }

  const visiveis = somenteFavoritos ? images.filter((image) => isFavorite(image.url)) : images;
  const totalFavoritos = images.filter((image) => isFavorite(image.url)).length;

  function renderImageCard(image: Image) {
    return (
      <ImageCard
        key={image.url}
        nome={image.name}
        src={image.url}
        tamanho={image.size}
        extension={image.extension}
        dataUpload={image.uploadDate}
        tags={image.tags}
        favorito={isFavorite(image.url)}
        onToggleFavorito={() => toggle(image.url)}
      />
    );
  }

  function renderImageCards() {
    return visiveis.map(renderImageCard);
  }

  return (
    <Template loading={loading}>
      <section className="mt-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold sm:text-3xl">Todas as suas peças</h1>
          <p className="mt-1 text-sm text-white/80">Registre e organize as imagens do seu acervo na Galeria!</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:flex-nowrap">
          <span className="inline-flex items-center gap-4 rounded-xl bg-white px-4 py-2 text-navy-900">
            <span className="flex items-baseline gap-1">
              <strong className="font-mono text-sm">{totalFavoritos}</strong>
              <span className="text-xs text-slate-500">Favoritos</span>
            </span>
            <span className="flex items-baseline gap-1">
              <strong className="font-mono text-sm">{images.length}</strong>
              <span className="text-xs text-slate-500">Fotos</span>
            </span>
          </span>

          <form onSubmit={handleSubmit} className="pill focus-within:border-white/40">
            <button type="submit" className="flex items-center gap-2 hover:text-navy-300" disabled={loading}>
              Pesquisar <SearchIcon className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Pesquise por algo..."
              aria-label="Pesquisar por nome ou tag"
              onChange={(event) => setQuery(event.target.value)}
              className="w-36 bg-transparent font-sans text-sm text-white outline-none placeholder:text-white/40 sm:w-40"
            />
            <select
              aria-label="Formato"
              value={extension}
              onChange={(event) => setExtension(event.target.value)}
              className="cursor-pointer bg-transparent font-mono text-xs text-white/80 outline-none [&>option]:bg-navy-800"
            >
              <option value="">Todos</option>
              <option value="PNG">PNG</option>
              <option value="JPEG">JPEG</option>
              <option value="GIF">GIF</option>
            </select>
          </form>

          <button
            type="button"
            onClick={() => setSomenteFavoritos(!somenteFavoritos)}
            aria-pressed={somenteFavoritos}
            className={`pill ${somenteFavoritos ? "border-rose-300/60 bg-rose-400/15" : "hover:border-white/40"}`}
          >
            Favoritos <HeartIcon className={`h-4 w-4 ${somenteFavoritos ? "text-rose-300" : ""}`} filled={somenteFavoritos} />
          </button>

          <button type="button" onClick={() => setModalAberto(true)} className="btn-primary shrink-0 rounded-xl">
            Nova foto <PlusIcon />
          </button>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {renderImageCards()}
      </section>

      <RenderIf condition={searched && !loading && visiveis.length === 0}>
        <div className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3 rounded-3xl bg-navy-800 px-6 py-10 text-center">
          <ImageIcon className="h-10 w-10 text-navy-300" />
          <p>{somenteFavoritos ? "Você ainda não tem favoritos aqui." : "Nenhuma imagem encontrada."}</p>
          <p className="text-sm text-white/60">Tente outra pesquisa ou adicione uma nova foto.</p>
        </div>
      </RenderIf>

      <RenderIf condition={modalAberto}>
        <NovaImagemModal onClose={fecharModal} onSaved={aposSalvar} />
      </RenderIf>
    </Template>
  );
};
