import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Ulasan } from '@/types';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
    Star, TrendingUp, TrendingDown, MessageSquare,
    Users, MoreHorizontal, ThumbsUp, ThumbsDown,
    Filter,
} from 'lucide-react';
import { SentimentChart } from '@/components/dashboard/Chart';
import { TooltipProps } from "recharts";

type Stats = {
    totalUlasan: number;
    ratingRataRata: number;
    sentimenPositif: number;
    sentimenNegatif: number;
};
type ChartData = { date: string; positif: number; negatif: number; };
type PopularTarget = { nama: string; tipe: 'PEGAWAI' | 'DIVISI'; total: number; };
type SentimentProps = {
    stats?: Stats;
    sentimentChartData?: ChartData[];
    ulasanTerbaru?: Ulasan[];
    targetPopuler?: PopularTarget[];
}
// @ts-ignore
type DashboardProps = PageProps<SentimentProps>;

const DashboardBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
);


const StatsCard = ({ title, value, icon: Icon, description, trend, trendValue }: { title: string; value: string | number; icon: React.ElementType; description: string; trend?: 'up' | 'down' | 'neutral'; trendValue?: string; }) => {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="h-4 w-4 text-emerald-500" />;
        if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
        return null;
    };
    const getTrendColor = () => {
        if (trend === 'up') return 'text-emerald-500';
        if (trend === 'down') return 'text-red-500';
        return 'text-muted-foreground';
    };

    return (
        <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{description}</span>
                    {trend && (
                        <span className="flex items-center gap-1">
                            {getTrendIcon()}
                            <span className={getTrendColor()}>{trendValue}</span>
                        </span>
                    )}
                </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        </Card>
    );
};

const RecentReviews = ({ reviews }: { reviews: Ulasan[] }) => (
    <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
                <CardTitle>Ulasan Terbaru</CardTitle>
                <CardDescription>5 ulasan terakhir</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </CardHeader>
        <CardContent className="space-y-3">
            {reviews.length > 0 ? reviews.map((ulasan) => (
                <div key={ulasan.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <Avatar className="h-9 w-9 border-2 border-background">
                        <AvatarImage src={ulasan.user?.avatar || undefined} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-800">
                            {(ulasan.user?.name || '?').charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 flex-grow min-w-0">
                        <p className="text-sm font-medium leading-none truncate">{ulasan.user?.name || 'User Dihapus'}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{ulasan.konten}</p>
                    </div>
                    {ulasan.sentimen_prediksi && (
                        <div className="flex-shrink-0">
                            {ulasan.sentimen_prediksi === 'positif' ? (
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600">
                                    <ThumbsUp size={12} />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 text-red-600">
                                    <ThumbsDown size={12} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )) : (
                <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>Belum ada ulasan</p>
                </div>
            )}
        </CardContent>
    </Card>
);

const PopularTargets = ({ targets }: { targets: PopularTarget[] }) => {
    const maxReviews = targets.length > 0 ? Math.max(...targets.map(t => t.total)) : 1;
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>Target Paling Banyak Diulas</CardTitle>
                    <CardDescription>Pegawai dan divisi dengan ulasan terbanyak</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Lihat Semua
                </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
                {targets.length > 0 ? targets.map((target) => (
                    <div key={target.nama} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium leading-none">{target.nama}</p>
                                <Badge variant={target.tipe === 'PEGAWAI' ? 'default' : 'secondary'}>{target.tipe}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{target.total}</span>
                            </div>
                        </div>
                        <Progress value={(target.total / maxReviews) * 100} className="h-1.5" />
                    </div>
                )) : (
                    <div className="text-center py-6 text-muted-foreground">
                        <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>Belum ada data target</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function Dashboard({ stats, sentimentChartData, ulasanTerbaru, targetPopuler }: DashboardProps) {
    // @ts-ignore
    const { auth } = usePage<PageProps>().props;

    return (
        <DashboardLayout breadcrumbs={<DashboardBreadcrumb />}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Selamat Datang, {auth.user?.name}!</h1>
                    <p className="mt-1 text-muted-foreground">Ringkasan aktivitas dan sentimen publik di SIULDA.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Filter</span>
                    </Button>
                    <Button size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Export</span>
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard title="Total Ulasan" value={stats?.totalUlasan ?? 0} icon={MessageSquare} description="Jumlah semua ulasan" trend="up" trendValue="12%" />
                    <StatsCard title="Rating Rata-rata" value={stats?.ratingRataRata?.toFixed(1) ?? 'N/A'} icon={Star} description="Dari semua ulasan" trend="up" trendValue="0.3" />
                    <StatsCard title="Sentimen Positif" value={`${stats?.sentimenPositif ?? 0}%`} icon={TrendingUp} description="Dari total ulasan" trend="up" trendValue="5%" />
                    <StatsCard title="Sentimen Negatif" value={`${stats?.sentimenNegatif ?? 0}%`} icon={TrendingDown} description="Dari total ulasan" trend="down" trendValue="3%" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <SentimentChart chartData={sentimentChartData ?? []} />
                    <RecentReviews reviews={ulasanTerbaru ?? []} />
                </div>

                <div className="grid grid-cols-1">
                    <PopularTargets targets={targetPopuler ?? []} />
                </div>
            </div>
        </DashboardLayout>
    );
}
