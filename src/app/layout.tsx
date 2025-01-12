import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "@/app/globals.css";
import NextAuthWrapper from "@/library/next.auth.wrapper";


const inteBold = Inter({
  subsets: ["latin"],
  weight: ["700"], 
  display: "swap",
});
const interRegular = Inter({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});
export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Stiktify",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={interRegular.className}>
        <AntdRegistry>
          <NextAuthWrapper>{children}</NextAuthWrapper>
        </AntdRegistry>
      </body>
    </html>
  );
}
