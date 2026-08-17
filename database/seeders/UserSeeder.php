<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $userRole = DB::table('roles')
            ->where('name', 'user')
            ->value('id');

        $ownerRole = DB::table('roles')
            ->where('name', 'owner')
            ->value('id');

        $adminRole = DB::table('roles')
            ->where('name', 'admin')
            ->value('id');

        DB::table('users')->insert([
            [
                'role_id' => $userRole,
                'name' => 'User Demo',
                'email' => 'user@example.com',
                'phone' => '081234567890',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_id' => $ownerRole,
                'name' => 'Owner Demo',
                'email' => 'owner@example.com',
                'phone' => '081234567891',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'role_id' => $adminRole,
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'phone' => '081234567892',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
                'phone_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}