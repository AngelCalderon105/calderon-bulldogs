import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Footer from "./_components/Footer";
import Navigation from "./_components/Navigation";

export const metadata: Metadata = {
  title: "Calderon Bulldogs",
  description: "Made by Altitud",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer/>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
