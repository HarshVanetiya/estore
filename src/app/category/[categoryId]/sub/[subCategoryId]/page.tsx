import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SubCategory } from '@/hooks/useCategories';

interface Category {
    id: string;
    name: string;
    image_url?: string | null;
}

interface Product {
    id: string;
    title: string;
    price: number;
    images?: string[] | null;
    description?: string | null;
    discount_percent?: number | null;
    inventory?: number | null;
    sub_category_id: string;
    created_at: string;
}

interface SubCategoryPageProps {
    params: {
        categoryId: string;
        subCategoryId: string;
    };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
    const { categoryId, subCategoryId } = params;

    // Fetch category details
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single() as { data: Category | null };

    // Fetch subcategory details
    const { data: subcategory } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('id', subCategoryId)
        .single() as { data: SubCategory | null };

    // Fetch products in this subcategory
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('sub_category_id', subCategoryId)
        .order('created_at', { ascending: false }) as { data: Product[] | null };

    if (!category || !subcategory) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Subcategory not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fdf8e1] to-[#fcefb4]">
            <div className="container mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
                    <Link href="/" className="hover:text-[#f9dc5c] transition">Home</Link>
                    <ArrowRight className="h-4 w-4" />
                    <Link href={`/category/${categoryId}`} className="hover:text-[#f9dc5c] transition">
                        {category.name}
                    </Link>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-gray-900 font-medium">{subcategory.name}</span>
                </div>

                {/* Subcategory Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{subcategory.name}</h1>
                    <p className="text-gray-700">
                        Browse {subcategory.name.toLowerCase()} in {category.name}
                    </p>
                </div>

                {/* Products */}
                <div>
                    {products && products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-[0_8px_24px_rgba(107,114,128,0.12)] hover:shadow-[0_16px_40px_rgba(107,114,128,0.2)] hover:border-[#f9dc5c] transition-all duration-500 hover:-translate-y-1"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fade-in-up 0.5s ease-out forwards'
                                    }}
                                >
                                    {product.images && product.images[0] && (
                                        <div className="relative aspect-square bg-white overflow-hidden">
                                            {/* Gold border glow on hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10">
                                                <div className="absolute inset-0 border-2 border-[#f9dc5c] shadow-[0_0_20px_rgba(249,220,92,0.4)]" />
                                            </div>

                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-[#f9dc5c] transition-colors duration-300">
                                            {product.title}
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-bold text-[#f9dc5c]">
                                                ₹{product.price}
                                            </p>
                                            {product.discount_percent && product.discount_percent > 0 && (
                                                <span className="text-xs font-semibold text-white bg-gradient-to-r from-[#f9dc5c] to-[#fae588] px-2 py-1 rounded-full shadow-md">
                                                    {product.discount_percent}% OFF
                                                </span>
                                            )}
                                        </div>
                                        {product.inventory != null && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">No products found in this subcategory.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
