import Link from 'next/link';
import { Database } from '@/types/database.types';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react'; // 1. Import Icons

type Settings = Database['public']['Tables']['company_settings']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export default function Footer({ settings, categories }: { settings: Settings | null, categories: Category[] }) {
    const year = new Date().getFullYear();
    const name = settings?.site_name || "My Store";

    return (
        <footer className="bg-neutral-950 text-cornsilk py-16 border-t-2 border-royal-gold/30">
            <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand Section */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold tracking-widest uppercase text-gold-gradient font-serif">
                        {name}
                    </h3>
                    <p className="text-cornsilk/80 text-sm leading-relaxed max-w-xs">
                        Elevating your lifestyle with premium essentials. Excellence in every detail, quality guaranteed.
                    </p>
                    <div className="flex gap-5 pt-2">
                        {settings?.facebook_url && (
                            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-royal-gold/60 hover:text-royal-gold transition-all duration-300 transform hover:scale-110">
                                <Facebook size={22} />
                            </a>
                        )}
                        {settings?.twitter_url && (
                            <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-royal-gold/60 hover:text-royal-gold transition-all duration-300 transform hover:scale-110">
                                <Twitter size={22} />
                            </a>
                        )}
                        {settings?.instagram_url && (
                            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-royal-gold/60 hover:text-royal-gold transition-all duration-300 transform hover:scale-110">
                                <Instagram size={22} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="font-semibold mb-6 !text-royal-gold uppercase tracking-wider text-sm">Shop</h4>
                    <ul className="space-y-3 text-cornsilk/60 text-sm">
                        <li>
                            <Link href="/products" className="hover:text-royal-gold hover:pl-1 transition-all">
                                All Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/sale" className="text-royal-gold font-bold hover:pl-1 transition-all flex items-center gap-2 group/sale">
                                <span className="w-1.5 h-1.5 bg-royal-gold rounded-full group-hover/sale:scale-150 transition-all duration-300 shadow-[0_0_8px_rgba(249,220,92,0.8)]" />
                                Products on Sale
                            </Link>
                        </li>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    href={`/products?category=${category.id}`}
                                    className="hover:text-royal-gold hover:pl-1 transition-all capitalize"
                                >
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="font-semibold mb-6 !text-royal-gold uppercase tracking-wider text-sm">Support</h4>
                    <ul className="space-y-3 text-cornsilk/60 text-sm">
                        <li><a href="#" className="hover:text-royal-gold hover:pl-1 transition-all">Track Order</a></li>
                        <li><a href="#" className="hover:text-royal-gold hover:pl-1 transition-all">Returns</a></li>
                        <li><a href="#" className="hover:text-royal-gold hover:pl-1 transition-all">FAQ</a></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="font-semibold mb-6 !text-royal-gold uppercase tracking-wider text-sm">Contact Us</h4>
                    <ul className="space-y-5 text-cornsilk/60 text-sm">
                        {settings?.address && (
                            <li className="flex items-start gap-3 group">
                                <MapPin className="h-5 w-5 shrink-0 text-royal-gold/70 group-hover:text-royal-gold transition-colors" />
                                <span className="leading-tight group-hover:text-cornsilk transition-colors">{settings.address}</span>
                            </li>
                        )}
                        {settings?.contact_phone && (
                            <li className="flex items-center gap-3 group">
                                <Phone className="h-5 w-5 shrink-0 text-royal-gold/70 group-hover:text-royal-gold transition-colors" />
                                <span className="group-hover:text-cornsilk transition-colors">{settings.contact_phone}</span>
                            </li>
                        )}
                        {settings?.contact_email && (
                            <li className="flex items-center gap-3 group">
                                <Mail className="h-5 w-5 shrink-0 text-royal-gold/70 group-hover:text-royal-gold transition-colors" />
                                <span className="group-hover:text-cornsilk transition-colors">{settings.contact_email}</span>
                            </li>
                        )}
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-4 md:px-10 mt-16 pt-8 border-t border-royal-gold/10 text-center">
                <p className="text-royal-gold/40 text-[10px] uppercase tracking-[0.2em] font-medium">
                    &copy; {year} {name}. All rights reserved. Crafted with excellence.
                </p>
            </div>
        </footer>
    );
}