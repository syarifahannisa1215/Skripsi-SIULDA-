import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Chrome, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { route } from 'ziggy-js';
import { PageProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function Navigation() {
    const { auth } = usePage<PageProps>().props;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    return (
        <header className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
            scrolled ? "p-2" : "p-0"
        )}>
            <div className={cn(
                "w-full transition-all duration-300 ease-in-out",
                scrolled
                    ? "max-w-9xl mx-auto rounded-lg bg-white/80 shadow-lg backdrop-blur-xl border"
                    : "rounded-none bg-white border-b"
            )}>
                {/* --- PERBAIKAN 3: Wadah Konten yang Selalu Terpusat --- */}
                {/* Div ini SELALU max-w-9xl dan mx-auto. */}
                {/* Karena margin-nya tidak pernah berubah, tidak akan ada animasi geser horizontal. */}
                <div className="mx-auto flex h-16 max-w-9xl items-center justify-between px-6">
                    <Link href={route('landing')} className="flex items-center gap-3 group flex-shrink-0">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <BookOpen className="text-white" size={18} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">SIULDA</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-lg">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={auth.user.avatar || ""} alt={auth.user.name} />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                                {auth.user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{auth.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {auth.user.role === 'admin' && (
                                        <DropdownMenuItem asChild>
                                            <Link href={route('dashboard.index')} className="cursor-pointer flex items-center w-full">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('logout')} method="post" as="button" className="w-full cursor-pointer flex items-center text-red-600 focus:text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button asChild>
                                <a href={route('google.auth')}><Chrome size={18} className="mr-2" />Sign in</a>
                            </Button>
                        )}
                    </div>

                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden border-t py-4 px-6 space-y-2">
                         {auth.user ? (
                            <>
                                {auth.user.role === 'admin' && <Button asChild variant="ghost" className="w-full justify-start"><Link href={route('dashboard.index')}><LayoutDashboard className="mr-2 h-4 w-4"/>Dashboard</Link></Button>}
                                <Button asChild variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600">
                                    <Link href={route('logout')} method="post" as="button"><LogOut className="mr-2 h-4 w-4"/>Log out</Link>
                                </Button>
                            </>
                        ) : (
                            <Button asChild className="w-full">
                                <a href={route('google.auth')}><Chrome size={18} className="mr-2" />Sign in</a>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
