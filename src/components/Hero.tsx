'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Database } from '@/types/database.types';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

type Settings = Database['public']['Tables']['company_settings']['Row'];

export default function Hero({ settings }: { settings: Settings | null }) {
    if (!settings) return null;

    return (
        <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
            {/* 1. Background Image */}
            {settings.hero_image_url ? (
                <Image
                    src={settings.hero_image_url}
                    alt="Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#fdf8e1] via-[#fcefb4] to-[#fae588]" />
            )}

            {/* 2. Gradient Overlay - for depth and blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-black/15 z-[1]" />

            {/* 3. Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5 z-[1]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #f9dc5c 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            {/* 4. Decorative Gold Blobs - Hidden on mobile */}
            <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-[#f9dc5c]/20 rounded-full blur-3xl z-[1]" />
            <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-[#fae588]/20 rounded-full blur-3xl z-[1]" />

            {/* 5. Premium Text Content */}
            <div className="relative z-10 text-center px-6 max-w-[720px]">
                {/* Accent Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 sm:mb-6 shadow-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                >
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-[#f9dc5c]" />
                    <span className="text-xs sm:text-sm font-semibold text-white/90 tracking-wide uppercase">Online Store</span>
                </motion.div>

                {/* Main Headline - White with soft shadow */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-3 sm:mb-4 leading-[1.05] tracking-tight"
                    style={{
                        textShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 0, 0, 0.3)'
                    }}
                >
                    {settings.hero_title || "Big Deals. Small Prices."}
                    <span
                        className="block text-[#f9dc5c] mt-1 sm:mt-2"
                        style={{
                            textShadow: '0 6px 25px rgba(0, 0, 0, 0.45), 0 0 15px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        Crafted For You
                    </span>
                </motion.h1>

                {/* Subtitle - White with soft shadow */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-[520px] mx-auto leading-relaxed font-normal"
                    style={{
                        textShadow: '0 4px 15px rgba(0, 0, 0, 0.8)'
                    }}
                >
                    {settings.hero_subtitle || "Curated products, transparent pricing, and fast delivery — built for modern customers."}
                </motion.p>

                {/* CTA Button - Dark luxury style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md text-[#f9dc5c] px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-4 rounded-full font-bold text-base sm:text-lg border-2 border-[#f9dc5c] hover:bg-[#f9dc5c] hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-[#f9dc5c]/50"
                    >
                        <span className="tracking-wide">Explore Collection</span>
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Trust Indicators - White with soft shadow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8"
                >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#f9dc5c] rounded-full" />
                        <span
                            className="text-xs sm:text-sm font-semibold tracking-wide text-white/90"
                            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                        >
                            Free Shipping
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#f9dc5c] rounded-full" />
                        <span
                            className="text-xs sm:text-sm font-semibold tracking-wide text-white/90"
                            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                        >
                            Secure Payment
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#f9dc5c] rounded-full" />
                        <span
                            className="text-xs sm:text-sm font-semibold tracking-wide text-white/90"
                            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
                        >
                            24/7 Support
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}