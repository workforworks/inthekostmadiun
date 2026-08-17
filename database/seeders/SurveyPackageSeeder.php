<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveyPackageSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('survey_packages')->insert([
            [
                'name' => 'Photo + Report',
                'description' => 'Survey fisik dengan dokumentasi foto dan laporan kondisi kost.',
                'price' => 50000,
                'type' => 'photo_report',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Live Video Call',
                'description' => 'Survey melalui video call secara langsung.',
                'price' => 75000,
                'type' => 'live_video_call',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
