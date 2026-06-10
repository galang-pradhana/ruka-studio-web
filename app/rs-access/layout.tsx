import { Suspense } from "react";

export const metadata = {
  title: "Login | Ruka Studio Admin",
  description: "Masuk ke Admin Panel Ruka Studio",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      {children}
    </Suspense>
  );
}
