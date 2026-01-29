import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar";
import { MoreVertical, LogOut, LayoutDashboard, Settings, Book } from 'lucide-react';
import { route } from 'ziggy-js';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';

export function UserNav() {
    const { state } = useSidebar();
    const { auth } = usePage<PageProps>().props;
    const isMinimized = state === 'collapsed';

    if (!auth.user) {
        return null;
    }

    const userInitial = auth.user.name.charAt(0).toUpperCase();

    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="lg" className="bg-white text-gray-800 hover:bg-green-100 h-auto p-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={auth.user.avatar || undefined} alt={auth.user.name} />
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>

                        {!isMinimized && (
                            <>
                                <div className="ml-3 grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{auth.user.name}</span>
                                    <span className="text-muted-foreground truncate text-xs">{auth.user.email}</span>
                                </div>
                                <MoreVertical className="ml-auto h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-full"
                    align="end"
                    side={isMinimized ? "right" : "top"}
                    sideOffset={8}
                    avoidCollisions={true}
                    collisionPadding={8}
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-3 p-2">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={auth.user.avatar || undefined} alt={auth.user.name} />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {auth.user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                            <Link href={route('dashboard.panduan')} className="cursor-pointer">
                                <Book className="mr-2 h-4 w-4" />
                                <span>Panduan</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link href="#" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Pengaturan</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={route('logout')} method="post" as="button" className="w-full cursor-pointer text-destructive focus:text-destructive">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    );
}