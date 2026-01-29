import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Ulasan, PaginatorLink } from '@/types';
import { PageProps } from '@/types';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreHorizontal, Eye, EyeOff, Search, Trash2, Zap } from 'lucide-react';
import { route } from 'ziggy-js';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';


//@ts-ignore
type KelolaUlasanProps = PageProps<{
    ulasanList: {
        data: Ulasan[];
        links: PaginatorLink[];
    };
    filters: { search?: string, sentiment?: string, status?: string, sort?: string };
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
    const [sortValue, setSortValue] = useState<string>(typeof filters.sort === 'string' ? filters.sort : 'latest');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [ulasanToDelete, setUlasanToDelete] = useState<Ulasan | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const { delete: destroy, processing } = useForm();
    const isAllSelected = ulasanList.data.length > 0 && selectedIds.length === ulasanList.data.length;

    useEffect(() => {
        if ((filters.search || '') === debouncedSearchValue && (filters.sort || 'latest') === sortValue) return;
        const currentParams = route().params;
        router.get(route('dashboard.ulasan.index'), {
            ...currentParams,
            search: debouncedSearchValue,
            sort: sortValue,
            page: 1
        }, { preserveState: true, replace: true });
    }, [debouncedSearchValue, sortValue]);

    useEffect(() => {
        setSelectedIds([]); // Reset selection on page change or filter change
    }, [ulasanList.data]);

    const handleVisibilityToggle = (ulasan: Ulasan) => {
        const newVisibility = ulasan.visibilitas === 'dipublikasikan' ? 'disembunyikan' : 'dipublikasikan';
        router.patch(route('dashboard.ulasan.update', { ulasan: ulasan.id }), {
            visibilitas: newVisibility,
        }, { preserveScroll: true });
    };

    const openDeleteDialog = (ulasan: Ulasan) => {
        setIsBulkDelete(false);
        setUlasanToDelete(ulasan);
        setDialogOpen(true);
    };

    const openBulkDeleteDialog = () => {
        setIsBulkDelete(true);
        setDialogOpen(true);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(ulasanList.data.map(u => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(item => item !== id));
        }
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
            router.post(route('dashboard.ulasan.bulk-destroy'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setDialogOpen(false);
                    setSelectedIds([]);
                    setIsBulkDelete(false);
                },
                onError: () => {
                    setDialogOpen(false);
                    setIsBulkDelete(false);
                }
            });
            return;
        }

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

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manajemen Ulasan</h1>
                    <p className="mt-1 text-muted-foreground">Cari, filter, dan moderasi semua ulasan yang masuk ke sistem.</p>
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <Button variant="destructive" onClick={openBulkDeleteDialog}>
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus ({selectedIds.length})
                        </Button>
                    )}
                    <Select value={sortValue} onValueChange={setSortValue}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="latest">Terbaru</SelectItem>
                            <SelectItem value="oldest">Terlama</SelectItem>
                            <SelectItem value="sentiment_desc">Skor Tertinggi</SelectItem>
                            <SelectItem value="sentiment_asc">Skor Terendah</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={() => router.post(route('dashboard.ulasan.analyze'))}>
                        <Zap className="mr-2 h-4 w-4" /> Analisis
                    </Button>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
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
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                        />
                                    </TableHead>
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
                                            <Checkbox
                                                checked={selectedIds.includes(ulasan.id)}
                                                onCheckedChange={(checked) => handleSelectOne(ulasan.id, !!checked)}
                                            />
                                        </TableCell>
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
                                        <TableCell colSpan={6} className="h-24 text-center">
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
                            {isBulkDelete
                                ? `Tindakan ini akan menghapus ${selectedIds.length} ulasan yang dipilih secara permanen dari server.`
                                : "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data ulasan secara permanen dari server."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setUlasanToDelete(null); setIsBulkDelete(false); }}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
