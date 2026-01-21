import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

type Settings = Database['public']['Tables']['company_settings']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export const metadata: Metadata = {
  title: "Next.js E-commerce",
  description: "Powered by Supabase",
};

export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data: settingsData } = await supabase.from('company_settings').select('*').single();
  const settings = settingsData as Settings | null;

  const { data: categoriesData } = await supabase.from('categories').select('*').order('name');
  const categories = categoriesData as Category[] | [];

  const siteName = settings?.site_name || "Store Name";

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-gray-900 flex flex-col min-h-screen bg-white`}>
        {/* Simple Navbar without the complex Admin checks */}
        <Navbar siteName={siteName} />

        <main className="flex-grow">
          {children}
        </main>

        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}