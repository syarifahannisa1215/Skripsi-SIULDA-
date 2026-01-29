import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { route } from 'ziggy-js';
import { Separator } from '@/components/ui/separator';

const PanduanBreadcrumb = () => (
    <Breadcrumb>
        <BreadcrumbList>
            <BreadcrumbItem><Link href={route('dashboard.index')}>Dashboard</Link></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Panduan Penggunaan</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
);

export default function Panduan() {
    return (
        <DashboardLayout breadcrumbs={<PanduanBreadcrumb />}>
            <Head title="Panduan Penggunaan" />

            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Panduan Penggunaan SIULDA</h1>
                    <p className="text-xl text-muted-foreground">
                        Dokumentasi lengkap dan panduan teknis untuk administrator Sistem Analisis Ulasan Dinas Pendidikan Dayah Aceh.
                    </p>
                </header>

                <Card className="mb-12">
                    <CardContent className="p-8 sm:p-12 space-y-12">

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">1. Pendahuluan</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Selamat datang di SIULDA (Sistem Analisis Ulasan Dinas Pendidikan Dayah Aceh). Platform ini dirancang khusus untuk memodernisasi cara instansi mengelola, memantau, dan menganalisis umpan balik dari masyarakat.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Sebagai administrator, Anda memegang peran krusial dalam memastikan kualitas data, validitas ulasan, dan akurasi target layanan yang dinilai. Panduan ini akan membantu Anda memahami setiap fitur secara mendalam agar Anda dapat menjalankan tugas moderasi dengan efisien.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">2. Memahami Dashboard</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Halaman Dashboard adalah pusat kendali Anda. Saat pertama kali masuk, Anda disajikan dengan ringkasan statistik real-time yang memberikan gambaran kesehatan layanan publik di mata masyarakat.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-foreground/50">
                                <li><strong>Statistik Agregat:</strong> Kartu-kartu di bagian atas menampilkan Total Ulasan, Rating Rata-rata, serta persentase Sentimen Positif dan Negatif. Data ini dihitung dari seluruh ulasan yang masuk.</li>
                                <li><strong>Grafik Tren Sentimen:</strong> Grafik garis yang melacak fluktuasi opini publik selama 90 hari terakhir. Lonjakan negatif pada tanggal tertentu dapat menjadi indikator adanya masalah layanan di lapangan.</li>
                                <li><strong>Daftar Ulasan & Target Terbaru:</strong> Tabel ringkas untuk melihat aktivitas terkini tanpa perlu masuk ke menu detail.</li>
                            </ul>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">3. Manajemen Ulasan</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Inti dari sistem ini adalah pengelolaan ulasan. Pada halaman <strong>Kelola Ulasan</strong>, Anda dapat melakukan moderasi penuh terhadap setiap masukan yang diterima.
                            </p>

                            <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">Analisis Sentimen Otomatis</h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Setiap ulasan yang masuk diproses oleh AI untuk menentukan sentimennya (Positif, Negatif, atau Netral). Gunakan fitur <strong>Analisis</strong> di header untuk memperbarui prediksi sentimen jika ada data baru yang belum terproses.
                            </p>

                            <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">Filter & Sortir</h3>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Gunakan kolom pencarian untuk menemukan ulasan spesifik. Anda juga dapat mengurutkan data berdasarkan:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-foreground/50">
                                <li><strong>Terbaru/Terlama:</strong> Untuk melihat urutan kronologis.</li>
                                <li><strong>Skor Sentimen:</strong> Urutkan skor tertinggi untuk melihat apresiasi terbaik, atau skor terendah untuk menemukan keluhan paling kritis.</li>
                            </ul>

                            <h3 className="text-lg font-semibold text-foreground mb-2 mt-6">Tindakan Moderasi</h3>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-foreground/50">
                                <li><strong>Publikasi/Sembunyikan:</strong> Kontrol visibilitas ulasan di halaman publik. Sembunyikan ulasan yang mengandung kata-kata kasar atau tidak relevan.</li>
                                <li><strong>Hapus (Single/Bulk):</strong> Hapus ulasan spam. Anda dapat memilih beberapa ulasan sekaligus menggunakan checkbox di tabel dan menekan tombol <span className="text-destructive font-medium">Hapus</span> yang muncul di header.</li>
                            </ul>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">4. Manajemen Target</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Target Ulasan adalah objek yang dinilai oleh masyarakat, bisa berupa <strong>Divisi</strong> (misal: Pelayanan KTP) atau <strong>Pegawai</strong> (Individu).
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-3">
                                Pastikan data target selalu <em>up-to-date</em>:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground marker:text-foreground/50">
                                <li>Nonaktifkan status target jika pegawai tersebut mutasi atau pensiun. Data histori ulasan mereka akan tetap aman, namun tidak akan muncul di form ulasan baru.</li>
                                <li>Gunakan fitur "Tambah Target" untuk mendaftarkan unit layanan atau personel baru.</li>
                            </ul>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-2xl font-bold text-foreground mb-4">5. Manajemen Pengguna</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Halaman ini khusus untuk mengelola akses administrator ke dashboard SIULDA.
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg border text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">Catatan Penting:</span> Berhati-hatilah saat mengubah peran pengguna atau menghapus akun. Sistem telah dilengkapi proteksi untuk mencegah Anda menghapus akun Anda sendiri.
                            </div>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
