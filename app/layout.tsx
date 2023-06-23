import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hikka",
  description: "Anime List",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="synthwave" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
