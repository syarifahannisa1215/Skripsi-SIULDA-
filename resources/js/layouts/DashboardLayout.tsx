import React, {PropsWithChildren, useState} from 'react';
import { DashboardHeader } from '@/components/dashboard/Header';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import {ChatWidget} from "@/components/dashboard/ChatWidget";

interface DashboardLayoutProps extends PropsWithChildren {
    breadcrumbs?: React.ReactNode;
}

export default function DashboardLayout({ breadcrumbs, children }: DashboardLayoutProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                <DashboardHeader
                    isMinimized={isMinimized}
                    setIsMinimized={setIsMinimized}
                    breadcrumbs={breadcrumbs}
                    onSearchClick={() => setSearchOpen(true)}
                />
                <main className="flex-1 p-6 sm:p-8">
                    {children}
                </main>
                <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
            </SidebarInset>
            <ChatWidget />
        </SidebarProvider>
    );
}
