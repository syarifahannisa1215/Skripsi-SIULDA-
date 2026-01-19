import React from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/react';
import { ReviewForm } from '@/components/review/ReviewForm';
import { TargetUlasan } from '@/types';
import { MessageSquarePlus, Star, ShieldCheck, Zap } from 'lucide-react';

interface ReviewFormSectionProps {
    targets?: TargetUlasan[];
}

export function ReviewFormSection({ targets }: ReviewFormSectionProps) {
    const { auth } = usePage<PageProps>().props;

    if (!auth.user) return null;

    return (
        <section className="relative py-24 overflow-hidden bg-slate-900">
            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
            </div>

            <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 7.5L40 10l-7.5 2.5L30 20l-2.5-7.5L20 10l7.5-2.5L30 0zm0 40l2.5 7.5L40 50l-7.5 2.5L30 60l-2.5-7.5L20 50l7.5-2.5L30 40zM10 20l2.5 7.5L20 30l-7.5 2.5L10 40l-2.5-7.5L0 30l7.5-2.5L10 20zm40 0l2.5 7.5L60 30l-7.5 2.5L50 40l-2.5-7.5L40 30l7.5-2.5L50 20z' fill='%20%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }} />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

                    {/* Left Column: Context & Persuasion */}
                    <div className="w-full lg:w-5/12 text-center lg:text-left space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                                <MessageSquarePlus className="w-4 h-4" />
                                <span>Partisipasi Publik</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                                Suara Anda,<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Amanah Kami
                                </span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Berkontribusi langsung dalam meningkatkan kualitas pendidikan Dayah di Aceh. Ulasan Anda adalah langkah awal perubahan yang nyata.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            {[
                                { icon: ShieldCheck, title: "Anonymity", desc: "Privasi Terjaga" },
                                { icon: Star, title: "Impact", desc: "Berdampak Nyata" },
                                { icon: Zap, title: "Fast", desc: "Mudah & Cepat" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center lg:items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-emerald-400 mb-3" />
                                    <h3 className="text-white font-bold text-sm">{item.title}</h3>
                                    <p className="text-slate-400 text-xs">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: The Form */}
                    <div className="w-full lg:w-6/12 relative">
                        {/* Decorative Glow behind form */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full transform scale-90" />

                        <div className="relative">
                            <ReviewForm targets={targets} />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
