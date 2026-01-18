import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { useAppLogo } from "@/hooks/useAppLogo";

interface AuthLayoutProps {
  children: ReactNode;
  illustration: ReactNode;
  illustrationAlt?: string;
}

export function AuthLayout({ children, illustration }: AuthLayoutProps) {
  const { logo } = useAppLogo();

  return (
    <div className="auth-wrapper">
      {/* Logo */}
      <Link to="/" className="auth-brand z-10">
        {logo.url ? (
          <img src={logo.url} alt={logo.alt} className="w-8 h-8 rounded-md object-contain" />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">{logo.companyName.charAt(0)}</span>
          </div>
        )}
        <span>{logo.companyName}</span>
      </Link>

      {/* Left - Illustration */}
      <div className="auth-cover">
        <div className="w-full max-w-2xl">
          {illustration}
        </div>
      </div>

      {/* Right - Form */}
      <div className="auth-form-section">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
