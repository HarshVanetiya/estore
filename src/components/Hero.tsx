import Link from 'next/link';
import Image from 'next/image';
import { Database } from '@/types/database.types';

type Settings = Database['public']['Tables']['company_settings']['Row'];

export default function Hero({ settings }: { settings: Settings | null }) {
    if (!settings) return null;

    return (
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden bg-gray-900">

            {/* 1. Background Image */}
            {settings.hero_image_url ? (
                <Image
                    src={settings.hero_image_url}
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-60" // Darken image so text pops
                    priority // Load this image ASAP (LCP optimization)
                />
            ) : (
                // Fallback Gradient if no image exists
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-black opacity-80" />
            )}

            {/* 2. Text Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {settings.hero_title || "Welcome to Our Store"}
                </h1>

                <p className="text-lg md:text-xl text-gray-200 font-medium drop-shadow">
                    {settings.hero_subtitle || "Discover the best products at unbeatable prices."}
                </p>

                <div className="pt-4">
                    <Link
                        href="/category/Electronics"
                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        </div>
    );
}