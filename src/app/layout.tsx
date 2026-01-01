import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { TRPCReactProvider } from "~/trpc/react";


export const metadata: Metadata = {
  title: "Calderon Bulldogs",
  description:
    "From Our Family to Yours: Delivering Love, Trust, & Quality in Every Pup.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`}>
      <body>
        <TRPCReactProvider>
          {children}
          <Analytics />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
