import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import {SidebarTrigger} from "@/components/ui/sidebar";

interface DashboardHeaderProps {
    isMinimized: boolean;
    setIsMinimized: React.Dispatch<React.SetStateAction<boolean>>;
    breadcrumbs?: React.ReactNode;
    onSearchClick: () => void;
}

export function DashboardHeader({ isMinimized, setIsMinimized, breadcrumbs, onSearchClick }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-20 h-16 bg-background/95 backdrop-blur-sm border-b flex items-center px-6 gap-4">
            <SidebarTrigger/>
            <div className="flex-grow flex items-center">
                {breadcrumbs}
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={onSearchClick} className="gap-2">
                    <Search className="h-4 w-4"/>
                    <span className="hidden sm:inline">Cari...</span>
                    <KbdGroup>
                        <Kbd>⌘</Kbd>
                        <span>+</span>
                        <Kbd>K</Kbd>
                    </KbdGroup>
                </Button>
                <NotificationBell />
            </div>
        </header>
    );
}
