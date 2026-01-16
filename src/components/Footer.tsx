import { Database } from '@/types/database.types';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react'; // 1. Import Icons

type Settings = Database['public']['Tables']['company_settings']['Row'];

export default function Footer({ settings }: { settings: Settings | null }) {
    const year = new Date().getFullYear();
    const name = settings?.site_name || "My Store";

    return (
        <footer className="bg-black text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-wider uppercase">{name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Premium products for the modern lifestyle. Quality guaranteed.
                    </p>
                    <div className="flex gap-4 pt-2">
                        {/* Social Icons (Placeholders) */}
                        <a href="#" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
                    </div>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="font-semibold mb-4 text-gray-200">Shop</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition">All Products</a></li>
                        <li><a href="#" className="hover:text-white transition">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-white transition">Featured</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                        <li><a href="#" className="hover:text-white transition">Returns</a></li>
                        <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                    </ul>
                </div>

                {/* Contact Info (No Emojis!) */}
                <div>
                    <h4 className="font-semibold mb-4 text-gray-200">Contact Us</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {settings?.address && (
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-gray-500" />
                                <span className="leading-tight">{settings.address}</span>
                            </li>
                        )}
                        {settings?.contact_phone && (
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-gray-500" />
                                <span>{settings.contact_phone}</span>
                            </li>
                        )}
                        {settings?.contact_email && (
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 shrink-0 text-gray-500" />
                                <span>{settings.contact_email}</span>
                            </li>
                        )}
                    </ul>
                </div>

            </div>

            <div className="container mx-auto px-4 md:px-10 mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs uppercase tracking-wide">
                &copy; {year} {name}. All rights reserved.
            </div>
        </footer>
    );
}