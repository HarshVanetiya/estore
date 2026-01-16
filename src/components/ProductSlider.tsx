'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { Database } from '@/types/database.types'

// Helper type for our Product
type Product = Database['public']['Tables']['products']['Row']

interface ProductSliderProps {
    title: string
    products: Product[]
}

export default function ProductSlider({ title, products }: ProductSliderProps) {
    // Initialize Embla with Autoplay
    const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 4000, stopOnInteraction: true })
    ])

    if (!products || products.length === 0) return null

    return (
        <section className="py-8">
            <div className="flex justify-between items-end px-4 mb-4 md:px-10">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <Link href={`/category/${title}`} className="text-sm text-blue-600 hover:underline">
                    View All &rarr;
                </Link>
            </div>

            {/* Embla Viewport */}
            <div className="overflow-hidden px-4 md:px-10" ref={emblaRef}>
                <div className="flex gap-4">
                    {products.map((product) => (
                        <div key={product.id} className="flex-[0_0_80%] md:flex-[0_0_25%] min-w-0">
                            <Link href={`/product/${product.id}`} className="block group h-full">
                                <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white h-full flex flex-col">

                                    {/* Image Area */}
                                    <div className="relative h-48 bg-gray-100">
                                        {product.images && product.images[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, 25vw"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-gray-300">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    {/* Details Area */}
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-3 flex-grow">
                                            {product.description}
                                        </p>
                                        <div className="font-bold text-lg text-gray-900">
                                            ${product.price}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}