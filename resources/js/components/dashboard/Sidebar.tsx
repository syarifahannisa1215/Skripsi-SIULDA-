import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { UserNav } from '@/components/dashboard/UserNav';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import {BookOpen, LayoutDashboard, MessageSquare, UserCog, Users} from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: route('dashboard.index'), label: 'Dashboard', icon: LayoutDashboard, routeName: 'dashboard.index' },
    { href: route('dashboard.ulasan.index'), label: 'Kelola Ulasan', icon: MessageSquare, routeName: 'dashboard.ulasan.index' },
    { href: route('dashboard.ulasan.verifikasi'), label: 'Verifikasi Sentimen', icon: MessageSquare, routeName: 'dashboard.ulasan.verifikasi' },
    { href: route('dashboard.target.index'), label: 'Kelola Target', icon: Users, routeName: 'dashboard.target.index' },
    { href: route('dashboard.users.index'), label: 'Kelola Pengguna', icon: UserCog, routeName: 'dashboard.users.index' },
];

export function DashboardSidebar() {
    const { url } = usePage();

    const isActive = (routeName: string) => route().current(routeName);

    return (
        <Sidebar>
            <SidebarContent className="flex flex-col">
                <div className="h-16 border-b flex items-center px-6 flex-shrink-0">
                    <Link href={route('landing')} className={cn("flex items-center gap-3")}>
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <BookOpen className="text-white" size={18} />
                        </div>
                        <span className={cn("text-xl font-bold text-foreground transition-opacity duration-200")}>
                            SIULDA
                        </span>
                    </Link>
                </div>

                <div className="flex-grow overflow-y-auto">
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                        <SidebarMenu>
                            {navLinks.map((link) => (
                                <SidebarMenuItem key={link.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(link.routeName)}
                                        tooltip={link.label}
                                    >
                                        <Link href={link.href}>
                                            <link.icon className="h-5 w-5 flex-shrink-0" />
                                            <span className={cn("truncate")}>
                                                {link.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </div>

                <div className="p-2 border-t mt-auto flex-shrink-0">
                    <UserNav />
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
