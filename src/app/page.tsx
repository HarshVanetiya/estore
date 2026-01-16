import { supabase } from "@/lib/supabase";
import ProductSlider from "@/components/ProductSlider";
import Hero from "@/components/Hero"; // <--- Import the new component
import { Database } from "@/types/database.types";

export default async function Home() {

  // 1. Fetch Company Settings (Hero Data)
  const settingsPromise = supabase
    .from('company_settings')
    .select('*')
    .single();

  // 2. Fetch Categories & Products (OTT Data)
  const categoriesPromise = supabase
    .from('categories')
    .select(`
      id,
      name,
      sub_categories (
        products (
          *
        )
      )
    `)
    .limit(4);

  // Enterprise pattern: Run both queries in parallel for speed!
  const [settingsResult, categoriesResult] = await Promise.all([
    settingsPromise,
    categoriesPromise
  ]);

  const settings = settingsResult.data;
  const rawCategories = categoriesResult.data || [];

  // 3. Flatten Data for Sliders
  const ottData = (rawCategories as any[]).map((cat) => {
    const allProducts = cat.sub_categories.flatMap((sub: any) => sub.products);
    return {
      categoryName: cat.name,
      products: allProducts
    };
  });

  return (
    <main className="min-h-screen pb-20 bg-gray-50">

      {/* 4. The Real Hero Section */}
      <Hero settings={settings} />

      {/* 5. The OTT Sliders */}
      <div className="space-y-10 mt-10">
        {ottData.map((section, index) => (
          section.products.length > 0 && (
            <ProductSlider
              key={index}
              title={section.categoryName}
              products={section.products}
            />
          )
        ))}
      </div>
    </main>
  );
}