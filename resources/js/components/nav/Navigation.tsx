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
import { BookOpen, Chrome, Menu, X, LogOut, LayoutDashboard, Home, Info, BarChart2, Mail, ChevronRight, User } from 'lucide-react';
import { route } from 'ziggy-js';
import { PageProps } from '@/types';
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

    const navLinks = [
        { label: 'Beranda', href: route('landing'), icon: Home },
        { label: 'Tentang', href: '#', icon: Info },
        { label: 'Statistik', href: '#', icon: BarChart2 },
        { label: 'Kontak', href: '#', icon: Mail },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b border-transparent",
                scrolled || mobileMenuOpen
                    ? "bg-white/90 backdrop-blur-md border-slate-200/60 shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href={route('landing')} className="flex items-center gap-3 group relative z-50">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-600 to-teal-600 group-hover:shadow-emerald-500/30 group-hover:scale-105",
                        )}>
                            <BookOpen className="text-white" size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-lg font-black tracking-tight leading-none transition-colors duration-300",
                                scrolled || mobileMenuOpen ? "text-slate-900" : "text-slate-900"
                            )}>
                                SIULDA
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest text-emerald-600",
                            )}>
                                Aceh
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-sm">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className={cn(
                                    "px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 hover:bg-white hover:text-emerald-700 hover:shadow-sm",
                                    "text-slate-600"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth / Action */}
                    <div className="hidden md:flex items-center gap-3">
                        {auth.user ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-xs font-bold text-slate-900 leading-none mb-1">{auth.user.name}</p>
                                    <p className="text-[10px] font-medium text-slate-500 uppercase">{auth.user.role ?? 'User'}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-11 w-11 rounded-full p-0 ring-2 ring-transparent hover:ring-emerald-100 transition-all">
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                <AvatarImage src={auth.user.avatar || ""} alt={auth.user.name} />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                                                    {auth.user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
                                        <div className="p-2 bg-slate-50 rounded-lg mb-2">
                                            <p className="text-sm font-bold text-slate-900">{auth.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                        </div>
                                        {auth.user.role === 'admin' && (
                                            <DropdownMenuItem asChild>
                                                <Link href={route('dashboard.index')} className="w-full cursor-pointer rounded-md p-2 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors mb-1">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild>
                                            <Link href={route('logout')} method="post" as="button" className="w-full cursor-pointer rounded-md p-2 hover:bg-red-50 text-red-600 hover:text-red-700 font-medium transition-colors">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Keluar</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Button
                                asChild
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 shadow-lg shadow-slate-200/50 hover:shadow-slate-300/50 transition-all hover:-translate-y-0.5"
                            >
                                <a href={route('google.auth')} className="flex items-center gap-2">
                                    <Chrome size={16} />
                                    <span>Masuk</span>
                                </a>
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden z-50">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Overlay */}
                <div className={cn(
                    "fixed inset-0 bg-white/95 backdrop-blur-xl z-40 transition-all duration-500 md:hidden flex flex-col pt-24 px-6",
                    mobileMenuOpen
                        ? "opacity-100 pointer-events-auto translate-x-0"
                        : "opacity-0 pointer-events-none translate-x-full"
                )}>
                    <div className="flex flex-col space-y-2 mb-8">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <link.icon size={20} />
                                    </div>
                                    <span className="text-lg font-bold text-slate-700 group-hover:text-emerald-900">{link.label}</span>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto mb-8 border-t border-slate-100 pt-8">
                        {auth.user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={auth.user.avatar || ""} alt={auth.user.name} />
                                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-900">{auth.user.name}</p>
                                        <p className="text-xs text-slate-500">{auth.user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {auth.user.role === 'admin' && (
                                        <Link
                                            href={route('dashboard.index')}
                                            className="flex flex-col items-center justify-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl font-bold hover:bg-emerald-100 transition-colors"
                                        >
                                            <LayoutDashboard size={20} />
                                            Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors",
                                            auth.user.role !== 'admin' && "col-span-2"
                                        )}
                                    >
                                        <LogOut size={20} />
                                        Keluar
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <Button
                                asChild
                                className="w-full h-14 text-lg font-bold rounded-2xl bg-slate-900 text-white shadow-xl"
                            >
                                <a href={route('google.auth')} className="flex items-center justify-center gap-3">
                                    <Chrome size={20} />
                                    Masuk dengan Google
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
