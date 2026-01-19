import React from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ExternalLink, Globe } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800 relative overflow-hidden">
            {/* Decorative Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l2.5 7.5L40 10l-7.5 2.5L30 20l-2.5-7.5L20 10l7.5-2.5L30 0zm0 40l2.5 7.5L40 50l-7.5 2.5L30 60l-2.5-7.5L20 50l7.5-2.5L30 40zM10 20l2.5 7.5L20 30l-7.5 2.5L10 40l-2.5-7.5L0 30l7.5-2.5L10 20zm40 0l2.5 7.5L60 30l-7.5 2.5L50 40l-2.5-7.5L40 30l7.5-2.5L50 20z' fill='%20%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Identity */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight mb-2">SIULDA</h3>
                            <p className="text-sm font-medium text-emerald-500 uppercase tracking-widest">Sistem Ulasan Dayah Aceh</p>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Platform transparansi publik untuk peningkatan mutu pendidikan Dayah di Provinsi Aceh. Suara Anda adalah amanah kami.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 text-emerald-500 hover:text-white transition-all duration-300 border border-slate-700 hover:border-emerald-500 group">
                                    <Icon size={18} className="transform group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Akses Cepat</h4>
                        <ul className="space-y-3">
                            {['Beranda', 'Tentang Kami', 'Prosedur Pengaduan', 'Statistik Dayah', 'Hubungi Kami'].map((item, i) => (
                                <li key={i}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-emerald-500 transition-colors" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Hubungi Kami</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>
                                    Jl. Twk. Hasyim Banta Muda No.1<br />
                                    Kuta Alam, Banda Aceh<br />
                                    Aceh 23126
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span>(0651) 1234567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span>info@dayah.acehprov.go.id</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Official Info */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg">Portal Resmi</h4>
                        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium">Buka Website</div>
                                    <a href="#" className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1">
                                        dayah.acehprov.go.id
                                        <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-500 leading-tight">
                                Dikelola oleh Dinas Pendidikan Dayah Provinsi Aceh
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {currentYear} Dinas Pendidikan Dayah Aceh. Hak Cipta Dilindungi.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a>
                        <a href="#" className="hover:text-emerald-400 transition-colors">Peta Situs</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
