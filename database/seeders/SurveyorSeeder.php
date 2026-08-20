<?php

namespace Database\Seeders;

use App\Models\Surveyor;
use Illuminate\Database\Seeder;

class SurveyorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $surveyors = [
            [
                'name' => 'Budi Santoso',
                'phone' => '081234567890',
                'area' => 'Madiun Kota',
                'is_active' => true,
                'notes' => 'PJ Wilayah Kartoharjo & Manguharjo.',
            ],
            [
                'name' => 'Agus Prasetyo',
                'phone' => '082198765432',
                'area' => 'Kecamatan Taman',
                'is_active' => true,
                'notes' => 'Fokus area sekitar Kampus PNM & Unipma.',
            ],
            [
                'name' => 'Slamet Widodo',
                'phone' => '085712345678',
                'area' => 'Jiwan & Sekitarnya',
                'is_active' => false,
                'notes' => 'Sedang dalam evaluasi ketersediaan jam kerja.',
            ],
        ];

        foreach ($surveyors as $surveyor) {
            Surveyor::create($surveyor);
        }
    }
}
