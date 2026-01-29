import { Head, Link, router, usePage } from '@inertiajs/react';
import React from 'react';
import { Ulasan, PaginatorLink, PageProps } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ThumbsUp, ThumbsDown, CircleMinus, Check, MessageSquare } from 'lucide-react';
import { route } from 'ziggy-js';

type VerifikasiProps = PageProps<{
    ulasanList: {
        data: Ulasan[];
        links: PaginatorLink[];
    };
}>;

const VerifikasiBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Verifikasi Sentimen</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
);

const TablePagination = ({ links }: { links: PaginatorLink[] }) => {
    if (links.length <= 3) return null;
    return (
        <Pagination className="mt-6">
            <PaginationContent>
                {links.map((link, index) => {
                    if (link.label.includes('Previous')) return <PaginationItem key="prev"><PaginationPrevious href={link.url ?? '#'} /></PaginationItem>;
                    if (link.label.includes('Next')) return <PaginationItem key="next"><PaginationNext href={link.url ?? '#'} /></PaginationItem>;
                    if (link.label === '...') return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                    return (
                        <PaginationItem key={link.label}>
                            <PaginationLink href={link.url ?? '#'} isActive={link.active}>
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
};

export default function VerifikasiUlasan({ ulasanList }: VerifikasiProps) {

    const handleVerification = (ulasan: Ulasan, sentiment: 'positif' | 'negatif' | 'netral') => {
        router.patch(route('dashboard.ulasan.doVerifikasi', { ulasan: ulasan.id }), {
            sentiment: sentiment,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout breadcrumbs={<VerifikasiBreadcrumb />}>
            <Head title="Verifikasi Sentimen" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Verifikasi Sentimen</h1>
                <p className="mt-1 text-muted-foreground">Bantu AI menjadi lebih pintar dengan memvalidasi prediksinya. Ulasan dengan keyakinan terendah muncul di atas.</p>
            </header>

            <Card>
                <CardContent className="p-6">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[45%]">Ulasan</TableHead>
                                    <TableHead className="text-center w-[25%]">Prediksi AI</TableHead>
                                    <TableHead className="text-center w-[30%]">Aksi Verifikasi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ulasanList.data.length > 0 ? ulasanList.data.map((ulasan: Ulasan) => {
                                    const sentimentColor = ulasan.sentimen_prediksi === 'positif' ? 'default' : ulasan.sentimen_prediksi === 'negatif' ? 'destructive' : 'secondary';

                                    return (
                                        <TableRow key={ulasan.id}>
                                            <TableCell>
                                                <p className="font-medium line-clamp-2">{ulasan.konten}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Oleh: {ulasan.user?.name || 'User Dihapus'} pada <span className="font-medium">{ulasan.target_ulasan.nama}</span>
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {ulasan.sentimen_prediksi && (
                                                    <div className="flex flex-col items-center">
                                                        <Badge variant={sentimentColor} className="capitalize">{ulasan.sentimen_prediksi}</Badge>
                                                        <span className="text-xs text-muted-foreground mt-1">
                                                            Score: {`(${(ulasan.skor_sentimen * 100).toFixed(0)}%)`}
                                                        </span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            Verifikasi <MoreHorizontal className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleVerification(ulasan, 'positif')} className="cursor-pointer text-emerald-600 focus:text-emerald-700">
                                                            <ThumbsUp className="mr-2 h-4 w-4" /> Setujui sebagai Positif
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleVerification(ulasan, 'negatif')} className="cursor-pointer text-red-600 focus:text-red-700">
                                                            <ThumbsDown className="mr-2 h-4 w-4" /> Ubah ke Negatif
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleVerification(ulasan, 'netral')} className="cursor-pointer">
                                                            <CircleMinus className="mr-2 h-4 w-4" /> Ubah ke Netral
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                    <Check size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold">Semua Sudah Diverifikasi!</p>
                                                    <p className="text-sm text-muted-foreground">Tidak ada ulasan baru yang memerlukan verifikasi.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <TablePagination links={ulasanList.links} />

                </CardContent>
            </Card>
        </DashboardLayout>
    );
}