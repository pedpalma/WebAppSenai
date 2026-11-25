interface LogoProps {
  className?: string;
  tagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "text-3xl", tagline = false }) => (
  <div className="flex flex-col items-center text-center">
    <span
      className={`font-logo font-bold uppercase leading-none tracking-tight text-white [text-shadow:0_0_18px_rgba(255,255,255,0.45)] ${className}`}
    >
      Galeria
    </span>
    {tagline && (
      <span className="mt-2 text-sm font-semibold leading-tight text-white">
        Registre suas
        <br />
        Peças!
      </span>
    )}
  </div>
);
