import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Or whatever font you chose
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

type Settings = Database['public']['Tables']['company_settings']['Row'];

export const metadata: Metadata = {
  title: "Next.js E-commerce",
  description: "Powered by Supabase",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { data } = await supabase.from('company_settings').select('*').single();
  const settings = data as Settings | null;
  const siteName = settings?.site_name || "Store Name";

  return (
    <html lang="en">
      <body className={`${font.className} antialiased bg-gray-50 text-gray-900 flex flex-col min-h-screen`}>
        {/* Simple Navbar without the complex Admin checks */}
        <Navbar siteName={siteName} />

        <main className="flex-grow">
          {children}
        </main>

        <Footer settings={settings} />
      </body>
    </html>
  );
}