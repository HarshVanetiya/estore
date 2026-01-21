import { supabase } from '@/lib/supabase';
import ProductsHero from '@/components/ProductsHero';
import FilterIsland from '@/components/FilterIsland';
import InfiniteProductGrid from '@/components/InfiniteProductGrid';
import { Database } from '@/types/database.types';

const PAGE_SIZE = 12;

interface AllProductsPageProps {
    searchParams: Promise<{
        category?: string;
        sub?: string;
        minPrice?: string;
        maxPrice?: string;
    }>;
}

export default async function AllProductsPage({ searchParams }: AllProductsPageProps) {
    const params = await searchParams;
    const { category, sub, minPrice, maxPrice } = params;

    // Fetch metadata for the Hero
    const { data: settingsData } = await supabase
        .from('company_settings')
        .select('all_products_image_url, products_hero_title, products_hero_subtitle')
        .single();

    const settings = settingsData as any;

    let heroTitle = settings?.products_hero_title || "All Products";
    let heroSubtitle = settings?.products_hero_subtitle || "Explore our meticulously curated selection of premium goods, crafted for those who appreciate the finer things in life.";
    let heroImage = settings?.all_products_image_url || null;

    if (sub) {
        const { data: subData }: { data: any } = await supabase
            .from('sub_categories')
            .select('name, categories(name, image_url)')
            .eq('id', sub)
            .single();

        if (subData) {
            heroTitle = subData.name;
            heroSubtitle = `Premium selection of ${subData.name} from our ${subData.categories.name} collection.`;
            heroImage = subData.categories.image_url;
        }
    } else if (category) {
        const { data: catData }: { data: any } = await supabase
            .from('categories')
            .select('name, image_url')
            .eq('id', category)
            .single();

        if (catData) {
            heroTitle = catData.name;
            heroSubtitle = `Discover our exclusive collection of premium ${catData.name} items.`;
            heroImage = catData.image_url;
        }
    }

    // Fetch initial data for filters
    const [{ data: categoriesData }, { data: subCategoriesData }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('sub_categories').select('*').order('name')
    ]);

    // Build the query for initial products
    let query = supabase
        .from('products')
        .select('*, sub_categories!inner(id, category_id)')
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1);

    // Apply filters
    if (sub) {
        query = query.eq('sub_category_id', sub);
    } else if (category) {
        query = query.eq('sub_categories.category_id', category);
    }

    if (minPrice) {
        query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice));
    }

    const { data: initialProductsData, error } = await query;
    const initialProducts = (initialProductsData as any[]) || [];

    if (error) {
        console.error("Error fetching products:", error);
    }

    return (
        <div className="min-h-screen bg-cornsilk/30 pb-20 font-inter">
            <ProductsHero
                title={heroTitle}
                subtitle={heroSubtitle}
                backgroundImage={heroImage}
            />

            <FilterIsland
                categories={categoriesData || []}
                subCategories={subCategoriesData || []}
            />

            {/* Products Grid Section */}
            <div className="container mx-auto px-4 md:px-10 py-16">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 pb-6 border-b border-vanilla-custard">
                    <div className="text-neutral-500 font-medium">
                        Explore our <span className="text-neutral-900 font-bold">curated</span> collection
                        {(category || sub || minPrice || maxPrice) && (
                            <span className="ml-2 px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs font-bold uppercase tracking-widest">Filters Applied</span>
                        )}
                    </div>
                </div>

                {initialProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-neutral-800 uppercase tracking-wider">No products found</h3>
                        <p className="text-neutral-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                ) : (
                    <InfiniteProductGrid
                        initialProducts={initialProducts}
                        searchParams={params}
                    />
                )}
            </div>
        </div>
    );
}
