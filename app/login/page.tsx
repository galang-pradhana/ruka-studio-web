"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password tidak valid. Coba lagi.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[400px] mx-4"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8E2DD",
          borderRadius: "2px",
          padding: "48px",
        }}
      >
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-4"
            style={{
              backgroundColor: "#1B3B5A",
              borderRadius: "2px",
            }}
          >
            {/* Placeholder Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 21L12 3L21 21"
                stroke="#F4EFEB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 15H18"
                stroke="#F4EFEB"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            className="font-bold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-cinzel, serif)",
              fontSize: "16px",
              color: "#1A1A1A",
              letterSpacing: "0.15em",
            }}
          >
            Ruka Studio
          </div>
          <p
            className="mt-1"
            style={{ fontSize: "13px", color: "#6B6B6B", letterSpacing: "0.02em" }}
          >
            Admin Panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#1A1A1A",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rukastudio.id"
              className="w-full outline-none transition-colors duration-150"
              style={{
                backgroundColor: "#F8F9FA",
                border: "1px solid #E8E2DD",
                borderRadius: "2px",
                padding: "10px 14px",
                fontSize: "14px",
                color: "#1A1A1A",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1B3B5A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2DD")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1.5"
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#1A1A1A",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full outline-none transition-colors duration-150"
              style={{
                backgroundColor: "#F8F9FA",
                border: "1px solid #E8E2DD",
                borderRadius: "2px",
                padding: "10px 14px",
                fontSize: "14px",
                color: "#1A1A1A",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1B3B5A")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#E8E2DD")}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5"
              style={{
                backgroundColor: "rgba(182,68,0,0.07)",
                border: "1px solid rgba(182,68,0,0.2)",
                borderRadius: "2px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b64400"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ fontSize: "13px", color: "#b64400" }}>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer transition-opacity duration-150"
            style={{
              backgroundColor: "#1B3B5A",
              color: "#F4EFEB",
              borderRadius: "2px",
              padding: "12px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "Masuk..." : "Masuk ke Dashboard"}
          </button>
        </form>

        {/* Back to landing */}
        <div className="mt-8 text-center">
          <a
            href="/"
            style={{ fontSize: "12px", color: "#6B6B6B", letterSpacing: "0.02em" }}
            className="hover:underline cursor-pointer transition-colors duration-150"
          >
            ← Kembali ke halaman utama
          </a>
        </div>
      </div>
    </div>
  );
}
