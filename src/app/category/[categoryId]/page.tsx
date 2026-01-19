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
    sub_category_id: string;
    created_at: string;
}

interface CategoryPageProps {
    params: {
        categoryId: string;
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { categoryId } = params;

    // Fetch category details
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single() as { data: Category | null };

    // Fetch subcategories
    const { data: subcategories } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('category_id', categoryId)
        .order('name') as { data: SubCategory[] | null };

    // Fetch products in this category (through subcategories)
    const subcategoryIds = subcategories?.map(sub => sub.id) || [];
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .in('sub_category_id', subcategoryIds)
        .order('created_at', { ascending: false }) as { data: Product[] | null };

    if (!category) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-bold">Category not found</h1>
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
                    <span className="text-gray-900 font-medium">{category.name}</span>
                </div>

                {/* Category Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
                    <p className="text-gray-700">Explore our collection of {category.name.toLowerCase()}</p>
                </div>

                {/* Subcategories */}
                {subcategories && subcategories.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 bg-gradient-to-b from-[#f9dc5c] to-[#fae588] rounded-full" />
                            <h2 className="text-2xl font-semibold text-gray-900">Browse by Subcategory</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subcategories.map((sub, index) => (
                                <Link
                                    key={sub.id}
                                    href={`/category/${categoryId}/sub/${sub.id}`}
                                    className="group relative p-6 rounded-2xl border border-gray-200 bg-white shadow-[0_8px_24px_rgba(107,114,128,0.12)] hover:shadow-[0_16px_40px_rgba(107,114,128,0.2)] hover:border-[#f9dc5c] transition-all duration-500 hover:-translate-y-1 active:scale-95"
                                    style={{
                                        animationDelay: `${index * 50}ms`,
                                        animation: 'fade-in-up 0.5s ease-out forwards'
                                    }}
                                >
                                    {/* Gold glow on hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(249,220,92,0.3)]" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800 group-hover:text-[#f9dc5c] transition-colors duration-300 relative z-10">
                                        {sub.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 bg-gradient-to-b from-[#f9dc5c] to-[#fae588] rounded-full" />
                        <h2 className="text-2xl font-semibold text-gray-900">All Products</h2>
                    </div>
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
                                        <p className="text-2xl font-bold text-[#f9dc5c]">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No products found in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
