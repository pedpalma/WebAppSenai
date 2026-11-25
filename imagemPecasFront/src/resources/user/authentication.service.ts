import { jwtDecode } from "jwt-decode";
import { API_URL, extractErrorMessage } from "@/resources/api";
import { AccessToken, Credentials, User, UserSessionToken } from "./users.resources";

export class AuthService {
  baseUrl: string = `${API_URL}/v1/users`;
  static AUTH_PARAM: string = "_auth";

  // CSU02 - Autenticar-se
  async authenticate(credentials: Credentials): Promise<AccessToken> {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 401) {
      throw new Error("E-mail ou senha incorretos!");
    }
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response, "Não foi possível autenticar."));
    }
    return await response.json();
  }

  // CSU01 - Cadastrar-se
  async save(user: User): Promise<void> {
    const response = await fetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 409) {
      throw new Error("Este e-mail já está cadastrado!");
    }
    if (!response.ok) {
      throw new Error(await extractErrorMessage(response, "Não foi possível realizar o cadastro."));
    }
  }

  initSession(token: AccessToken): void {
    if (token.accessToken) {
      const decodedToken = jwtDecode<{ sub?: string; name?: string; exp?: number }>(token.accessToken);

      const userSessionToken: UserSessionToken = {
        accessToken: token.accessToken,
        email: decodedToken.sub,
        name: decodedToken.name,
        expiration: decodedToken.exp,
      };

      this.setUserSession(userSessionToken);
    }
  }

  setUserSession(userSessionToken: UserSessionToken): void {
    try {
      localStorage.setItem(AuthService.AUTH_PARAM, JSON.stringify(userSessionToken));
    } catch {
      // armazenamento indisponível (ex.: modo privado restrito)
    }
  }

  getUserSession(): UserSessionToken | null {
    try {
      const authString = localStorage.getItem(AuthService.AUTH_PARAM);
      if (!authString) {
        return null;
      }
      return JSON.parse(authString) as UserSessionToken;
    } catch {
      return null;
    }
  }

  // RNF03: a sessão expira junto com o token (60 minutos)
  isSessionValid(): boolean {
    const userSession = this.getUserSession();
    if (!userSession?.expiration) {
      return false;
    }
    const nowInSeconds = Date.now() / 1000;
    return userSession.expiration > nowInSeconds;
  }

  // CSU03 - Encerrar Sessão (somente no navegador)
  invalidateSession(): void {
    try {
      localStorage.removeItem(AuthService.AUTH_PARAM);
    } catch {
      // nada a fazer
    }
  }
}

export const useAuth = () => new AuthService();
