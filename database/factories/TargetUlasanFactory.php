<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TargetUlasan>
 */
class TargetUlasanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tipe = $this->faker->randomElement(['PEGAWAI', 'DIVISI']);
        
        $metadata = null;
        if ($tipe === 'PEGAWAI') {
            $metadata = [
                'jabatan' => $this->faker->randomElement(['Staf', 'Analis', 'Operator']),
                'nip' => $this->faker->numerify('199#############'),
            ];
        }

        return [
            'tipe' => $tipe,
            'nama' => $this->faker->name(),
            'deskripsi' => $this->faker->sentence(),
            'metadata' => $metadata,
            'is_active' => true,
        ];
    }
}