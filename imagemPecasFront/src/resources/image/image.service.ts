import { API_URL, SessionExpiredError, extractErrorMessage } from "@/resources/api";
import { AuthService } from "@/resources/user/authentication.service";
import { Image } from "./image.resource";

class ImageService {
  baseUrl: string = `${API_URL}/v1/images`;
  auth: AuthService = new AuthService();

  private authHeaders(): HeadersInit {
    const session = this.auth.getUserSession();
    return session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {};
  }

  // CSU05 - Pesquisar Imagens
  async buscar(query: string = "", extension: string = ""): Promise<Image[]> {
    const params = new URLSearchParams({ query, extension });
    const url = `${this.baseUrl}?${params.toString()}`;

    const response = await fetch(url, { headers: this.authHeaders() });
    if (response.status === 401 || response.status === 403) {
      throw new SessionExpiredError();
    }
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response, "Não foi possível pesquisar as imagens."));
    }
    return await response.json();
  }

  // CSU04 - Publicar Imagem. Retorna a URL (header Location) da imagem criada.
  async salvar(dados: FormData): Promise<string> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      body: dados,
      headers: this.authHeaders(),
    });

    if (response.status === 401 || response.status === 403) {
      throw new SessionExpiredError();
    }
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response, "Não foi possível salvar a imagem."));
    }
    return response.headers.get("location") ?? "";
  }
}

export const useImageService = () => new ImageService();
