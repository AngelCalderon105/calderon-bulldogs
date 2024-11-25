import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import Navbar from "./_components/Navigation"
import Footer from "./_components/Footer"
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
      <Navbar isAdmin={false}/>
        <TRPCReactProvider>{children}</TRPCReactProvider>+
      <Footer/>
      </body>
    </html>
  );
}
