import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shark System — Gestão de Empréstimos",
  description:
    "Controle total da sua carteira de crédito: cobranças, parcelas, clientes e fluxo de caixa em um só lugar.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Shark System — Gestão de Empréstimos",
    description:
      "Controle total da sua carteira de crédito: cobranças, parcelas, clientes e fluxo de caixa em um só lugar.",
    url: "https://sharky.teltech.com.br",
    siteName: "Shark System",
    images: [
      {
        url: "https://sharky.teltech.com.br/shark-avatar.png",
        width: 800,
        height: 800,
        alt: "Shark System — Gestão de Empréstimos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shark System — Gestão de Empréstimos",
    description:
      "Controle total da sua carteira de crédito: cobranças, parcelas, clientes e fluxo de caixa em um só lugar.",
    images: ["https://sharky.teltech.com.br/shark-avatar.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090D16]">
        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
