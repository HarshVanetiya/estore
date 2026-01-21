'use client';

import { motion } from 'framer-motion';

interface ProductsHeroProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string | null;
}

export default function ProductsHero({
    title = "All Products",
    subtitle = "Explore our meticulously curated selection of premium goods, crafted for those who appreciate the finer things in life.",
    backgroundImage
}: ProductsHeroProps) {
    return (
        <div className="relative py-32 bg-neutral-900 overflow-hidden min-h-[400px] flex items-center">
            {/* Background Image with Overlay */}
            {backgroundImage ? (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="absolute inset-0 bg-neutral-900/75 backdrop-blur-[2px]" />
                </div>
            ) : (
                <>
                    {/* Decorative Elements for default theme */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-royal-gold/10 blur-[120px] -mr-48 -mt-48 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal-gold/5 blur-[80px] -ml-32 -mb-32 rounded-full" />
                </>
            )}

            <div className="container mx-auto px-4 md:px-10 relative z-10 text-center">
                <motion.div
                    key={title} // Trigger animation on title change
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <span className="text-royal-gold font-bold text-sm uppercase tracking-[0.4em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Our Collection</span>
                    <h1
                        className="text-5xl md:text-7xl font-black text-white font-playfair uppercase leading-tight"
                        style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.2)' }}
                    >
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={i % 2 !== 0 ? "text-royal-gold" : ""}>
                                {word}{' '}
                            </span>
                        ))}
                    </h1>
                    <p
                        className="text-neutral-200 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                    >
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
