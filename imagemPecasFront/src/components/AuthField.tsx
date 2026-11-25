import { RenderIf } from "./Template";

interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

// Campo das telas de login/cadastro: rótulo monoespaçado + input cinza + mensagem de erro
export const AuthField: React.FC<AuthFieldProps> = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="label-mono">
      {label}
    </label>
    {children}
    <RenderIf condition={!!error}>
      <p className="field-error">{error}</p>
    </RenderIf>
  </div>
);
