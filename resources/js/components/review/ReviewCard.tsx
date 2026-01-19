import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, UserRound, Building, Calendar, Quote } from 'lucide-react';
import { Ulasan } from '@/types';
import { cn } from '@/lib/utils';

const StarRatingDisplay = ({ rating }: { rating: number | null }) => {
    if (rating === null) return null;
    return (
        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-full border border-amber-100/50 w-fit">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    size={14}
                    className={cn(
                        "transition-all",
                        index < rating
                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.5)]"
                            : "fill-slate-100 text-slate-200"
                    )}
                />
            ))}
        </div>
    );
};

export function ReviewCard({ ulasan }: { ulasan: Ulasan }) {
    const formatTanggal = (tanggal: string) => new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const userName = ulasan.user ? ulasan.user.name : 'Pengguna Dihapus';
    const userAvatar = ulasan.user ? ulasan.user.avatar : null;
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <Card className="group relative flex flex-col h-full bg-white border-slate-100/80 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden">
            {/* Decorative Top Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Quote size={80} className="text-emerald-800/20 fill-emerald-800 rotate-180" />
            </div>

            <CardHeader className="flex flex-row items-center gap-4 pb-2 relative z-10">
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]" />
                    <Avatar className="h-12 w-12 border-2 border-white text-emerald-900 ring-1 ring-slate-100 relative">
                        <AvatarImage src={userAvatar || undefined} alt={userName} className="object-cover" />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">
                            {userInitial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-grow min-w-0">
                    <h3 className="text-base font-bold text-slate-800 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                        {userName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Calendar size={12} className="text-slate-300" />
                        <span>{formatTanggal(ulasan.created_at)}</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-grow pb-4 relative z-10 space-y-3">
                <StarRatingDisplay rating={ulasan.rating} />

                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium line-clamp-4 group-hover:text-slate-700 transition-colors">
                    "{ulasan.konten}"
                </p>
            </CardContent>

            <CardFooter className="pt-2 pb-6 relative z-10">
                <div className="w-full flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Ulasan Untuk
                    </div>

                    {ulasan.target_ulasan.tipe === 'PEGAWAI' ? (
                        <div className="inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-full bg-blue-50/50 border border-blue-100/50 text-blue-700 text-xs font-semibold group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                            <span className="bg-blue-100 p-1 rounded-full">
                                <UserRound size={12} />
                            </span>
                            <span className="truncate max-w-[120px]">{ulasan.target_ulasan.nama}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 text-xs font-semibold group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                            <span className="bg-emerald-100 p-1 rounded-full">
                                <Building size={12} />
                            </span>
                            <span className="truncate max-w-[120px]">{ulasan.target_ulasan.nama}</span>
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}