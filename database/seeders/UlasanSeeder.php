<?php

namespace Database\Seeders;

use App\Models\Ulasan;
use App\Models\User;
use App\Models\TargetUlasan;
use Illuminate\Database\Seeder;

class UlasanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $targets = TargetUlasan::where('is_active', true)->get();

        if ($users->isEmpty() || $targets->isEmpty()) {
            $this->command->info('Tidak ada user atau target yang bisa diulas. Jalankan UserSeeder dan TargetUlasanSeeder terlebih dahulu.');
            return;
        }

        $kalimatPositif = [
            'Pelayanannya sangat memuaskan dan cepat tanggap. Terima kasih banyak!',
            'Luar biasa! Prosesnya jauh lebih mudah dari yang saya bayangkan.',
            'Stafnya sangat ramah dan informatif. Semua pertanyaan saya terjawab dengan baik.',
            'Sistemnya sangat membantu dan efisien. Patut diacungi jempol!',
            'Saya sangat terbantu, masalah saya selesai dalam waktu singkat.',
        ];

        $kalimatNegatif = [
            'Sangat mengecewakan. Prosesnya berbelit-belit dan tidak ada kejelasan.',
            'Pegawainya tidak ramah sama sekali, terkesan tidak mau membantu.',
            'Saya dilempar ke sana kemari tanpa solusi yang jelas. Sangat membuang waktu.',
            'Informasi yang diberikan tidak akurat dan menyesatkan.',
            'Menunggu sangat lama, padahal urusannya sederhana. Perlu perbaikan besar.',
        ];
        
        for ($i = 0; $i < 100; $i++) {
            $user = $users->random();
            $target = $targets->random();
            $rating = rand(1, 5);
            
            if ($rating >= 4) {
                $konten = $kalimatPositif[array_rand($kalimatPositif)];
            } elseif ($rating <= 2) {
                $konten = $kalimatNegatif[array_rand($kalimatNegatif)];
            } else {
                $konten = 'Pelayanannya standar saja, tidak ada yang spesial.';
            }

            Ulasan::create([
                'user_id' => $user->id,
                'target_ulasan_id' => $target->id,
                'konten' => $konten,
                'rating' => $rating,
                'visibilitas' => 'dipublikasikan',
            ]);
        }
    }
}