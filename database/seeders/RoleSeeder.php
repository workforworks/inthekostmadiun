<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            ['name' => 'user', 'description' => 'Calon penyewa', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'owner', 'description' => 'Pemilik atau pengelola kost', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'admin', 'description' => 'Administrator platform', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
