'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpandableDescriptionProps {
    description: string;
}

export default function ExpandableDescription({ description }: ExpandableDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // If description is short, don't show expand button
    const isLongDescription = description && description.length > 300;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 uppercase tracking-wider border-b border-vanilla-custard pb-2">Description</h3>

            <div className="relative">
                <motion.div
                    initial={false}
                    animate={{ height: !isLongDescription || isExpanded ? 'auto' : '150px' }}
                    className="overflow-hidden prose prose-neutral max-w-none prose-p:text-neutral-600 prose-headings:text-neutral-900 prose-headings:font-playfair prose-headings:uppercase prose-li:text-neutral-600"
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <ReactMarkdown>
                        {description || "No description available for this premium product."}
                    </ReactMarkdown>
                </motion.div>

                {isLongDescription && !isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 via-white/40 to-transparent pointer-events-none" />
                )}
            </div>

            {isLongDescription && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 text-royal-gold font-bold uppercase tracking-widest text-sm hover:translate-x-1 transition-transform group"
                >
                    {isExpanded ? (
                        <>See Less <ChevronUp size={16} className="group-hover:-translate-y-1 transition-transform" /></>
                    ) : (
                        <>See Full Description <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" /></>
                    )}
                </button>
            )}
        </div>
    );
}
