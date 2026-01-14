import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  illustration: ReactNode;
  illustrationAlt?: string;
}

export function AuthLayout({ children, illustration }: AuthLayoutProps) {
  return (
    <div className="auth-wrapper">
      {/* Logo */}
      <Link to="/" className="auth-brand z-10">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <svg 
            viewBox="0 0 32 22" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
              fill="currentColor"
            />
            <path
              opacity="0.06"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
              fill="#000"
            />
            <path
              opacity="0.06"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
              fill="#000"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span>Sneat</span>
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
