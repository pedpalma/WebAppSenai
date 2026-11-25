import { AuthenticatedPage } from "@/components";
import { Galeria } from "@/components/galeria/Galeria";

// O formulário de nova imagem é um modal sobre a galeria (CSU04); esta rota já o abre.
export default function FormularioPage() {
  return (
    <AuthenticatedPage>
      <Galeria formularioAberto />
    </AuthenticatedPage>
  );
}
