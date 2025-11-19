import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { route } from 'ziggy-js';
import { Link } from '@inertiajs/react';

interface Notification {
    id: string;
    type: string;
    data: {
        user_name: string;
        ulasan_snippet: string;
        url: string;
    };
    read_at: string | null;
    created_at: string;
}

function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} dtk yang lalu`;
    if (minutes < 60) return `${minutes} mnt yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    return `${days} hari yang lalu`;
}


const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Link href={notification.data.url} className="block p-3 rounded-lg hover:bg-accent transition-colors">
        <div className="flex items-start gap-3">
            {!notification.read_at && (
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
            )}
            <div className={cn("flex-grow", notification.read_at && "pl-5")}>
                <p className="text-sm font-medium">
                    <span className="font-bold">{notification.data.user_name}</span> baru saja mengirim ulasan.
                </p>
                <p className="text-sm text-muted-foreground italic mt-1">
                    "{notification.data.ulasan_snippet}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">{formatRelativeTime(notification.created_at)}</p>
            </div>
        </div>
    </Link>
);

const EmptyState = () => (
    <div className="text-center p-8">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h4 className="mt-4 font-semibold">Tidak ada notifikasi</h4>
        <p className="mt-1 text-sm text-muted-foreground">Semua notifikasi terbaru akan muncul di sini.</p>
    </div>
);

export function NotificationBell() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [isOpen, setIsOpen] = React.useState(false);

    const fetchNotifications = React.useCallback(async () => {
        try {
            const response = await axios.get(route('dashboard.notifications.index'));
            const allNotifs = [...response.data.unread, ...response.data.read];
            allNotifs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setNotifications(allNotifs);
            setUnreadCount(response.data.unread.length);
        } catch (error) {
            console.error("Gagal mengambil notifikasi:", error);
        }
    }, []);

    React.useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Refresh setiap 1 menit
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleMarkAllAsRead = async () => {
        if (unreadCount === 0) return;
        try {
            await axios.post(route('dashboard.notifications.read'));
            setUnreadCount(0);
            setNotifications(currentNotifs =>
                currentNotifs.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
            );
        } catch (error) {
            console.error("Gagal menandai notifikasi:", error);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative h-9 w-9 p-0">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="flex items-center justify-between border-b p-4">
                    <h3 className="font-semibold">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-emerald-600" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Tandai semua sudah dibaca
                        </Button>
                    )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                    )) : (
                        <EmptyState />
                    )}
                </div>

                <div className="border-t p-2 text-center">
                    <Button variant="link" asChild className="w-full">
                        <Link href="#">Lihat semua notifikasi</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
