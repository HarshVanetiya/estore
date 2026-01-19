'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SubCategory {
    id: string;
    name: string;
    category_id: string;
}

export interface CategoryWithSubs {
    id: string;
    name: string;
    image_url: string | null;
    subcategories: SubCategory[];
}

export function useCategories() {
    const [categories, setCategories] = useState<CategoryWithSubs[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                setLoading(true);

                // Fetch all categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('*')
                    .order('name');

                if (categoriesError) throw categoriesError;

                // Fetch all subcategories
                const { data: subCategoriesData, error: subCategoriesError } = await supabase
                    .from('sub_categories')
                    .select('*')
                    .order('name');

                if (subCategoriesError) throw subCategoriesError;

                // Combine categories with their subcategories
                const categoriesWithSubs: CategoryWithSubs[] = (categoriesData || []).map(category => ({
                    ...category,
                    subcategories: (subCategoriesData || []).filter(sub => sub.category_id === category.id)
                }));

                setCategories(categoriesWithSubs);
                setError(null);
            } catch (err) {
                setError(err as Error);
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
