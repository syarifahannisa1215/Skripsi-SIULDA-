import { Head, Link, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo } from 'react';
import { Ulasan, PaginatorLink, TargetUlasan } from '@/types';
import { PageProps } from '@inertiajs/react';
import { toast } from "sonner";

import { Navigation } from '@/components/nav/Navigation';
import { Hero, ReviewFormSection, ReviewSection, Footer } from '@/components/landing';

type LandingProps = PageProps<{
    ulasan: { data: Ulasan[]; links: PaginatorLink[]; };
    targetUlasanList?: TargetUlasan[];
}>;

export default function Landing({ ulasan, targetUlasanList }: LandingProps) {
    const { auth, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Calculate stats for hero section
    const stats = useMemo(() => {
        const totalReviews = ulasan.data.length;
        const ratingsSum = ulasan.data.reduce((sum: number, review: Ulasan) => sum + (review.rating || 0), 0);
        const ratingsCount = ulasan.data.filter((review: Ulasan) => review.rating !== null).length;
        const averageRating = ratingsCount > 0 ? (ratingsSum / ratingsCount).toFixed(1) : '0.0';
        const activeTargets = targetUlasanList?.length || 0;

        return {
            totalReviews,
            averageRating: parseFloat(averageRating),
            activeTargets,
        };
    }, [ulasan.data, targetUlasanList]);

    return (
        <>
            <Head title="Ulasan Publik - Dinas Pendidikan Dayah Aceh" />
            <Navigation />

            <main className="bg-slate-50 min-h-screen">
                <Hero isAuthenticated={!!auth.user} stats={stats} />
                <ReviewFormSection targets={targetUlasanList} />

                <ReviewSection ulasan={ulasan} />

                <Footer />
            </main>
        </>
    );
}