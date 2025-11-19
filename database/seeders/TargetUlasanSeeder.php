<?php

namespace Database\Seeders;

use App\Models\TargetUlasan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class TargetUlasanSeeder extends Seeder
{
    public function run(): void
    {
        TargetUlasan::query()->delete();
        $daftarDivisi = new Collection([
            ['nama' => 'Sekretariat', 'deskripsi' => 'Menangani administrasi umum, kepegawaian, dan keuangan dinas.'],
            ['nama' => 'Bidang Pendidikan Dayah', 'deskripsi' => 'Mengurus kurikulum, akreditasi, dan penjaminan mutu pendidikan dayah.'],
            ['nama' => 'Bidang Santri dan Tenaga Pendidik', 'deskripsi' => 'Mengelola data santri, beasiswa, dan pengembangan kompetensi guru/tengku.'],
            ['nama' => 'Bidang Sarana dan Prasarana', 'deskripsi' => 'Bertanggung jawab atas pembangunan, pemeliharaan, dan bantuan fasilitas dayah.'],
            ['nama' => 'Unit Pelaksana Teknis Daerah (UPTD)', 'deskripsi' => 'Unit teknis yang melaksanakan program-program spesifik dinas.'],
        ]);

        $divisiModels = $daftarDivisi->map(function ($divisi) {
            return TargetUlasan::create([
                'tipe' => 'DIVISI',
                'nama' => $divisi['nama'],
                'deskripsi' => $divisi['deskripsi'],
                'is_active' => true,
            ]);
        });

        $this->createPegawai($divisiModels);
    }

    private function createPegawai(Collection $divisiModels): void
    {
        $namaDepan = ['Teuku', 'Cut', 'Muhammad', 'Ahmad', 'Siti', 'Fatimah', 'Banta', 'Zainal', 'Rizki', 'Nurul', 'Agus', 'Dewi'];
        $namaBelakang = ['Ardiansyah', 'Abdullah', 'Hasan', 'Maulana', 'Fitri', 'Rahman', 'Saputra', 'Wati', 'Ningsih', 'Siregar'];

        $jabatan = [
            'Kepala Bidang', 'Kepala Seksi', 'Analis Kebijakan', 'Analis SDM Aparatur', 
            'Staf Pelaksana', 'Pranata Komputer', 'Pengelola Data', 'Arsiparis', 'Bendahara'
        ];
        
        for ($i = 0; $i < 25; $i++) {
            $namaLengkap = $namaDepan[array_rand($namaDepan)] . ' ' . $namaBelakang[array_rand($namaBelakang)];
            $jabatanAcak = $jabatan[array_rand($jabatan)];
            $divisiAcak = $divisiModels->random(); // Pilih divisi secara acak dari yang sudah dibuat

            TargetUlasan::create([
                'tipe' => 'PEGAWAI',
                'nama' => $namaLengkap,
                'deskripsi' => $jabatanAcak . ' di ' . $divisiAcak->nama,
                'metadata' => [
                    'jabatan' => $jabatanAcak,
                    'divisi' => $divisiAcak->nama,
                    'nip' => '19' . rand(80, 99) . ' ' . rand(1000, 9999) . ' ' . rand(10, 99) . ' ' . rand(1000, 9999),
                ],
                'is_active' => true,
            ]);
        }
    }
}