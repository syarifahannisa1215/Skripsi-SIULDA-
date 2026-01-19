import React from 'react';
import { Link } from '@inertiajs/react';
import { Search, MessageSquare, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Ulasan, PaginatorLink } from '@/types';
import { Input } from '@/components/ui/input';
import { ReviewCard } from '@/components/review/ReviewCard';
import { cn } from '@/lib/utils';

interface ReviewSectionProps {
    ulasan: { data: Ulasan[]; links: PaginatorLink[]; };
}

const Pagination = ({ links }: { links: PaginatorLink[] }) => {
    return (
        <div className="flex justify-center items-center mt-12">
            <div className="inline-flex items-center gap-1.5 bg-white p-2 rounded-full shadow-sm border border-slate-200/60">
                {links.map((link, index) => {
                    const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                    const label = isPrev ? <ChevronLeft size={16} /> : isNext ? <ChevronRight size={16} /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />;

                    if (!link.url) {
                        return (
                            <span
                                key={index}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-300 pointer-events-none text-sm"
                            >
                                {label}
                            </span>
                        );
                    }
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={cn(
                                "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                                link.active
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 transform scale-105"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700 hover:scale-105"
                            )}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-16 text-center max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
                <Inbox className="text-slate-300" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Belum Ada Ulasan</h3>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                Jadilah yang pertama memberikan aspirasi dan penilaian untuk kemajuan layanan kami.
            </p>
        </div>
    </div>
);

export function ReviewSection({ ulasan }: ReviewSectionProps) {
    return (
        <section id="ulasan" className="relative py-24 bg-emerald-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                            <MessageSquare className="w-3 h-3" />
                            Suara Masyarakat
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                            Transparansi Publik
                        </h2>
                        <p className="text-slate-500 max-w-md text-sm md:text-base leading-relaxed">
                            Menampilkan ulasan otentik sebagai komitmen kami terhadap peningkatan mutu pelayanan.
                        </p>
                    </div>

                    <div className="w-full md:w-auto flex-shrink-0">
                        <div className="relative group w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Cari ulasan..."
                                className="pl-11 pr-4 h-12 rounded-full border-slate-200 bg-white shadow-sm hover:shadow-md focus:shadow-md focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 w-full"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </div>
                </div>

                {ulasan.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ulasan.data.map((item: Ulasan) => (
                            <div key={item.id} className="h-full">
                                <ReviewCard ulasan={item} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}

                {ulasan.links.length > 3 && (
                    <div className="mt-8">
                        <Pagination links={ulasan.links} />
                    </div>
                )}
            </div>
        </section>
    );
}
