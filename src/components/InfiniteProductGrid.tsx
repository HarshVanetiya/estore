'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface InfiniteProductGridProps {
    initialProducts: any[];
    searchParams?: {
        category?: string;
        sub?: string;
        minPrice?: string;
        maxPrice?: string;
    };
    mode?: 'all' | 'sale';
}

const PAGE_SIZE = 12;

export default function InfiniteProductGrid({ initialProducts, searchParams = {}, mode = 'all' }: InfiniteProductGridProps) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProducts.length === PAGE_SIZE);

    const observer = useRef<IntersectionObserver | null>(null);

    // Reset state when filters change
    useEffect(() => {
        setProducts(initialProducts);
        setPage(0);
        setHasMore(initialProducts.length === PAGE_SIZE);
    }, [initialProducts]);

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;
        const from = nextPage * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from('products')
            .select('*, sub_categories!inner(id, category_id)')
            .order(mode === 'sale' ? 'discount_percent' : 'created_at', { ascending: false })
            .range(from, to);

        if (mode === 'sale') {
            query = query.gt('discount_percent', 0);
        } else {
            // Only apply these filters if not in pure sale mode (or apply anyway if passed)
            if (searchParams.sub) {
                query = query.eq('sub_category_id', searchParams.sub);
            } else if (searchParams.category) {
                query = query.eq('sub_categories.category_id', searchParams.category);
            }

            if (searchParams.minPrice) {
                query = query.gte('price', parseInt(searchParams.minPrice));
            }
            if (searchParams.maxPrice) {
                query = query.lte('price', parseInt(searchParams.maxPrice));
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching more products:', error);
            setLoading(false);
            return;
        }

        if (data) {
            const newProducts = data as any[];
            setProducts((prev) => [...prev, ...newProducts]);
            setPage(nextPage);
            setHasMore(newProducts.length === PAGE_SIZE);
        }
        setLoading(false);
    }, [page, loading, hasMore, searchParams, mode]);

    const lastProductElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreProducts();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, loadMoreProducts]
    );

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, idx) => {
                    const isLastElement = products.length === idx + 1;
                    return (
                        <div key={`${product.id}-${idx}`} ref={isLastElement ? lastProductElementRef : null}>
                            <ProductCard product={product} index={idx % PAGE_SIZE} />
                        </div>
                    );
                })}
            </div>

            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex justify-center py-10"
                    >
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border-2 border-vanilla-custard shadow-xl">
                            <Loader2 className="animate-spin text-royal-gold" />
                            <span className="text-sm font-bold uppercase tracking-widest text-neutral-600">Loading fine goods...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!hasMore && products.length > 0 && (
                <div className="text-center py-10">
                    <div className="h-px bg-gradient-to-r from-transparent via-vanilla-custard to-transparent mb-6" />
                    <p className="text-neutral-400 font-medium italic text-sm">
                        You've reached the end of our current collection.
                    </p>
                </div>
            )}
        </div>
    );
}
