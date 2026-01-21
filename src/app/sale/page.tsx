import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import InfiniteProductGrid from '@/components/InfiniteProductGrid';
import { Database } from '@/types/database.types';

type Product = Database['public']['Tables']['products']['Row'];
const PAGE_SIZE = 12;

export default async function SalePage() {
    // Fetch products with a discount - limited to first PAGE_SIZE
    const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .gt('discount_percent', 0)
        .order('discount_percent', { ascending: false })
        .range(0, PAGE_SIZE - 1) as { data: Product[] | null };

    const products = productsData || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cornsilk to-vanilla-custard/30 pb-20">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
                    <Link href="/" className="hover:text-royal-gold transition-colors">Home</Link>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-neutral-900 font-medium">Flash Sale</span>
                </div>

                {/* Header */}
                <div className="mb-12 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-royal-gold/10 blur-[100px] rounded-full" />
                    <h1 className="text-4xl md:text-6xl font-black text-neutral-900 mb-4 flex items-center gap-4 font-playfair uppercase">
                        <Sparkles className="text-royal-gold h-10 w-10 animate-pulse" />
                        Flash Sale
                    </h1>
                    <p className="text-neutral-600 text-lg max-w-2xl leading-relaxed">
                        Unbeatable offers on our premium collection. Grab your favorites before they're gone!
                    </p>
                </div>

                {/* Products Grid */}
                <div>
                    {products.length > 0 ? (
                        <InfiniteProductGrid
                            initialProducts={products}
                            mode="sale"
                        />
                    ) : (
                        <div className="text-center py-32 bg-white/50 rounded-3xl border-2 border-dashed border-vanilla-custard">
                            <h2 className="text-2xl font-bold text-neutral-400">No active sales at the moment.</h2>
                            <p className="text-neutral-500 mt-2">Check back soon for exciting offers!</p>
                            <Link href="/" className="mt-6 inline-block bg-neutral-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:scale-105 transition-all">
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
