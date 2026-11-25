"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthField, EyeIcon, EyeOffIcon, Logo, useNotification } from "@/components";
import { notifyAuthChange, useUserSession } from "@/hooks/useUserSession";
import { useAuth } from "@/resources/user/authentication.service";

interface LoginForm {
  email: string;
  password: string;
}

const validationScheme = Yup.object().shape({
  email: Yup.string().trim().required("Informe o e-mail.").email("E-mail inválido."),
  password: Yup.string().required("Informe a senha."),
});

// CSU02 - Autenticar-se
export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const auth = useAuth();
  const notification = useNotification();
  const router = useRouter();
  const { ready, valid } = useUserSession();

  useEffect(() => {
    if (ready && valid) {
      router.replace("/galeria");
    }
  }, [ready, valid, router]);

  const formik = useFormik<LoginForm>({
    initialValues: { email: "", password: "" },
    validationSchema: validationScheme,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const accessToken = await auth.authenticate({ email: values.email.trim(), password: values.password });
        auth.initSession(accessToken);
        notifyAuthChange();
        router.push("/galeria");
      } catch (error) {
        notification.notify((error as Error).message, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const fieldError = (field: keyof LoginForm) => (formik.touched[field] && formik.errors[field]) || undefined;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="auth-card">
        <Logo className="text-4xl" tagline />

        <form onSubmit={formik.handleSubmit} noValidate className="mt-10 flex flex-col gap-4">
          <AuthField id="email" label="E-mail" error={fieldError("email")}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="email.exemplo@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="input-field"
            />
          </AuthField>

          <AuthField id="password" label="Senha" error={fieldError("password")}>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-navy-700 hover:text-navy-500"
              >
                {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </button>
            </div>
          </AuthField>

          <button type="submit" className="btn-primary mt-4 w-full" disabled={loading}>
            {loading ? "Entrando..." : "Fazer Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-white underline-offset-4 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
