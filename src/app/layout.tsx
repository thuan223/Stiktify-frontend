"use client";

import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/library/AntdRegistry";
import "@/app/globals.css";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllFollowing } from "@/actions/manage.follow.action";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   icons: {
//     icon: "/favicon.ico",
//   },
//   title: "Stiktify",
//   description: "Generated by create next app",
// };

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext) ?? {};
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "USERS") {
      router.replace("/page/trending-user");
    } else if (user?.role === "ADMIN") {
      router.replace("/dashboard/user");
    }
  }, [user, router]);
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
