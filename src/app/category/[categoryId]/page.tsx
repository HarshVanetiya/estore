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
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Subcategory</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {subcategories.map(sub => (
                                <Link
                                    key={sub.id}
                                    href={`/category/${categoryId}/sub/${sub.id}`}
                                    className="p-6 rounded-xl border-2 border-[#f9dc5c] bg-white/50 backdrop-blur-sm hover:bg-[#f9dc5c]/20 transition-all duration-300 hover:shadow-lg hover:shadow-[#f9dc5c]/20 hover:scale-105"
                                >
                                    <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Products */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Products</h2>
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
                                        <p className="text-2xl font-bold text-[#f9dc5c]">${product.price}</p>
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
