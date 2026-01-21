'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronRight, Check } from 'lucide-react';
import { Database } from '@/types/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type SubCategory = Database['public']['Tables']['sub_categories']['Row'];

interface FilterIslandProps {
    categories: Category[];
    subCategories: SubCategory[];
}

export default function FilterIsland({ categories, subCategories }: FilterIslandProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    // Current filter states from URL
    const activeCategory = searchParams.get('category');
    const activeSubCategory = searchParams.get('sub');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const [priceRange, setPriceRange] = useState({
        min: minPrice || '',
        max: maxPrice || ''
    });

    useEffect(() => {
        setPriceRange({
            min: minPrice || '',
            max: maxPrice || ''
        });
    }, [minPrice, maxPrice]);

    const filteredSubCategories = activeCategory
        ? subCategories.filter(sc => sc.category_id === activeCategory)
        : [];

    const updateFilters = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
            // Reset sub-category if category changes
            if (key === 'category') params.delete('sub');
        } else {
            params.delete(key);
        }
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (priceRange.min) params.set('minPrice', priceRange.min);
        else params.delete('minPrice');

        if (priceRange.max) params.set('maxPrice', priceRange.max);
        else params.delete('maxPrice');

        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const clearAll = () => {
        router.push('/products', { scroll: false });
        setIsOpen(false);
    };

    return (
        <>
            {/* Toggle Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-neutral-900 border-2 border-royal-gold text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold uppercase tracking-widest text-sm"
                >
                    {isOpen ? <X size={20} className="text-royal-gold" /> : <Filter size={20} className="text-royal-gold" />}
                    {isOpen ? 'Close Filters' : 'Filter & Sort'}
                    {(activeCategory || minPrice || maxPrice) && !isOpen && (
                        <span className="bg-royal-gold text-neutral-900 w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-pulse">
                            !
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100, x: '-50%' }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, scale: 0.9, y: 100, x: '-50%' }}
                            className="fixed bottom-28 left-1/2 w-[90vw] max-w-2xl bg-white border-2 border-vanilla-custard rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[70vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-vanilla-custard flex justify-between items-center bg-cornsilk/30">
                                <h3 className="text-xl font-bold text-neutral-900 font-playfair uppercase">Refine Selection</h3>
                                <button onClick={clearAll} className="text-sm font-bold text-royal-gold uppercase tracking-tighter hover:underline">Clear All</button>
                            </div>

                            <div className="overflow-y-auto p-6 space-y-8 flex-1">
                                {/* Categories */}
                                <section className="space-y-4">
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => updateFilters('category', null)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${!activeCategory ? 'bg-royal-gold border-royal-gold text-neutral-900' : 'bg-white border-vanilla-custard text-neutral-500 hover:border-royal-gold'}`}
                                        >
                                            All
                                        </button>
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => updateFilters('category', cat.id)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${activeCategory === cat.id ? 'bg-royal-gold border-royal-gold text-neutral-900' : 'bg-white border-vanilla-custard text-neutral-500 hover:border-royal-gold'}`}
                                            >
                                                {activeCategory === cat.id && <Check size={14} />}
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Sub Categories */}
                                {activeCategory && filteredSubCategories.length > 0 && (
                                    <motion.section
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Sub Categories</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => updateFilters('sub', null)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${!activeSubCategory ? 'bg-royal-gold/20 border-royal-gold text-royal-gold' : 'bg-white border-vanilla-custard text-neutral-500 hover:border-royal-gold'}`}
                                            >
                                                Any
                                            </button>
                                            {filteredSubCategories.map(sub => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => updateFilters('sub', sub.id)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-2 ${activeSubCategory === sub.id ? 'bg-royal-gold border-royal-gold text-neutral-900' : 'bg-white border-vanilla-custard text-neutral-500 hover:border-royal-gold'}`}
                                                >
                                                    {activeSubCategory === sub.id && <Check size={14} />}
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}

                                {/* Price Range */}
                                <section className="space-y-4 pb-4">
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Price Range (₹)</h4>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-full bg-white border-2 border-vanilla-custard rounded-xl px-4 py-3 text-sm focus:border-royal-gold outline-none transition-all"
                                        />
                                        <span className="text-neutral-400">to</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-full bg-white border-2 border-vanilla-custard rounded-xl px-4 py-3 text-sm focus:border-royal-gold outline-none transition-all"
                                        />
                                        <button
                                            onClick={applyPriceFilter}
                                            className="bg-neutral-900 border-2 border-neutral-900 text-white p-3 rounded-xl hover:bg-neutral-800 transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </section>
                            </div>

                            <div className="p-6 bg-cornsilk/30 border-t border-vanilla-custard">
                                <button
                                    onClick={() => {
                                        applyPriceFilter();
                                        setIsOpen(false);
                                    }}
                                    className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    View Results
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
