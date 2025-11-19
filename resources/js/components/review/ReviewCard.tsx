import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, UserRound, Building, Calendar } from 'lucide-react';
import { Ulasan } from '@/types';

const StarRatingDisplay = ({ rating }: { rating: number | null }) => {
    if (rating === null) return null;
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
                <Star key={index} size={18} className={index < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
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
        <Card className="flex flex-col h-full hover:border-emerald-500 transition-colors">
            <CardHeader className="flex flex-row items-start gap-4">
                <Avatar>
                    <AvatarImage src={userAvatar || undefined} alt={userName} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <CardTitle className="text-lg">{userName}</CardTitle>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <Calendar size={14} />
                        <span>{formatTanggal(ulasan.created_at)}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <StarRatingDisplay rating={ulasan.rating} />
                <p className="text-gray-700 leading-relaxed mt-3">{ulasan.konten}</p>
            </CardContent>
            <CardFooter>
                <div className="flex items-center gap-2">
                    {ulasan.target_ulasan.tipe === 'PEGAWAI' ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                            <UserRound size={14} />
                            <span>{ulasan.target_ulasan.nama}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium">
                            <Building size={14} />
                            <span>{ulasan.target_ulasan.nama}</span>
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}