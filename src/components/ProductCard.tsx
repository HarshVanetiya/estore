'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
    product: Product
    index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const sellingPrice = product.discount_percent && product.discount_percent > 0
        ? Math.round(product.price * (1 - product.discount_percent / 100))
        : product.price
    const originalPrice = product.discount_percent && product.discount_percent > 0
        ? product.price
        : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }}
            className="h-full"
        >
            <Link
                href={`/product/${product.id}`}
                className="block group h-full bg-white rounded-2xl overflow-hidden border border-vanilla-custard shadow-[0_4px_20px_rgba(249,220,92,0.1)] hover:shadow-[0_12px_40px_rgba(249,220,92,0.3)] hover:border-royal-gold transition-all duration-500 hover:-translate-y-2"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] bg-cornsilk overflow-hidden">
                    {/* Gold border glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                        <div className="absolute inset-0 border-2 border-royal-gold shadow-[0_0_20px_rgba(249,220,92,0.4)]" />
                    </div>

                    {product.images && product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-royal-gold bg-vanilla-custard/20">
                            No Image
                        </div>
                    )}

                    {/* Discount Badge */}
                    {product.discount_percent != null && product.discount_percent > 0 && (
                        <div className="absolute top-4 left-4 z-[20]">
                            <div className="bg-royal-gold text-neutral-900 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                {product.discount_percent}% OFF
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Area */}
                <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-neutral-800 line-clamp-1 group-hover:text-royal-gold transition-colors duration-300 font-playfair uppercase tracking-tight">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-3">
                        <div className="font-black text-2xl text-royal-gold">
                            ₹{sellingPrice.toLocaleString()}
                        </div>
                        {originalPrice && (
                            <div className="text-sm text-neutral-400 line-through decoration-red-500 decoration-2 font-medium">
                                ₹{originalPrice.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
