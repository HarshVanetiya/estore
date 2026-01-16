import Link from 'next/link';
import { ShoppingCart, Search, Menu } from 'lucide-react';

interface NavbarProps {
    siteName: string;
}

export default function Navbar({ siteName }: NavbarProps) {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-10">

                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tight">
                    {siteName}
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <Link href="/" className="hover:text-black transition">Home</Link>
                    <Link href="/category/Electronics" className="hover:text-black transition">Electronics</Link>
                    <Link href="/category/Clothing" className="hover:text-black transition">Clothing</Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <Search className="h-5 w-5" />
                    </button>

                    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
                        <ShoppingCart className="h-5 w-5" />
                    </Link>

                    <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

            </div>
        </nav>
    );
}