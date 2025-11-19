import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { User, PaginatorLink } from '@/types';
import { PageProps } from '@inertiajs/react';
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
import { MoreHorizontal, ShieldCheck, User as UserIcon, Search } from 'lucide-react';
import { route } from 'ziggy-js';
import { useDebounce } from 'use-debounce';

//@ts-ignore
type KelolaUserProps = PageProps<{
    userList: {
        data: User[];
        links: PaginatorLink[];
    };
    filters: { search?: string, role?: string };
}>;

const KelolaUserBreadcrumb = () => ( <Breadcrumb><BreadcrumbList><BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Kelola Pengguna</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb> );

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

    useEffect(() => {
        const currentParams = route().params;
        router.get(route('dashboard.users.index'), { ...currentParams, search: debouncedSearchValue, page: 1 }, { preserveState: true, replace: true });
    }, [debouncedSearchValue]);

    const handleRoleChange = (user: User, newRole: 'admin' | 'user') => {
        if (user.role === newRole) return;
        router.patch(route('dashboard.users.update', { user: user.id }), {
            role: newRole,
        }, { preserveScroll: true });
    };

    return (
        <DashboardLayout breadcrumbs={<KelolaUserBreadcrumb />}>
            <Head title="Kelola Pengguna" />

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Manajemen Pengguna</h1>
                <p className="mt-1 text-muted-foreground">Cari dan tunjuk pengguna tertentu untuk menjadi admin sistem.</p>
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
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
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
        </DashboardLayout>
    );
}
