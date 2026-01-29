import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { TargetUlasan, PaginatorLink } from '@/types';
import { PageProps } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { MoreHorizontal, PlusCircle, ToggleLeft, ToggleRight, Edit, Search, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { TargetForm } from '@/components/dashboard/TargetForm';
import { useDebounce } from 'use-debounce';

//@ts-ignore
type KelolaTargetProps = PageProps<{
    targetList: {
        data: TargetUlasan[];
        links: PaginatorLink[];
    };
    filters: { search?: string, tipe?: string, sort?: string };
}>;

const KelolaTargetBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Kelola Target</BreadcrumbPage></BreadcrumbItem>
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

export default function KelolaTarget({ targetList, filters }: KelolaTargetProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTarget, setEditingTarget] = useState<TargetUlasan | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [debouncedSearchValue] = useDebounce(searchValue, 300);
    const [sortValue, setSortValue] = useState<string>(typeof filters.sort === 'string' ? filters.sort : 'latest');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkDelete, setIsBulkDelete] = useState(false);
    const [targetToDelete, setTargetToDelete] = useState<TargetUlasan | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const { delete: destroy, processing } = useForm();
    const isAllSelected = targetList.data.length > 0 && selectedIds.length === targetList.data.length;

    useEffect(() => {
        if ((filters.search || '') === debouncedSearchValue && (filters.sort || 'latest') === sortValue) return;
        const currentParams = route().params;
        router.get(route('dashboard.target.index'), {
            ...currentParams,
            search: debouncedSearchValue,
            sort: sortValue,
            page: 1
        }, { preserveState: true, replace: true });
    }, [debouncedSearchValue, sortValue]);

    useEffect(() => {
        setSelectedIds([]);
    }, [targetList.data]);

    const openCreateDialog = () => {
        setEditingTarget(null);
        setDialogOpen(true);
    };

    const openEditDialog = (target: TargetUlasan) => {
        setEditingTarget(target);
        setDialogOpen(true);
    };

    const handleToggleActive = (target: TargetUlasan) => {
        router.patch(route('dashboard.target.update', { target: target.id }), {
            is_active: !target.is_active,
        }, { preserveScroll: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(targetList.data.map(t => t.id));
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

    const openDeleteDialog = (target: TargetUlasan) => {
        setIsBulkDelete(false);
        setTargetToDelete(target);
        setConfirmDialogOpen(true);
    };

    const openBulkDeleteDialog = () => {
        setIsBulkDelete(true);
        setConfirmDialogOpen(true);
    };

    const confirmDelete = () => {
        if (isBulkDelete) {
            router.post(route('dashboard.target.bulk-destroy'), { ids: selectedIds }, {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmDialogOpen(false);
                    setSelectedIds([]);
                    setIsBulkDelete(false);
                },
                onError: () => {
                    setConfirmDialogOpen(false);
                    setIsBulkDelete(false);
                }
            });
            return;
        }

        if (!targetToDelete) return;

        destroy(route('dashboard.target.destroy', { target: targetToDelete.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setConfirmDialogOpen(false);
                setTargetToDelete(null);
            },
            onError: () => {
                setConfirmDialogOpen(false);
                setTargetToDelete(null);
            },
        });
    };


    return (
        <DashboardLayout breadcrumbs={<KelolaTargetBreadcrumb />}>
            <Head title="Kelola Target" />

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manajemen Target Ulasan</h1>
                    <p className="mt-1 text-muted-foreground">Tambah, ubah, dan kelola semua pegawai atau divisi yang dapat diulas.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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
                            <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                            <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreateDialog}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Target
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingTarget ? 'Edit Target Ulasan' : 'Tambah Target Ulasan Baru'}</DialogTitle>
                            </DialogHeader>
                            <TargetForm target={editingTarget} onSuccess={() => setDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Cari berdasarkan nama atau deskripsi..."
                                className="pl-10"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
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
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {targetList.data.length > 0 ? targetList.data.map((target: TargetUlasan) => (
                                    <TableRow key={target.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(target.id)}
                                                onCheckedChange={(checked) => handleSelectOne(target.id, !!checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{target.nama}</div>
                                            <div className="text-sm text-muted-foreground">{target.deskripsi}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={target.tipe === 'PEGAWAI' ? 'default' : 'secondary'}>{target.tipe}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={target.is_active ? 'outline' : 'destructive'}>
                                                {target.is_active ? 'Aktif' : 'Tidak Aktif'}
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(target)} className="cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleActive(target)} className="cursor-pointer">
                                                        {target.is_active ? <><ToggleLeft className="mr-2 h-4 w-4" /> Nonaktifkan</> : <><ToggleRight className="mr-2 h-4 w-4" /> Aktifkan</>}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(target)}
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus Target
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Tidak ada target yang ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination links={targetList.links} />
                </CardContent>
            </Card>

            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isBulkDelete
                                ? `Tindakan ini akan menghapus ${selectedIds.length} target yang dipilih secara permanen.`
                                : "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus target secara permanen."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setTargetToDelete(null); setIsBulkDelete(false); }}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
