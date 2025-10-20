import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OriginUINavi from "@/components/navigation/header-navigation";
import Footer from "@/components/layout/footer";
import { ErrorDialogProvider } from "@/components/dialogs/error-dialog";
import { SuccessDialogProvider } from "@/components/dialogs/success-dialog";
import { ConfirmDialogProvider } from "@/components/dialogs/confirm-dialog";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthDialogProvider } from "@/contexts/AuthDialogContext";
import { AppProviders } from "@/components/auth/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wang Beagle's blog",
  description: "Tutongbrothers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased min-h-screen flex flex-col`}
      >
        <ErrorDialogProvider>
          <SuccessDialogProvider>
            <ConfirmDialogProvider>
              <AuthProvider>
                <AuthDialogProvider>
                  <AppProviders>
                    <OriginUINavi />
                    <main className="flex-grow">
                      {children}
                    </main>
                    <Footer />
                  </AppProviders>
                </AuthDialogProvider>
              </AuthProvider>
            </ConfirmDialogProvider>
          </SuccessDialogProvider>
        </ErrorDialogProvider>
      </body>
    </html>
  );
}