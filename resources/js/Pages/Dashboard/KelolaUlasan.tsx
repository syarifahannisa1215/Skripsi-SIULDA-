import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Ulasan, PaginatorLink } from '@/types';
import { PageProps } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, EyeOff, Search, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';


//@ts-ignore
type KelolaUlasanProps = PageProps<{
    ulasanList: {
        data: Ulasan[];
        links: PaginatorLink[];
    };
    filters: { search?: string, sentiment?: string, status?: string };
}>;

const KelolaUlasanBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Kelola Ulasan</BreadcrumbPage></BreadcrumbItem>
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

export default function KelolaUlasan({ ulasanList, filters }: KelolaUlasanProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [debouncedSearchValue] = useDebounce(searchValue, 300);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ulasanToDelete, setUlasanToDelete] = useState<Ulasan | null>(null);

    const { delete: destroy, processing } = useForm();

    useEffect(() => {
        const currentParams = route().params;
        router.get(route('dashboard.ulasan.index'), { ...currentParams, search: debouncedSearchValue, page: 1 }, { preserveState: true, replace: true });
    }, [debouncedSearchValue]);

    const handleVisibilityToggle = (ulasan: Ulasan) => {
        const newVisibility = ulasan.visibilitas === 'dipublikasikan' ? 'disembunyikan' : 'dipublikasikan';
        router.patch(route('dashboard.ulasan.update', { ulasan: ulasan.id }), {
            visibilitas: newVisibility,
        }, { preserveScroll: true });
    };

    const openDeleteDialog = (ulasan: Ulasan) => {
        setUlasanToDelete(ulasan);
        setDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!ulasanToDelete) return;

        destroy(route('dashboard.ulasan.destroy', { ulasan: ulasanToDelete.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
                setUlasanToDelete(null);
            },
            onError: () => {
                setDialogOpen(false);
                setUlasanToDelete(null);
            },
        });
    };

    return (
        <DashboardLayout breadcrumbs={<KelolaUlasanBreadcrumb />}>
            <Head title="Kelola Ulasan" />

            <Card>
                <CardHeader>
                    <CardTitle>Manajemen Ulasan</CardTitle>
                    <CardDescription>Cari, filter, dan moderasi semua ulasan yang masuk ke sistem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Cari berdasarkan konten, user, atau target..."
                                className="pl-10"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[250px]">Pengulas</TableHead>
                                    <TableHead>Ulasan</TableHead>
                                    <TableHead className="text-center">Sentimen</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ulasanList.data.length > 0 ? ulasanList.data.map((ulasan: Ulasan) => (
                                    <TableRow key={ulasan.id}>
                                        <TableCell>
                                            <div className="font-medium">{ulasan.user?.name || 'User Dihapus'}</div>
                                            <div className="text-sm text-muted-foreground">{ulasan.user?.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium truncate max-w-md">{ulasan.konten}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Target: {ulasan.target_ulasan.nama}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {ulasan.sentimen_prediksi && (
                                                <Badge variant={
                                                    ulasan.sentimen_prediksi === 'positif' ? 'default' :
                                                        ulasan.sentimen_prediksi === 'negatif' ? 'destructive' : 'secondary'
                                                } className="capitalize">
                                                    {ulasan.sentimen_prediksi}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={ulasan.visibilitas === 'dipublikasikan' ? 'outline' : 'destructive'}>
                                                {ulasan.visibilitas}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Buka menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleVisibilityToggle(ulasan)} className="cursor-pointer">
                                                        {ulasan.visibilitas === 'dipublikasikan' ?
                                                            <><EyeOff className="mr-2 h-4 w-4" /> Sembunyikan</> :
                                                            <><Eye className="mr-2 h-4 w-4" /> Publikasikan</>
                                                        }
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(ulasan)}
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Ulasan
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Tidak ada hasil yang cocok dengan pencarian Anda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <TablePagination links={ulasanList.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data ulasan secara permanen dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUlasanToDelete(null)}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
