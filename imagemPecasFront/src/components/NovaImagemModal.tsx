"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { notifyAuthChange } from "@/hooks/useUserSession";
import { SessionExpiredError } from "@/resources/api";
import { useImageService } from "@/resources/image/image.service";
import { useAuth } from "@/resources/user/authentication.service";
import { CloseIcon, ImageIcon, PlusIcon } from "./icons";
import { useNotification } from "./notification";
import { RenderIf } from "./Template";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // RN03
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif"]; // RN04

interface FormProps {
  name: string;
  tags: string;
  file: File | null;
}

const formScheme: FormProps = { name: "", tags: "", file: null };

// RF07 / RN03 / RN04 / RN05: validação antes do envio
const formValidationScheme = Yup.object().shape({
  name: Yup.string().trim().required("Dê um nome ao registro.").max(50, "O nome deve ter no máximo 50 caracteres."),
  tags: Yup.string().trim().required("Informe ao menos uma tag.").max(50, "As tags devem ter no máximo 50 caracteres."),
  file: Yup.mixed<File>()
    .required("Selecione uma imagem.")
    .test("type", "Formatos aceitos: PNG, JPEG ou GIF.", (file) => !!file && ACCEPTED_TYPES.includes(file.type))
    .test("size", "O arquivo deve ter no máximo 4 MB.", (file) => !!file && file.size <= MAX_FILE_SIZE),
});

interface NovaImagemModalProps {
  onClose: () => void;
  onSaved: () => void;
}

// CSU04 - Publicar Imagem (modal sobre a galeria)
export const NovaImagemModal: React.FC<NovaImagemModalProps> = ({ onClose, onSaved }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>();
  const [dragging, setDragging] = useState<boolean>(false);
  const service = useImageService();
  const auth = useAuth();
  const notification = useNotification();
  const router = useRouter();

  const formik = useFormik<FormProps>({
    initialValues: formScheme,
    validationSchema: formValidationScheme,
    onSubmit: handleSubmit,
  });

  // fecha com ESC
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(dados: FormProps) {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", dados.file as File);
    formData.append("name", dados.name.trim());
    formData.append("tags", dados.tags.trim());

    try {
      await service.salvar(formData);
      notification.notify("Imagem publicada com sucesso!", "success");
      formik.resetForm();
      changePreview(undefined);
      onSaved();
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        auth.invalidateSession();
        notifyAuthChange();
        notification.notify(error.message, "warning");
        router.push("/login");
        return;
      }
      notification.notify((error as Error).message || "Erro ao publicar a imagem.", "error");
    } finally {
      setLoading(false);
    }
  }

  function changePreview(url: string | undefined) {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(url);
  }

  function selectFile(file: File | undefined) {
    if (!file) return;
    formik.setFieldValue("file", file);
    formik.setFieldTouched("file", true, false);
    changePreview(ACCEPTED_TYPES.includes(file.type) ? URL.createObjectURL(file) : undefined);
  }

  const fieldError = (field: keyof FormProps) =>
    formik.touched[field] && formik.errors[field] ? (formik.errors[field] as string) : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/70 px-4 py-10 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={formik.handleSubmit}
        noValidate
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Nova imagem"
        className="relative w-full max-w-xl rounded-3xl bg-navy-700 p-6 shadow-2xl shadow-black/50 sm:p-10"
      >
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white">
          <CloseIcon />
        </button>

        <div className="rounded-xl bg-white p-3 text-navy-900 shadow-lg">
          {/* área da imagem: clique ou arraste */}
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              selectFile(event.dataTransfer.files?.[0]);
            }}
            className={`relative flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-200 transition ${
              dragging ? "ring-4 ring-navy-500" : ""
            }`}
          >
            <RenderIf condition={!!imagePreview}>
              <img src={imagePreview} alt="Pré-visualização" className="absolute inset-0 h-full w-full object-cover" />
            </RenderIf>
            <RenderIf condition={!imagePreview}>
              <ImageIcon className="absolute h-24 w-24 text-slate-300" />
            </RenderIf>
            <span className="relative z-10 inline-flex items-center gap-1 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-navy-600">
              {imagePreview ? "Trocar imagem" : "Adicione uma nova imagem"} <PlusIcon />
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif"
              className="hidden"
              onChange={(event) => {
                selectFile(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </label>
          <p className="mt-1 text-center font-mono text-[10px] text-slate-400">PNG, JPEG ou GIF · até 4 MB</p>
          <RenderIf condition={!!fieldError("file")}>
            <p className="field-error text-center !text-rose-600">{fieldError("file")}</p>
          </RenderIf>

          <div className="mt-3 flex flex-col gap-3">
            <div>
              <input
                name="name"
                type="text"
                maxLength={50}
                placeholder="Dê um nome ao seu registro..."
                aria-label="Nome"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-md bg-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-navy-500"
              />
              <RenderIf condition={!!fieldError("name")}>
                <p className="field-error !text-rose-600">{fieldError("name")}</p>
              </RenderIf>
            </div>
            <div>
              <textarea
                name="tags"
                rows={3}
                maxLength={50}
                placeholder="Adicione tags sobre essa peça, separadas por vírgula..."
                aria-label="Tags"
                value={formik.values.tags}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full resize-none rounded-md bg-slate-200 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-navy-500"
              />
              <RenderIf condition={!!fieldError("tags")}>
                <p className="field-error !text-rose-600">{fieldError("tags")}</p>
              </RenderIf>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-navy-950 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-black/40 transition hover:bg-navy-600 disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Criar novo registro"}
          </button>
        </div>
      </form>
    </div>
  );
};
