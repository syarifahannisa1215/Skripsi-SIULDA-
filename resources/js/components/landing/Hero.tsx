import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Users2, 
  Star,
  MessageSquareQuote,
  Library
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock route function
const route = (name: string) => {
    const routes: Record<string, string> = {
        'google.auth': '/auth/google',
        'ulasan': '#ulasan',
        'review-form': '#review-form'
    };
    return routes[name] || '#';
};

export function Hero({ isAuthenticated, stats }: { isAuthenticated: boolean, stats?: any }) {
    return (
        <div className="relative h-screen h-[100dvh] w-full flex flex-col bg-[#fdfdfb] overflow-hidden select-none">
            {/* Islamic Geometric Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 7.5L40 10l-7.5 2.5L30 20l-2.5-7.5L20 10l7.5-2.5L30 0zm0 40l2.5 7.5L40 50l-7.5 2.5L30 60l-2.5-7.5L20 50l7.5-2.5L30 40zM10 20l2.5 7.5L20 30l-7.5 2.5L10 40l-2.5-7.5L0 30l7.5-2.5L10 20zm40 0l2.5 7.5L60 30l-7.5 2.5L50 40l-2.5-7.5L40 30l7.5-2.5L50 20z' fill='%20%23065f46' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }} />
            
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-emerald-50/20 via-transparent to-transparent pointer-events-none" />

            <main className="flex-1 container relative z-10 mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 min-h-0">
                
                {/* Left Column: Content */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 md:space-y-6">
                    
                    {/* Official Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100/50 animate-in fade-in slide-in-from-left-4 duration-700">
                        <Library className="w-3 h-3 md:w-4 md:h-4 text-emerald-700" />
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800 whitespace-nowrap">
                            Lembaga Resmi Pendidikan Dayah Aceh
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                        {isAuthenticated ? (
                            <>
                                Ahlan wa Sahlan di <span className="text-emerald-700 italic">SIULDA</span>
                            </>
                        ) : (
                            <>
                                Membangun <br />
                                <span className="text-emerald-700">Marwah Dayah</span>
                            </>
                        )}
                    </h1>

                    <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed lg:border-l-4 lg:border-emerald-500/30 lg:pl-6">
                        {isAuthenticated ? (
                            "Sumbangkan pemikiran dan ulasan Anda untuk kemajuan pendidikan Islam di Serambi Mekkah."
                        ) : (
                            "Wadah digital untuk transparansi dan peningkatan mutu pelayanan institusi Dayah. Suara Anda adalah amanah bagi kami."
                        )}
                    </p>

                    <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start w-full">
                        {!isAuthenticated ? (
                            <>
                                <Button 
                                    asChild 
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-5 md:px-8 md:py-6 rounded-xl text-base md:text-lg font-bold shadow-lg shadow-emerald-200/50 transition-all hover:translate-y-[-2px]"
                                >
                                    <a href={route('google.auth')} className="flex items-center gap-2">
                                        Sampaikan Aspirasi
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </a>
                                </Button>
                                <Button 
                                    asChild 
                                    variant="ghost" 
                                    className="px-6 py-5 md:px-8 md:py-6 rounded-xl text-base md:text-lg font-bold text-emerald-900 hover:bg-emerald-50"
                                >
                                    <a href="#ulasan">Telusuri Data</a>
                                </Button>
                            </>
                        ) : (
                            <Button 
                                asChild 
                                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-5 md:px-8 md:py-6 rounded-xl text-base md:text-lg font-bold shadow-xl transition-all hover:translate-y-[-2px]"
                            >
                                <a href="#review-form" className="flex items-center gap-2">
                                    Tulis Ulasan Baru
                                    <MessageSquareQuote className="w-4 h-4 md:w-5 md:h-5" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right Column: Mihrab Image Container */}
                <div className="hidden lg:flex w-1/2 h-full max-h-[70vh] items-center justify-center relative">
                    <div className="relative w-full max-w-md aspect-[4/5] bg-slate-100 rounded-t-[180px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent z-10" />
                        
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center space-y-4">
                            <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center mb-2 shadow-sm">
                                <Library className="w-10 h-10 text-emerald-600/40" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Citra Institusi Dayah</h3>
                            <p className="text-xs max-w-[180px]">Representasi visual komplek Dayah yang modern & asri</p>
                        </div>

                        {/* Floating Status */}
                        <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl z-20 flex items-center gap-3 border border-emerald-50">
                            <div className="p-2 bg-emerald-600 rounded-lg text-white">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-emerald-800 uppercase tracking-tighter">Status</div>
                                <div className="text-xs font-medium text-slate-600 italic">Terverifikasi & Amanah</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Stats Section - Compact & Responsive */}
            <footer className="w-full bg-white/80 backdrop-blur-sm border-t border-slate-100 py-3 md:py-4">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                        {[
                            { label: "Aspirasi", val: stats?.totalReviews ?? 0, icon: Users2, color: "emerald" },
                            { label: "Rating", val: `${stats?.averageRating ?? 0}/5`, icon: Star, color: "amber" },
                            { label: "Unit", val: stats?.activeTargets ?? 0, icon: BarChart3, color: "emerald" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-center gap-2 md:gap-4">
                                <div className={`hidden sm:flex p-1.5 rounded-lg bg-${item.color}-50 text-${item.color}-700`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-sm md:text-lg lg:text-xl font-black text-slate-900 leading-none">
                                        {typeof item.val === 'number' ? item.val.toLocaleString() + "+" : item.val}
                                    </div>
                                    <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>

            {/* Bottom Accent Bar */}
            <div className="h-1 bg-emerald-900 w-full" />
        </div>
    );
}