// resources/js/Pages/Landing.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';
import { Award, ChevronDown, BookOpen, Search, MessageSquare } from 'lucide-react';
import { route } from 'ziggy-js';
import { Ulasan, PaginatorLink, TargetUlasan } from '@/types';
import { PageProps } from '@inertiajs/react';
import { toast } from "sonner";

import { Navigation } from '@/components/nav/Navigation';
import { ReviewCard } from '@/components/review/ReviewCard';
import { ReviewForm } from '@/components/review/ReviewForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LandingProps = PageProps<{
    ulasan: { data: Ulasan[]; links: PaginatorLink[]; };
    targetUlasanList?: TargetUlasan[];
}>;

const Pagination = ({ links }: { links: PaginatorLink[] }) => {
    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span 
                            key={index} 
                            className="px-3 py-2 text-gray-500" 
                            dangerouslySetInnerHTML={{ __html: link.label }} 
                        />
                    );
                }
                return (
                    <Link 
                        key={index} 
                        href={link.url} 
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            link.active 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`} 
                        dangerouslySetInnerHTML={{ __html: link.label }} 
                    />
                );
            })}
        </div>
    );
};

const EmptyState = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Ulasan</h3>
        <p className="text-gray-600">Jadilah yang pertama memberikan ulasan!</p>
    </div>
);

export default function Landing({ ulasan, targetUlasanList }: LandingProps) {
    const { auth, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    return (
        <>
            <Head title="Ulasan Publik - Dinas Pendidikan Dayah Aceh" />
            <Navigation />
            
            <main className="bg-gray-50 min-h-screen">
                <section className="h-screen min-h-[700px] flex items-center justify-center relative bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        {auth.user ? (
                            <ReviewForm targets={targetUlasanList} />
                        ) : (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Award className="text-white" size={32} />
                                    </div>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-6">
                                    Berikan Umpan Balik Anda
                                </h1>
                                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                                    Dinas Pendidikan Dayah Aceh berkomitmen untuk transparansi. Masuk untuk membagikan pengalaman dan membantu kami menjadi lebih baik.
                                </p>
                                <Button asChild size="lg">
                                    <a href={route('google.auth')}>Masuk untuk Memberi Ulasan</a>
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                        <a href="#ulasan" aria-label="Scroll ke bagian ulasan">
                           <ChevronDown className="text-gray-500" size={32} />
                        </a>
                    </div>
                </section>

                <section id="ulasan" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Semua Ulasan</h2>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input type="text" placeholder="Cari ulasan..." className="pl-10" />
                        </div>
                    </div>

                    {ulasan.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ulasan.data.map((item) => <ReviewCard key={item.id} ulasan={item} />)}
                        </div>
                    ) : (
                        <EmptyState />
                    )}

                    {ulasan.links.length > 3 && <Pagination links={ulasan.links} />}
                </section>

                <footer className="bg-white border-t border-gray-200 mt-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-500">
                                © 2025 Dinas Pendidikan Dayah Aceh. Semua hak dilindungi.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Tentang</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Kebutan Privasi</a>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Bantuan</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
}