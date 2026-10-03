<?php

namespace Database\Seeders;

use App\Models\SurveyChecklist;
use Illuminate\Database\Seeder;

class SurveyChecklistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $checklists = [
            // Room
            ['name' => 'Kondisi Kamar', 'category' => 'room', 'description' => 'Pemeriksaan kelayakan dinding, cat, atap, dan pintu kamar.', 'order' => 1],
            ['name' => 'Kasur', 'category' => 'room', 'description' => 'Kondisi dan kebersihan kasur/springbed.', 'order' => 2],
            ['name' => 'Lemari', 'category' => 'room', 'description' => 'Kondisi lemari pakaian dan ketersediaan gantungan.', 'order' => 3],
            ['name' => 'Ventilasi', 'category' => 'room', 'description' => 'Sirkulasi udara dan ketersediaan jendela/pencahayaan alami.', 'order' => 4],
            ['name' => 'Kebersihan', 'category' => 'room', 'description' => 'Tingkat kebersihan kamar saat dilakukan survey.', 'order' => 5],

            // Bathroom
            ['name' => 'Air', 'category' => 'room', 'category' => 'bathroom', 'description' => 'Kelancaran dan kebersihan pasokan air (PDAM/Sumur).', 'order' => 1],
            ['name' => 'Toilet', 'category' => 'bathroom', 'description' => 'Kondisi kloset (duduk/jongkok) dan fungsi flush.', 'order' => 2],
            ['name' => 'Kebersihan', 'category' => 'bathroom', 'description' => 'Tingkat kebersihan lantai dan dinding kamar mandi.', 'order' => 3],
            ['name' => 'Kondisi Fasilitas', 'category' => 'bathroom', 'description' => 'Kondisi shower, ember, gayung, dan kran air.', 'order' => 4],

            // Facility
            ['name' => 'WiFi', 'category' => 'facility', 'description' => 'Kecepatan dan jangkauan sinyal internet/WiFi.', 'order' => 1],
            ['name' => 'Parkir', 'category' => 'facility', 'description' => 'Kapasitas dan keamanan area parkir motor/mobil.', 'order' => 2],
            ['name' => 'Dapur', 'category' => 'facility', 'description' => 'Fasilitas dapur bersama (kompor, tabung gas, tempat cuci piring).', 'order' => 3],
            ['name' => 'Laundry', 'category' => 'facility', 'description' => 'Ketersediaan jemuran atau fasilitas mesin cuci bersama.', 'order' => 4],

            // Environment
            ['name' => 'Akses Jalan', 'category' => 'environment', 'description' => 'Lebar jalan dan aksesibilitas kendaraan (mobil/motor).', 'order' => 1],
            ['name' => 'Lingkungan', 'category' => 'environment', 'description' => 'Tingkat ketenangan dan kenyamanan lingkungan sekitar.', 'order' => 2],
            ['name' => 'Keamanan', 'category' => 'environment', 'description' => 'Ketersediaan pagar, CCTV, atau portal lingkungan.', 'order' => 3],
            ['name' => 'Kondisi Sekitar', 'category' => 'environment', 'description' => 'Jarak ke warung makan, minimarket, dan fasilitas publik.', 'order' => 4],
        ];

        foreach ($checklists as $item) {
            SurveyChecklist::create([
                'name' => $item['name'],
                'category' => $item['category'],
                'description' => $item['description'],
                'order' => $item['order'],
                'is_active' => true,
            ]);
        }
    }
}
