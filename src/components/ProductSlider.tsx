'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Database } from '@/types/database.types'
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles } from 'lucide-react'

// Helper type for our Product
type Product = Database['public']['Tables']['products']['Row']

interface ProductSliderProps {
    title: string
    products: Product[]
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
    // Initialize Embla
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        duration: 25  // Smoother scroll duration
    })
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    if (!products || products.length === 0) return null

    return (
        <section className="py-12 relative group bg-[#fdf8e1]">
            {/* Section Header with Animation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center px-4 mb-8 md:px-10"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#f9dc5c] to-[#fae588] rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
                </div>
                <Link
                    href={`/category/${title}`}
                    className="group/link text-sm font-semibold text-gray-600 hover:text-[#f9dc5c] flex items-center gap-1 transition-all duration-300"
                >
                    View All
                    <ChevronRight
                        size={16}
                        className="group-hover/link:translate-x-1 transition-transform duration-300"
                    />
                </Link>
            </motion.div>

            {/* Embla Viewport */}
            <div className="overflow-hidden px-4 md:px-10" ref={emblaRef}>
                <div className="flex gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                ease: "easeOut"
                            }}
                            className="flex-[0_0_70%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0"
                        >
                            <Link href={`/product/${product.id}`} className="block group/card h-full bg-white rounded-2xl overflow-hidden border-2 border-[#fae588] shadow-[0_4px_12px_rgba(249,220,92,0.25)] hover:shadow-[0_12px_32px_rgba(249,220,92,0.45)] hover:border-[#f9dc5c] transition-all duration-300 hover:-translate-y-2">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-[#fcefb4] overflow-hidden">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[#f9dc5c] bg-[#fcefb4]">
                                            No Image
                                        </div>
                                    )}

                                    {/* Discount Badge */}
                                    {product.discount_percent != null && product.discount_percent > 0 && (
                                        <div className="absolute top-3 left-3 z-[2]">
                                            <div className="bg-[#f9dc5c] text-gray-900 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                -{product.discount_percent}%
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Details Area */}
                                <div className="p-4 space-y-2">
                                    <h3 className="font-medium text-base text-gray-900 line-clamp-1 group-hover/card:text-[#f9dc5c] transition-colors duration-300">
                                        {product.title}
                                    </h3>

                                    <div className="flex items-baseline gap-2">
                                        <div className="font-bold text-lg text-[#f9dc5c]">
                                            ₹{product.price}
                                        </div>
                                        {product.discount_percent != null && product.discount_percent > 0 && (
                                            <div className="text-xs text-gray-400 line-through">
                                                ₹{(product.price / (1 - product.discount_percent / 100)).toFixed(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons with Gold Accents */}
            <div className="hidden md:block">
                <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-gray-100 text-gray-900 hover:border-[#f9dc5c] hover:bg-gradient-to-br hover:from-white hover:to-[#fdf8e1] hover:shadow-2xl hover:shadow-[#f9dc5c]/20 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95"
                    disabled={!canScrollPrev}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-gray-100 text-gray-900 hover:border-[#f9dc5c] hover:bg-gradient-to-br hover:from-white hover:to-[#fdf8e1] hover:shadow-2xl hover:shadow-[#f9dc5c]/20 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110 active:scale-95"
                    disabled={!canScrollNext}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    )
}