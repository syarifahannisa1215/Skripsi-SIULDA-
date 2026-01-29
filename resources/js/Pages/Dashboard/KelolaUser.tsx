import { Head, Link, router, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { User, PaginatorLink } from '@/types';
import { PageProps } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import { MoreHorizontal, ShieldCheck, User as UserIcon, Search, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { useDebounce } from 'use-debounce';

//@ts-ignore
type KelolaUserProps = PageProps<{
    userList: {
        data: User[];
        links: PaginatorLink[];
    };
    filters: { search?: string, role?: string, sort?: string };
}>;

const KelolaUserBreadcrumb = () => (<Breadcrumb><BreadcrumbList><BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Kelola Pengguna</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>);

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

export default function KelolaUser({ userList, filters }: KelolaUserProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [debouncedSearchValue] = useDebounce(searchValue, 300);
    const [sortValue, setSortValue] = useState<string>(typeof filters.sort === 'string' ? filters.sort : 'latest');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isBulkDelete, setIsBulkDelete] = useState(false);

    const { delete: destroy, processing } = useForm();
    const isAllSelected = userList.data.length > 0 && selectedIds.length === userList.data.length;

    useEffect(() => {
        if ((filters.search || '') === debouncedSearchValue && (filters.sort || 'latest') === sortValue) return;
        const currentParams = route().params;
        router.get(route('dashboard.users.index'), {
            ...currentParams,
            search: debouncedSearchValue,
            sort: sortValue,
            page: 1
        }, { preserveState: true, replace: true });
    }, [debouncedSearchValue, sortValue]);

    useEffect(() => {
        setSelectedIds([]);
    }, [userList.data]);

    const handleRoleChange = (user: User, newRole: 'admin' | 'user') => {
        if (user.role === newRole) return;
        router.patch(route('dashboard.users.update', { user: user.id }), {
            role: newRole,
        }, { preserveScroll: true });
    };

    const openDeleteDialog = (user: User) => {
        setIsBulkDelete(false);
        setUserToDelete(user);
        setDialogOpen(true);
    };

    const openBulkDeleteDialog = () => {
        setIsBulkDelete(true);
        setDialogOpen(true);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(userList.data.map(u => u.id));
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
            router.post(route('dashboard.users.bulk-destroy'), { ids: selectedIds }, {
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

        if (!userToDelete) return;
        // Check if individual delete route exists or use a generic one?
        // Note: I added implicit route resource? No, I added 'users.bulk-destroy'.
        // I need to check if 'dashboard.users.destroy' route exists?
        // In web.php (step 301):
        // Route::get('/users', ...).name('users.index');
        // Route::post('/users/bulk-destroy', ...).name('users.bulk-destroy');
        // Route::patch('/users/{user}', ...).name('users.update');
        // NO DELETE ROUTE FOR USER INDIVIDUALLY!
        // But wait, the previous code didn't have delete either?
        // Let's check Step 305 (original KelolaUser.tsx).
        // It DOES NOT have a delete button. Just role change.
        // Wait, user requested "add delete function on both".
        // So I must IMPLEMENT individual delete too!
        // So I need to add Route::delete('/users/{user}')...
        // And I need to add destroy method to KelolaUserController?
        // KelolaUserController HAS destroy method (Step 291).
        // So I just need to add the route in web.php.

        // I will assume I will add the route in next step. For now I write the code expecting it.
        destroy(route('dashboard.users.destroy', { user: userToDelete.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setDialogOpen(false);
                setUserToDelete(null);
            },
            onError: () => {
                setDialogOpen(false);
                setUserToDelete(null);
            },
        });
    };

    return (
        <DashboardLayout breadcrumbs={<KelolaUserBreadcrumb />}>
            <Head title="Kelola Pengguna" />

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Manajemen Pengguna</h1>
                    <p className="mt-1 text-muted-foreground">Cari dan tunjuk pengguna tertentu untuk menjadi admin sistem.</p>
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
                            <SelectItem value="name_asc">Nama (A-Z)</SelectItem>
                            <SelectItem value="name_desc">Nama (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                placeholder="Cari berdasarkan nama atau email..."
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
                                    <TableHead className="w-[350px]">Pengguna</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-center">Peran</TableHead>
                                    <TableHead className="text-right w-[80px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userList.data.length > 0 ? userList.data.map((user: User) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(user.id)}
                                                onCheckedChange={(checked) => handleSelectOne(user.id, !!checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar || undefined} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                                {user.role}
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
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user, 'admin')}
                                                        className="cursor-pointer"
                                                        disabled={user.role === 'admin'}
                                                    >
                                                        <ShieldCheck className="mr-2 h-4 w-4" /> Jadikan Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user, 'user')}
                                                        className="cursor-pointer"
                                                        disabled={user.role === 'user'}
                                                    >
                                                        <UserIcon className="mr-2 h-4 w-4" /> Jadikan User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openDeleteDialog(user)}
                                                        className="cursor-pointer text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Hapus User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Tidak ada pengguna yang cocok dengan pencarian Anda.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <TablePagination links={userList.links} />
                </CardContent>
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isBulkDelete
                                ? `Tindakan ini akan menghapus ${selectedIds.length} user yang dipilih secara permanen.`
                                : "Tindakan ini tidak dapat dibatalkan. Ini akan menghapus user secara permanen."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { setUserToDelete(null); setIsBulkDelete(false); }}>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={processing} className="bg-destructive hover:bg-destructive/90">
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
