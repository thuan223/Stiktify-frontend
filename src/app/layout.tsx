"use client";

import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/library/AntdRegistry";
import "@/app/globals.css";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShowCommentProvider } from "@/context/ShowCommentContext";
import { GlobalContextProvider } from "@/library/global.context";
import { roleRoutes, defaultRoutes } from "@/utils/roleRoute";

const inter = Inter({ subsets: ["latin"] });

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = user?.role ?? "GUEST";
      const allowedRoutes = roleRoutes[userRole] || [];

      // Kiểm tra route
      const isAllowed = allowedRoutes.some((route) =>
        route instanceof RegExp ? route.test(pathname) : route === pathname
      );

      if (!isAllowed) {
        router.replace(defaultRoutes[userRole] || "/page/trending-guest");
      }
    }
  }, [user, pathname]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <GlobalContextProvider>
      <AuthProvider>
        <ShowCommentProvider>
          <html lang="en">
            <head>
              <title>Stiktify</title>
              <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
            </head>
            <body className={inter.className}>
              <StyledComponentsRegistry>
                <AuthWrapper>{children}</AuthWrapper>
              </StyledComponentsRegistry>
            </body>
          </html>
        </ShowCommentProvider>
      </AuthProvider>
    </GlobalContextProvider>
  );
}
