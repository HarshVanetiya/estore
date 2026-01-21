import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Star } from 'lucide-react';
import ExpandableDescription from '@/components/ExpandableDescription';
import ProductCard from '@/components/ProductCard';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;

    // Fetch product details with a simpler join first
    const { data: productData, error } = await supabase
        .from('products')
        .select(`
            *,
            sub_categories (
                name,
                category_id,
                categories (
                    id,
                    name
                )
            )
        `)
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error("Supabase Error fetching product:", error);
    }

    if (!productData) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-neutral-800 font-playfair uppercase">Product Not Found</h1>
                <p className="text-neutral-500 mt-4 mb-8">The product you are looking for might have been moved or deleted.</p>
                <Link href="/" className="px-8 py-3 bg-royal-gold text-neutral-900 font-bold rounded-xl shadow-lg hover:scale-105 transition-all inline-block">
                    Return to Shop
                </Link>
            </div>
        );
    }

    const product = productData as any;
    const sellingPrice = product.discount_percent && product.discount_percent > 0
        ? Math.round(product.price * (1 - product.discount_percent / 100))
        : product.price;
    const originalPrice = product.discount_percent && product.discount_percent > 0
        ? product.price
        : null;

    const subCategory = product.sub_categories;
    const category = subCategory?.categories;

    // Fetch related products
    let relatedProducts: any[] = [];
    if (subCategory) {
        // 1. Try fetching from same sub-category
        const { data: sameSub } = await supabase
            .from('products')
            .select('*')
            .eq('sub_category_id', product.sub_category_id)
            .neq('id', id)
            .limit(4);

        relatedProducts = sameSub || [];

        // 2. If not enough, fetch from same category
        if (relatedProducts.length < 4 && subCategory.category_id) {
            const { data: sameCat } = await supabase
                .from('products')
                .select('*, sub_categories!inner(category_id)')
                .eq('sub_categories.category_id', subCategory.category_id)
                .neq('id', id)
                .not('id', 'in', `(${relatedProducts.map(p => p.id).join(',') || '00000000-0000-0000-0000-000000000000'})`)
                .limit(4 - relatedProducts.length);

            if (sameCat) {
                relatedProducts = [...relatedProducts, ...sameCat];
            }
        }
    }

    return (
        <div className="min-h-screen bg-cornsilk/30 pb-20">
            <div className="container mx-auto px-4 md:px-10 py-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-3 text-sm text-neutral-500 mb-10">
                    <Link href="/" className="hover:text-royal-gold transition-colors">Home</Link>
                    <span>/</span>
                    {category && (
                        <>
                            <Link href={`/category/${category.id}`} className="hover:text-royal-gold transition-colors">{category.name}</Link>
                            <span>/</span>
                        </>
                    )}
                    <span className="text-neutral-900 font-medium truncate">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Image Gallery Placeholder */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-vanilla-custard shadow-2xl">
                            {product.images && product.images[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-royal-gold text-xl font-bold bg-vanilla-custard/20">
                                    No Image Available
                                </div>
                            )}

                            {product.discount_percent > 0 && (
                                <div className="absolute top-6 left-6">
                                    <div className="bg-royal-gold text-neutral-900 px-4 py-2 rounded-full text-sm font-black shadow-xl animate-pulse">
                                        {product.discount_percent}% OFF
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Placeholders if multiple images */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-vanilla-custard hover:border-royal-gold transition-all cursor-pointer">
                                        <Image src={img} alt={`${product.title} ${idx}`} fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            {subCategory && (
                                <span className="text-royal-gold font-bold text-sm uppercase tracking-widest">{subCategory.name}</span>
                            )}
                            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mt-2 font-playfair uppercase leading-tight">
                                {product.title}
                            </h1>
                        </div>

                        <div className="p-6 bg-white rounded-2xl border border-vanilla-custard shadow-xl relative overflow-hidden">
                            {/* Decorative Light Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/10 blur-3xl -mr-16 -mt-16 rounded-full" />

                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-royal-gold">₹{sellingPrice.toLocaleString()}</span>
                                {originalPrice && (
                                    <span className="text-xl text-neutral-400 line-through decoration-red-500 decoration-2 font-medium">
                                        ₹{originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-neutral-500 mt-2">Inclusive of all taxes</p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 bg-neutral-900 text-white py-4 px-8 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                                <button className="flex-1 bg-royal-gold text-neutral-900 py-4 px-8 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-royal-gold/20 hover:scale-[1.02] transition-all active:scale-95">
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        <ExpandableDescription description={product.description} />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-vanilla-custard">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-royal-gold/10 rounded-lg text-royal-gold">
                                    <Truck size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Free Delivery</p>
                                    <p className="text-xs text-neutral-500">Orders over ₹2000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-royal-gold/10 rounded-lg text-royal-gold">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Premium Quality</p>
                                    <p className="text-xs text-neutral-500">Certified Products</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-royal-gold/10 rounded-lg text-royal-gold">
                                    <RefreshCw size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-neutral-900">Easy Returns</p>
                                    <p className="text-xs text-neutral-500">30-day window</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 space-y-10">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <span className="text-royal-gold font-bold text-sm uppercase tracking-[0.3em]">Curated For You</span>
                            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 font-playfair uppercase">You May Also Like</h2>
                            <div className="w-24 h-1.5 bg-royal-gold rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p, idx) => (
                                <ProductCard key={p.id} product={p} index={idx} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
