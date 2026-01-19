import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
        .single();

    // Fetch subcategory details
    const { data: subcategory } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('id', subCategoryId)
        .single();

    // Fetch products in this subcategory
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('sub_category_id', subCategoryId)
        .order('created_at', { ascending: false });

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
                            {products.map(product => (
                                <div
                                    key={product.id}
                                    className="rounded-xl border-2 border-[#f9dc5c] bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-lg hover:shadow-[#f9dc5c]/20 transition-all duration-300 hover:scale-105"
                                >
                                    {product.images && product.images[0] && (
                                        <div className="aspect-square bg-[#fae588]/20">
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
                                        {product.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-bold text-[#f9dc5c]">${product.price}</p>
                                            {product.discount_percent && product.discount_percent > 0 && (
                                                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                                                    {product.discount_percent}% OFF
                                                </span>
                                            )}
                                        </div>
                                        {product.inventory !== undefined && (
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
