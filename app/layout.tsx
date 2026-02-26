import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Zikanime - Nonton anime terlengkap",
    description:
        "Website streaming anime terlengkap dengan koleksi ribuan anime subtitle Indonesia.",
    icons: {
        icon: "/favicon.ico"
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body className={inter.className}>
                <Navbar />
                <main className="container mx-auto px-4 py-8">{children}</main>
            </body>
        </html>
    );
}
