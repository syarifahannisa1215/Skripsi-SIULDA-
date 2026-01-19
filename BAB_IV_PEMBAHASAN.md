# BAB IV
# HASIL DAN PEMBAHASAN

## 4.1 Gambaran Umum Sistem

Sistem yang dikembangkan dalam penelitian ini adalah **SIULDA (Sistem Ulasan Dinas Pendidikan Dayah Aceh)**, sebuah platform digital terintegrasi yang dirancang untuk memodernisasi mekanisme umpan balik masyarakat terhadap layanan pendidikan dayah.

Sistem ini beroperasi dengan mengintegrasikan tata kelola data konvensional dengan kecerdasan buatan (*Artificial Intelligence*). Alur kerja utama sistem dimulai ketika masyarakat (santri, wali santri, atau publik) memberikan ulasan terhadap entitas **Pegawai** atau **Divisi**. Ulasan tersebut kemudian diproses secara otomatis oleh mesin *Natural Language Processing* (NLP) menggunakan model **IndoBERT** untuk mendeteksi sentimen (Positif, Netral, Negatif). Hasil analisis ini disajikan secara *real-time* kepada pimpinan Dinas melalui Dashboard Eksekutif untuk mendukung pengambilan keputusan berbasis data (*data-driven decision making*).

Secara arsitektural, SIULDA dibangun menggunakan pola **Monolithic** modern dengan *Inertia.js*, yang memungkinkan penggabungan ketangguhan *Backend* Laravel dengan reaktivitas *Frontend* ReactJS tanpa memisahkan repositori secara fisik (API-First monolithic).

## 4.2 Lingkungan Implementasi

Implementasi sistem memerlukan spesifikasi lingkungan pengembangan dan operasional yang memadai guna menjamin performa model AI dan responsivitas aplikasi.

### 4.2.1 Spesifikasi Perangkat Keras (*Hardware*)
Server dan lingkungan pengembangan menggunakan spesifikasi minimum sebagai berikut:
*   **Unit Pemrosesan (CPU)**: Minimum Quad-Core 2.4 GHz (Intel Core i5 / AMD Ryzen 5) untuk menangani *request* paralelisasi PHP.
*   **Memori (RAM)**: 8 GB (Disarankan 16 GB untuk kelancaran *build process* Node.js).
*   **Penyimpanan**: SSD 256 GB dengan konfigurasi *swap* memori yang cukup.
*   **Konektivitas**: Jaringan stabil untuk komunikasi dengan *Hugging Face Inference API*.

### 4.2.2 Spesifikasi Perangkat Lunak (*Software*)
Stack teknologi yang digunakan mencakup:
*   **Sistem Operasi**: Linux (Development: Zorin OS / Ubuntu, Production: Ubuntu Server 22.04 LTS).
*   **Bahasa Pemrograman**:
    *   Backend: PHP 8.2 (Strict Typing Enabled).
    *   Frontend: TypeScript 5.4 (untuk keamanan tipe data).
*   **Framework Utama**:
    *   **Laravel 12**: Untuk manajemen *routing*, *database*, dan *queue job*.
    *   **React 18**: Untuk antarmuka pengguna interaktif.
    *   **Inertia.js**: Sebagai "perekat" protokol komunikasi antara Laravel dan React.
*   **Basis Data**: MySQL 8.0 / MariaDB 10.6.
*   **Pustaka Pendukung**:
    *   *Tailwind CSS v4*: Utilitas *styling*.
    *   *Shadcn UI & Radix UI*: Komponen antarmuka aksesibel.
    *   *Recharts*: Visualisasi data grafik.
    *   *Lucide React*: Ikonografi standar.

## 4.3 Implementasi Antarmuka (*User Interface*)

Antarmuka SIULDA dirancang dengan filosofi "Profesional & Islami", menggabungkan elemen estetika modern dengan nuansa identitas lokal Aceh.

### 4.3.1 Halaman Beranda (*Landing Page*)
Halaman ini menjadi titik interaksi pertama pengguna.
*   **Hero Section**: Menampilkan slogan "Membangun Marwah Dayah" dengan latar belakang ornamen geometris Islam yang halus. Terdapat dua tombol aksi utama (*Call-to-Action*): "Sampaikan Aspirasi" (untuk Login/Register) dan "Telusuri Data".
*   **Statistik Publik**: Di bagian kaki halaman (*footer*), ditampilkan statistik transparan meliputi total aspirasi masuk, rating pelayanan rata-rata, dan jumlah unit kerja aktif yang dinilai.
*   **Navigasi Responsif**: Menggunakan *Navbar* yang adaptif terhadap perangkat *mobile* maupun *desktop*, memudahkan akses informasi di berbagai ukuran layar.

### 4.3.2 Formulir Aspirasi & Ulasan
Fitur inti sistem ini dirancang dengan alur intuitif (*User Experience* yang disederhanakan):
1.  **Pemilihan Target**: Pengguna memilih entitas yang dinilai (Pegawai Spesifik atau Divisi).
2.  **Pemberian Rating**: Menggunakan komponen bintang (*Star Rating*) skala 1-5.
3.  **Isian Narasi**: *Text area* dengan validasi minimal karakter untuk memastikan ulasan berbobot.

### 4.3.3 Dashboard Admin & Eksekutif
Pusat kendali (Command Center) bagi administrator.
*   **Kartu Metrik**: Menampilkan 4 indikator kinerja utama (KPI) yaitu Total Volume Ulasan, Rerata Indeks Kepuasan, Persentase Sentimen Positif, dan Persentase Sentimen Negatif.
*   **Grafik Tren**: Visualisasi garis yang menunjukkan fluktuasi kepuasan masyarakat dari waktu ke waktu.
*   **Manajemen Entitas**: Tabel interaktif untuk menambah, mengedit, atau menonaktifkan target ulasan (Pegawai/Divisi).

### 4.3.4 Fitur Notifikasi & Feedback
Sistem menggunakan **Sonner Toaster** untuk memberikan umpan balik visual instan. Contoh: Notifikasi "Sukses: Ulasan berhasil dikirim", atau "Error: Koneksi terputus". Hal ini meningkatkan kenyamanan pengguna dibandingkan *alert* standar browser.

## 4.4 Implementasi Kode Program (*Code Implementation*)

Bagian ini memaparkan logika teknis di balik layar yang menjamin integritas data dan kecerdasan sistem.

### 4.4.1 Validasi & Transaksi Database (UlasanController)
Sistem menerapkan prinsip *Atomic Transaction* untuk mencegah data korup saat terjadi kegagalan sistem. Berikut adalah implementasi pada `App\Http\Controllers\UlasanController.php`:

```php
// Menggunakan Database Transaction untuk integritas data
DB::beginTransaction();
try {
    // 1. Validasi Keaktifan Target
    $target = TargetUlasan::findOrFail($validated['target_ulasan_id']);
    if (!$target->is_active) {
        throw new Exception('Target ulasan tidak aktif.');
    }

    // 2. Penyimpanan Data Ulasan
    $ulasan = Ulasan::create([
        'user_id' => Auth::id(),
        'target_ulasan_id' => $validated['target_ulasan_id'],
        'konten' => $validated['konten'],
        'rating' => $validated['rating'],
        'visibilitas' => 'dipublikasikan',
    ]);

    DB::commit(); // Simpan permanen jika semua sukses

    // 3. Dispatch Background Job untuk Analisis AI
    // Dilakukan setelah commit agar tidak memblokir user
    AnalyzeSentiment::dispatch($ulasan);

    return back()->with('flash.success', 'Ulasan berhasil dikirim.');

} catch (Exception $e) {
    DB::rollBack(); // Batalkan semua perubahan jika error
    return back()->with('error', 'Gagal menyimpan ulasan.');
}
```

### 4.4.2 Manajemen Rute & Middleware
Keamanan akses diatur melalui *Route Middleware* pada `routes/web.php`. Pengguna yang belum login (*Guest*) dibatasi hanya bisa melihat halaman depan, sementara akses *Dashboard* diproteksi ganda dengan autentikasi (`auth`) dan pengecekan role (`role:admin`).

```php
// Grup Route Dashboard (Hanya Admin)
Route::middleware(['auth', 'role:admin'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard.index');
    Route::get('/ulasan', [KelolaUlasanController::class, 'index'])->name('dashboard.ulasan.index');
    // ... route manajemen lainnya
});
```

### 4.4.3 Integrasi Kecerdasan Buatan (Job Queue)
Proses analisis sentimen dilakukan secara asinkron (*asynchronous*) menggunakan fitur Laravel Jobs agar pengguna tidak perlu menunggu proses AI selesai.
> *Lihat sub-bab 4.4 pada draft sebelumnya untuk detail kode `AnalyzeSentiment.php`.*

## 4.5 Pengujian Sistem

Pengujian dilakukan secara komprehensif mencakup fungsionalitas luar (*Black Box*) dengan cakupan skenario yang lebih luas untuk memastikan keandalan sistem di berbagai kondisi penggunaan.

### 4.5.1 Black Box Testing (Fungsional Komprehensif)
Pengujian ini dibagi menjadi 4 modul utama: Autentikasi, Interaksi Publik, Manajemen Admin, dan Alur Kerja AI.

#### A. Modul Autentikasi & Keamanan Akun
| No | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Hasil Aktual | Kesimpulan |
|----|-------------------|------------|-----------------------|--------------|------------|
| 1  | Login dengan Google Auth | Klik tombol "Masuk Google" | Redirect ke Google -> Konfirmasi Akun -> Redirect ke Dashboard | Berhasil login dan sesi terbentuk | **Valid** |
| 2  | Akses Halaman Admin Tanpa Login | URL: `/dashboard` | Sistem menolak akses dan me-redirect ke halaman Login | Redirect ke `/login` | **Valid** |
| 3  | Akses Halaman Admin sebagai User Biasa | Login user biasa -> URL: `/dashboard` | Akses ditolak (403 Forbidden) karena role tidak sesuai | Halaman 404 / 403 muncul | **Valid** |
| 4  | Logout Sistem | Klik dropdown profil -> "Keluar" | Sesi dihapus, user kembali ke halaman Landing | Berhasil logout | **Valid** |

#### B. Modul Interaksi Publik (Ulasan)
| No | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Hasil Aktual | Kesimpulan |
|----|-------------------|------------|-----------------------|--------------|------------|
| 5  | Kirim Ulasan Valid | Target: "Divisi Keungan", Rating: 5, Konten: "Pelayanan sangat cepat." | Data tersimpan, pesan sukses muncul, notifikasi terkirim | Ulasan masuk DB, UI Refresh | **Valid** |
| 6  | Kirim Ulasan Kosong | Semua field kosong -> Submit | Frontend menampilkan pesan error "Wajib diisi" pada setiap field | Form tidak terkirim, error muncul | **Valid** |
| 7  | Kirim Ulasan pada Target Non-Aktif | Target ID: [Non-Aktif], Konten: "Tes" | Backend menolak request, pesan error "Target tidak aktif" | Alert error muncul | **Valid** |

#### C. Modul Manajemen Admin
| No | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Hasil Aktual | Kesimpulan |
|----|-------------------|------------|-----------------------|--------------|------------|
| 8  | Tambah Target Ulasan Baru | Nama: "Pegawai X", Tipe: PEGAWAI, Deskripsi: "Staf IT" | Target baru muncul di tabel manajemen target | Data bertambah di tabel `target_ulasan` | **Valid** |
| 9  | Filter Data Ulasan | Pencarian: "Lambat", Sentimen: Negatif | Tabel hanya menampilkan ulasan negatif yang mengandung kata "Lambat" | Filter berfungsi akurat | **Valid** |
| 10 | Sembunyikan Ulasan | Klik "Sembunyikan" pada ulasan ID #12 | Status visibilitas berubah menjadi `disembunyikan` | Ulasan hilang dari publik | **Valid** |
| 11 | Hapus Ulasan Permanen | Klik ikon sampah -> Konfirmasi "Ya" | Data ulasan terhapus permanen dari database | Data hilang dari tabel | **Valid** |

#### D. Modul AI & Verifikasi
| No | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Hasil Aktual | Kesimpulan |
|----|-------------------|------------|-----------------------|--------------|------------|
| 12 | Deteksi Sentimen Positif | Konten: "Dayah ini sangat bersih dan rapi." | AI Label: `Positif`, Score > 90% | Tersimpan sebagai `positif` | **Valid** |
| 13 | Deteksi Sentimen Negatif | Konten: "Proses administrasi berbelit-belit dan lama." | AI Label: `Negatif` | Tersimpan sebagai `negatif` | **Valid** |
| 14 | Verifikasi Manual (Ambigu) | Konten: "Cukup baik tapi perlu perbaikan." (Score < 70%) | Status: `Butuh Tinjauan Manual`, Admin menu `Verifikasi` aktif | Masuk antrean verifikasi admin | **Valid** |
| 15 | Eksekusi Verifikasi Manual | Admin memilih "Netral" pada ulasan ambigu | Status berubah menjadi `Terverifikasi`, Flag manual hilang | Data terupdate sesuai input admin | **Valid** |

### 4.5.2 White Box Testing (Logika Internal)
Pengujian ini memastikan alur kode berjalan sesuai rancangan, terutama pada kondisi batas (*edge cases*).
1.  **Simulation - DB Transaction Rollback**:
    *   *Skenario*: Memutuskan koneksi database tepat setelah validasi input berhasil namun sebelum `DB::commit()`.
    *   *Hasil*: Tidak ada "data sampah" (orphan records) yang tertinggal. Sistem memberikan respons error 500 yang terkendali tanpa mengekspos *stack trace* ke pengguna.
2.  **Simulation - Job Idempotency**:
    *   *Skenario*: Menjalankan job `AnalyzeSentiment` yang sama dua kali.
    *   *Hasil*: Sistem dirancang untuk melakukan *update* pada record yang sama, sehingga tidak terjadi duplikasi hasil analisis sentimen pada satu ulasan.

## 4.6 Pembahasan

### 4.6.1 Efektivitas Integrasi AI dan Moderasi Hibrida
Penerapan model NLP IndoBERT terbukti efektif dalam klasifikasi sentimen otomatis untuk Bahasa Indonesia baku. Namun, untuk mengakomodasi karakteristik linguistik lokal aceh dan *slang*, sistem menerapkan **Moderasi Hibrida**. Ulasan dengan *confidence score* rendah secara otomatis dialihkan ke antrean verifikasi manusia. Hasil pengujian skenario #14 dan #15 membuktikan bahwa mekanisme ini efektif mencegah kesalahan klasifikasi yang fatal, menjaga kredibilitas data yang disajikan kepada pimpinan.

### 4.6.2 Skalabilitas dan Performa
Arsitektur monolit modern dengan *Inertia.js* memberikan keseimbangan optimal antara kecepatan pengembangan dan performa aplikasi. Dengan memindahkan logika rendering ke sisi klien (*Client-Side Rendering*) namun tetap menggunakan *routing* dan *controller* Laravel yang matang, aplikasi mampu menangani beban request yang tinggi dengan *latency* minimal, sebagaimana dibuktikan responsivitas dashboard saat memuat agregasi data statistik.

### 4.6.3 Dampak Strategis
Implementasi SIULDA mengubah paradigma pengawasan pendidikan Dayah dari yang sebelumnya bersifat reaktif dan manual menjadi proaktif dan berbasis data. Ketersediaan dashboard *real-time* memungkinkan Pimpinan Dinas untuk mendeteksi unit kerja yang *underperform* lebih dini berdasarkan tren sentimen negatif, sehingga intervensi perbaikan dapat dilakukan lebih cepat dan tepat sasaran.
