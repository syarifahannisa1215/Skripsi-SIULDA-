import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { TargetUlasan, PaginatorLink } from '@/types';
import { PageProps } from '@inertiajs/react';
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
import { MoreHorizontal, PlusCircle, ToggleLeft, ToggleRight, Edit, Search } from 'lucide-react';
import { route } from 'ziggy-js';
import { TargetForm } from '@/components/dashboard/TargetForm';
import { useDebounce } from 'use-debounce';

//@ts-ignore
type KelolaTargetProps = PageProps<{
    targetList: {
        data: TargetUlasan[];
        links: PaginatorLink[];
    };
    filters: { search?: string, tipe?: string };
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

    useEffect(() => {
        const currentParams = route().params;
        router.get(route('dashboard.target.index'), { ...currentParams, search: debouncedSearchValue, page: 1 }, { preserveState: true, replace: true });
    }, [debouncedSearchValue]);

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

    return (
        <DashboardLayout breadcrumbs={<KelolaTargetBreadcrumb />}>
            <Head title="Kelola Target" />

            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manajemen Target Ulasan</h1>
                    <p className="mt-1 text-muted-foreground">Tambah, ubah, dan kelola semua pegawai atau divisi yang dapat diulas.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Target Baru
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingTarget ? 'Edit Target Ulasan' : 'Tambah Target Ulasan Baru'}</DialogTitle>
                        </DialogHeader>
                        <TargetForm target={editingTarget} onSuccess={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
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
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
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
        </DashboardLayout>
    );
}
