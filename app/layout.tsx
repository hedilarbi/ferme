import type { Metadata } from "next";
import "./globals.css";

// Minimal root layout — tenant branding is injected in app/(site)/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Blog Network",
    template: "%s",
  },
  description: "Multi-tenant blog platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
