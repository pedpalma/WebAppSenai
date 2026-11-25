import { AuthenticatedPage } from "@/components";
import { Galeria } from "@/components/galeria/Galeria";

export default function GaleriaPage() {
  return (
    <AuthenticatedPage>
      <Galeria />
    </AuthenticatedPage>
  );
}
