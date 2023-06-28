import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/app/components/NavBar";

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
      <body className={inter.className}>
        <div className="container mx-auto mt-10">
          <header>
            <NavBar />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
