<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacilitySeeder extends Seeder
{
    public function run(): void
    {
        $facilities = [
            ['name' => 'WiFi', 'icon' => 'wifi'],
            ['name' => 'AC', 'icon' => 'air-conditioning'],
            ['name' => 'Kasur', 'icon' => 'bed'],
            ['name' => 'Lemari', 'icon' => 'wardrobe'],
            ['name' => 'Kamar Mandi Dalam', 'icon' => 'bathroom'],
            ['name' => 'Parkir Motor', 'icon' => 'parking'],
            ['name' => 'Parkir Mobil', 'icon' => 'car'],
            ['name' => 'Dapur', 'icon' => 'kitchen'],
            ['name' => 'Laundry', 'icon' => 'laundry'],
            ['name' => 'Kulkas', 'icon' => 'refrigerator'],
            ['name' => 'TV', 'icon' => 'tv'],
            ['name' => 'Meja Belajar', 'icon' => 'desk'],
            ['name' => 'CCTV', 'icon' => 'cctv'],
            ['name' => 'Listrik Termasuk', 'icon' => 'electricity'],
            ['name' => 'Air Termasuk', 'icon' => 'water'],
        ];

        foreach ($facilities as $facility) {
            DB::table('facilities')->insert([
                'name' => $facility['name'],
                'icon' => $facility['icon'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
