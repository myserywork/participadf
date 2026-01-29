import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toast, InstallPrompt } from "@/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Participa DF - Ouvidoria Digital",
    template: "%s | Participa DF"
  },
  description: "Plataforma de Ouvidoria Digital do Governo do Distrito Federal. Registre reclamações, sugestões, elogios, denúncias e solicitações de forma simples e acessível.",
  keywords: ["ouvidoria", "GDF", "Distrito Federal", "reclamação", "sugestão", "denúncia", "serviço público"],
  authors: [{ name: "Governo do Distrito Federal" }],
  creator: "Ouvidoria-Geral do DF",
  publisher: "Governo do Distrito Federal",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://participadf.vercel.app"),
  openGraph: {
    title: "Participa DF - Ouvidoria Digital",
    description: "Sua voz transforma o Distrito Federal. Registre manifestações de forma simples e acessível.",
    url: "https://participadf.gov.br",
    siteName: "Participa DF",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Participa DF - Ouvidoria Digital",
    description: "Sua voz transforma o Distrito Federal",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a8a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        {/* Skip link para acessibilidade */}
        <a 
          href="#main-content" 
          className="skip-link"
        >
          Pular para o conteúdo principal
        </a>
        
        {children}

        <Toast />
        <InstallPrompt />
      </body>
    </html>
  );
}
