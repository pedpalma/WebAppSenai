"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthField, Logo, useNotification } from "@/components";
import { useAuth } from "@/resources/user/authentication.service";

interface CadastroForm {
  email: string;
  name: string;
  password: string;
  passwordMatch: string;
}

// CSU01 - E1: e-mail mal formatado, senha com menos de 8 caracteres (RN02) ou senhas diferentes
const validationScheme = Yup.object().shape({
  email: Yup.string().trim().required("Informe o e-mail.").email("E-mail inválido."),
  name: Yup.string().trim().required("Informe o nome.").max(150, "Nome muito longo."),
  password: Yup.string().required("Informe a senha.").min(8, "A senha deve ter no mínimo 8 caracteres."),
  passwordMatch: Yup.string()
    .required("Confirme a senha.")
    .oneOf([Yup.ref("password")], "As senhas não coincidem."),
});

// CSU01 - Cadastrar-se
export default function CadastroPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const auth = useAuth();
  const notification = useNotification();
  const router = useRouter();

  const formik = useFormik<CadastroForm>({
    initialValues: { email: "", name: "", password: "", passwordMatch: "" },
    validationSchema: validationScheme,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await auth.save({ name: values.name.trim(), email: values.email.trim(), password: values.password });
        notification.notify("Cadastro realizado com sucesso! Faça login.", "success");
        router.push("/login");
      } catch (error) {
        notification.notify((error as Error).message, "error");
      } finally {
        setLoading(false);
      }
    },
  });

  const fieldError = (field: keyof CadastroForm) => (formik.touched[field] && formik.errors[field]) || undefined;

  const input = (field: keyof CadastroForm, type: string, placeholder: string, autoComplete: string) => (
    <input
      id={field}
      name={field}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={formik.values[field]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="input-field"
    />
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="auth-card max-w-md">
        <Logo className="text-4xl" tagline />
        <p className="mt-6 text-center text-sm font-semibold">Faça o seu cadastro!</p>

        <form onSubmit={formik.handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
          <AuthField id="email" label="E-mail" error={fieldError("email")}>
            {input("email", "email", "email.exemplo@email.com", "email")}
          </AuthField>
          <AuthField id="name" label="Nome" error={fieldError("name")}>
            {input("name", "text", "Digite seu nome", "name")}
          </AuthField>
          <AuthField id="password" label="Senha" error={fieldError("password")}>
            {input("password", "password", "••••••••", "new-password")}
          </AuthField>
          <AuthField id="passwordMatch" label="Confirme a senha" error={fieldError("passwordMatch")}>
            {input("passwordMatch", "password", "••••••••", "new-password")}
          </AuthField>

          <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar cadastro"}
          </button>
        </form>

        {/* A1: cancelar volta ao login sem gravar */}
        <p className="mt-6 text-center text-sm text-white/70">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
