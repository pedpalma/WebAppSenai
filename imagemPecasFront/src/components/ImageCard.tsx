import { HeartIcon } from "./icons";

interface ImageCardProps {
  nome?: string;
  tamanho?: number;
  dataUpload?: string;
  src?: string;
  extension?: string;
  tags?: string[];
  favorito?: boolean;
  onToggleFavorito?: () => void;
}

// Card no estilo "polaroid" do design
export const ImageCard: React.FC<ImageCardProps> = ({
  nome,
  tamanho = 0,
  dataUpload,
  src,
  extension,
  tags = [],
  favorito = false,
  onToggleFavorito,
}: ImageCardProps) => {
  // CSU06: abre a imagem original em uma nova aba (podendo ser baixada)
  function download() {
    window.open(src, "_blank");
  }

  return (
    <div className="group relative rounded-sm bg-white p-3 pb-4 text-navy-900 shadow-lg shadow-black/30 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      <div className="relative aspect-square cursor-pointer overflow-hidden bg-slate-200" onClick={download} title="Abrir em tamanho real">
        <img src={src} alt={nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>

      <button
        type="button"
        onClick={onToggleFavorito}
        aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={favorito}
        className={`absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
          favorito ? "text-rose-500" : "text-slate-400 opacity-0 group-hover:opacity-100 focus:opacity-100"
        }`}
      >
        <HeartIcon className="h-4 w-4" filled={favorito} />
      </button>

      <div className="mt-3 text-center">
        <h3 className="truncate text-base font-medium" title={nome}>
          {nome}
        </h3>
        <p className="mt-0.5 truncate text-[11px] uppercase tracking-wide text-slate-500" title={tags.join(", ")}>
          {tags.map((tag) => `#${tag}`).join("  ")}
        </p>
        <p className="mt-1 font-mono text-[10px] text-slate-400">
          {extension} · {formatBytes(tamanho)} · {dataUpload}
        </p>
      </div>
    </div>
  );
};

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
