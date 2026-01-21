'use client';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ShoppingCart, Search, Menu, ArrowLeft, ChevronDown, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useCategories, CategoryWithSubs } from '@/hooks/useCategories';

interface NavbarProps {
    siteName: string;
}

export default function Navbar({ siteName }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { categories, loading } = useCategories();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="sticky top-0 z-50 w-full border-b-2 border-[#f9dc5c] bg-[#fdf8e1]/70 backdrop-blur-xl shadow-lg shadow-[#f9dc5c]/10"
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-10">

                    {/* Left Section: Back Button + Logo */}
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.back()}
                            className="p-2 hover:bg-[#f9dc5c]/30 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#f9dc5c]/30"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-800" />
                        </motion.button>

                        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-[#f9dc5c] transition-colors duration-300">
                            {siteName}
                        </Link>
                    </div>

                    {/* Desktop Categories Navigation */}
                    <div className="hidden md:flex gap-1 text-sm font-medium">
                        <Link
                            href="/products"
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${pathname === '/products' && !searchParams.get('category')
                                ? 'bg-royal-gold text-neutral-900 shadow-md'
                                : 'text-gray-800 hover:bg-[#f9dc5c]/40 hover:text-gray-900'
                                }`}
                        >
                            All Products
                        </Link>

                        {loading ? (
                            <div className="px-4 py-2 text-gray-500">Loading...</div>
                        ) : (
                            categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <Link
                                        href={`/products?category=${category.id}`}
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 group ${(pathname === '/products' && searchParams.get('category') === category.id)
                                                ? 'bg-royal-gold text-neutral-900 shadow-md'
                                                : 'text-gray-800 hover:bg-[#f9dc5c]/40 hover:text-gray-900'
                                            }`}
                                    >
                                        {category.name}
                                        {category.subcategories.length > 0 && (
                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 group-hover:rotate-180 ${(pathname === '/products' && searchParams.get('category') === category.id)
                                                    ? 'text-neutral-900'
                                                    : ''
                                                }`} />
                                        )}
                                    </Link>

                                    {/* Subcategories Dropdown */}
                                    <AnimatePresence>
                                        {hoveredCategory === category.id && category.subcategories.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                                className="absolute top-full left-0 mt-2 min-w-[200px] rounded-xl border-2 border-[#f9dc5c] bg-[#fcefb4]/95 backdrop-blur-xl shadow-xl shadow-[#f9dc5c]/20 overflow-hidden"
                                            >
                                                <div className="py-2">
                                                    {category.subcategories.map((subCategory, subIndex) => (
                                                        <motion.div
                                                            key={subCategory.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: subIndex * 0.05 }}
                                                        >
                                                            <Link
                                                                href={`/products?category=${category.id}&sub=${subCategory.id}`}
                                                                className="block px-4 py-2.5 text-gray-800 hover:bg-[#f9dc5c]/50 hover:text-gray-900 transition-all duration-200 hover:pl-6"
                                                            >
                                                                {subCategory.name}
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Right Section: Icons */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-[#f9dc5c]/30 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#f9dc5c]/30"
                        >
                            <Search className="h-5 w-5 text-gray-800" />
                        </motion.button>

                        <Link href="/cart">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 hover:bg-[#f9dc5c]/30 rounded-full transition-all duration-300 hover:shadow-md hover:shadow-[#f9dc5c]/30"
                            >
                                <ShoppingCart className="h-5 w-5 text-gray-800" />
                            </motion.div>
                        </Link>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 hover:bg-[#f9dc5c]/30 rounded-full transition-all duration-300"
                        >
                            <Menu className="h-5 w-5 text-gray-800" />
                        </motion.button>
                    </div>

                </div>
            </motion.nav>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-80 bg-[#fdf8e1] border-l-2 border-[#f9dc5c] shadow-2xl z-50 md:hidden overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b-2 border-[#f9dc5c] bg-[#fcefb4]/50">
                                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 hover:bg-[#f9dc5c]/30 rounded-full transition-all duration-300"
                                >
                                    <X className="h-6 w-6 text-gray-800" />
                                </motion.button>
                            </div>

                            {/* Navigation Links */}
                            <div className="p-4">
                                {/* Home Link */}
                                <Link
                                    href="/products"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 mb-2 ${pathname === '/products' && !searchParams.get('category')
                                        ? 'bg-royal-gold text-neutral-900'
                                        : 'text-gray-800 hover:bg-[#f9dc5c]/40 hover:text-gray-900'
                                        }`}
                                >
                                    All Products
                                </Link>

                                {/* Categories Accordion */}
                                {loading ? (
                                    <div className="px-4 py-3 text-gray-500">Loading categories...</div>
                                ) : (
                                    <div className="space-y-2">
                                        {categories.map((category, index) => (
                                            <motion.div
                                                key={category.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="rounded-lg border-2 border-[#f9dc5c] bg-white/50 overflow-hidden"
                                            >
                                                {/* Category Header */}
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={`/products?category=${category.id}`}
                                                        onClick={() => setMobileMenuOpen(false)}
                                                        className={`flex-1 px-4 py-3 font-medium transition-all duration-300 ${(pathname === '/products' && searchParams.get('category') === category.id)
                                                                ? 'bg-royal-gold text-neutral-900'
                                                                : 'text-gray-900 hover:bg-[#f9dc5c]/20'
                                                            }`}
                                                    >
                                                        {category.name}
                                                    </Link>

                                                    {category.subcategories.length > 0 && (
                                                        <button
                                                            onClick={() => toggleCategory(category.id)}
                                                            className="px-3 py-3 hover:bg-[#f9dc5c]/20 transition-all duration-300"
                                                        >
                                                            <motion.div
                                                                animate={{ rotate: expandedCategory === category.id ? 90 : 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <ChevronRight className="h-5 w-5 text-gray-700" />
                                                            </motion.div>
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Subcategories */}
                                                <AnimatePresence>
                                                    {expandedCategory === category.id && category.subcategories.length > 0 && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="bg-[#fae588]/20 border-t border-[#f9dc5c]"
                                                        >
                                                            <div className="py-2">
                                                                {category.subcategories.map((subCategory, subIndex) => (
                                                                    <motion.div
                                                                        key={subCategory.id}
                                                                        initial={{ opacity: 0, x: 10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: subIndex * 0.05 }}
                                                                    >
                                                                        <Link
                                                                            href={`/products?category=${category.id}&sub=${subCategory.id}`}
                                                                            onClick={() => setMobileMenuOpen(false)}
                                                                            className="block px-8 py-2.5 text-sm text-gray-700 hover:bg-[#f9dc5c]/30 hover:text-gray-900 transition-all duration-200"
                                                                        >
                                                                            {subCategory.name}
                                                                        </Link>
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}