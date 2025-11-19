import React, { useState, FormEventHandler, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, Send, CheckCircle, User, Building, MessageSquare, Search, X, ThumbsUp } from 'lucide-react';
import { route } from 'ziggy-js';
import { TargetUlasan } from '@/types';
import { cn } from '@/lib/utils';

export function ReviewForm({ targets }: { targets?: TargetUlasan[] }) {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        target_ulasan_id: '',
        rating: 0,
        konten: '',
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<TargetUlasan | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [formProgress, setFormProgress] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredTargets = targets?.filter(target => 
        target.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        target.tipe.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    useEffect(() => {
        let progress = 0;
        if (data.target_ulasan_id) progress += 33;
        if (data.rating > 0) progress += 33;
        if (data.konten.length >= 10) progress += 34;
        setFormProgress(progress);
    }, [data]);

    useEffect(() => {
        setCharCount(data.konten.length);
    }, [data.konten]);

    const handleSelectTarget = (target: TargetUlasan) => {
        setSelectedTarget(target);
        setData('target_ulasan_id', String(target.id));
        setSearchQuery(target.nama);
        setShowDropdown(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowDropdown(true);
        if (!e.target.value) {
            setSelectedTarget(null);
            setData('target_ulasan_id', '');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('ulasan.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSearchQuery('');
                setSelectedTarget(null);
                setCharCount(0);
            }
        });
    };

    if (!targets || targets.length === 0) {
        return (
            <Card className="w-full max-w-3xl mx-auto shadow-lg">
                <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-gray-400" size={28} />
                    </div>
                    <CardTitle className="text-xl mb-2">Tidak Ada Target Ulasan</CardTitle>
                    <CardDescription>
                        Maaf, saat ini tidak ada pegawai atau divisi yang dapat diulas.
                    </CardDescription>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-xl mx-auto shadow-lg overflow-hidden">
            <div className="h-1 bg-gray-100">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${formProgress}%` }}
                />
            </div>

            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="text-emerald-600" size={24} />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Berikan Ulasan Anda</CardTitle>
                <CardDescription className="pt-1 text-sm">
                    Umpan balik Anda sangat berarti untuk perbaikan layanan kami.
                </CardDescription>
                
                {recentlySuccessful && (
                    <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded flex items-center gap-2 text-emerald-700">
                        <CheckCircle size={14} />
                        <span className="text-xs font-medium">Ulasan Anda berhasil dikirim!</span>
                    </div>
                )}
            </CardHeader>

            <CardContent className="px-6 pb-4">
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="target" className="text-sm font-medium flex items-center gap-2">
                            Pilih Target Ulasan
                            <Badge variant="outline" className="text-xs">Wajib</Badge>
                        </Label>
                        <div ref={dropdownRef} className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    id="target"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Cari pegawai atau divisi..."
                                    className={cn(
                                        "h-10 text-sm pl-9 pr-9",
                                        errors.target_ulasan_id && "border-red-500 focus:border-red-500"
                                    )}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedTarget(null);
                                            setData('target_ulasan_id', '');
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                            
                            {/* Dropdown Results */}
                            {showDropdown && searchQuery && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                                    {filteredTargets.length > 0 ? (
                                        filteredTargets.map(target => (
                                            <button
                                                key={target.id}
                                                type="button"
                                                onClick={() => handleSelectTarget(target)}
                                                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
                                            >
                                                {target.tipe === 'PEGAWAI' ? (
                                                    <User size={14} className="text-blue-500" />
                                                ) : (
                                                    <Building size={14} className="text-emerald-500" />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm">{target.nama}</div>
                                                    <div className="text-xs text-gray-500">{target.tipe}</div>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {target.tipe}
                                                </Badge>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-gray-500 text-sm">
                                            Tidak ada hasil untuk "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {errors.target_ulasan_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.target_ulasan_id}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                            Rating Anda
                            <Badge variant="outline" className="text-xs">Opsional</Badge>
                        </Label>
                        <div className="flex items-center justify-center gap-1 py-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                
                                return (
                                    <Star
                                        key={index}
                                        size={28}
                                        className={cn(
                                            "cursor-pointer transition-colors duration-200",
                                            ratingValue <= data.rating 
                                                ? "text-amber-400" 
                                                : "text-gray-300 hover:text-amber-200"
                                        )}
                                        onClick={() => setData('rating', ratingValue)}
                                        fill={ratingValue <= data.rating ? 'currentColor' : 'none'}
                                    />
                                );
                            })}
                        </div>
                        {data.rating > 0 && (
                            <div className="text-center">
                                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-xs">
                                    <ThumbsUp size={12} className="mr-1" />
                                    Anda memberikan rating {data.rating} bintang
                                </Badge>
                            </div>
                        )}
                        {errors.rating && (
                            <p className="text-xs text-red-600 mt-1">{errors.rating}</p>
                        )}
                    </div>

                    {/* Review Content */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="konten" className="text-sm font-medium flex items-center gap-2">
                                Tulis Ulasan Anda
                                <Badge variant="outline" className="text-xs">Wajib</Badge>
                            </Label>
                            <span className={cn(
                                "text-xs",
                                charCount > 500 ? "text-red-500" : 
                                charCount > 400 ? "text-amber-500" : 
                                "text-gray-500"
                            )}>
                                {charCount}/500
                            </span>
                        </div>
                        <textarea
                            id="konten"
                            value={data.konten}
                            onChange={(e) => setData('konten', e.target.value)}
                            rows={3}
                            placeholder="Bagikan pengalaman Anda secara detail..."
                            className={cn(
                                "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm",
                                errors.konten && "border-red-500 focus:border-red-500"
                            )}
                        />
                        <div className="flex justify-between items-center">
                            {errors.konten && (
                                <p className="text-xs text-red-600">{errors.konten}</p>
                            )}
                            {charCount < 10 && data.konten.length > 0 && (
                                <p className="text-xs text-amber-600">
                                    Minimal 10 karakter untuk mengirim ulasan
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <Button 
                            type="submit" 
                            disabled={processing || data.konten.length < 10 || !data.target_ulasan_id}
                            className="px-6 py-2 text-sm h-9"
                        >
                            {processing ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Mengirim...
                                </>
                            ) : (
                                <>
                                    <Send size={14} className="mr-2" />
                                    Kirim Ulasan
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}