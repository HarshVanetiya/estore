'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/types/database.types'
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'

// Helper type for our Product
type Product = Database['public']['Tables']['products']['Row']

interface ProductSliderProps {
    title: string
    products: Product[]
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
    // Initialize Embla
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
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
        <section className="py-12 relative group">
            <div className="flex justify-between items-center px-4 mb-8 md:px-10">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <Link href={`/category/${title}`} className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">
                    View All <ChevronRight size={16} />
                </Link>
            </div>

            {/* Embla Viewport */}
            <div className="overflow-hidden px-4 md:px-10" ref={emblaRef}>
                <div className="flex gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="flex-[0_0_70%] sm:flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0">
                            <Link href={`/product/${product.id}`} className="block group/card h-full">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4">
                                    {product.images && product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-300">
                                            No Image
                                        </div>
                                    )}

                                    {/* Hover Button */}
                                    <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 hover:bg-gray-50">
                                        <ShoppingCart size={20} className="text-gray-900" />
                                    </button>
                                </div>

                                {/* Details Area */}
                                <div>
                                    <h3 className="font-bold text-lg mb-1 truncate text-gray-900">{product.title}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                        {product.description}
                                    </p>
                                    <div className="font-bold text-lg text-gray-900">
                                        ${product.price}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden md:block">
                <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 text-gray-900 hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none"
                    disabled={!canScrollPrev}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl border border-gray-100 text-gray-900 hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none"
                    disabled={!canScrollNext}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    )
}