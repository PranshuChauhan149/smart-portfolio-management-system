<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@smartportfolio.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'risk_preference' => 'low',
            'email_verified_at' => now(),
        ]);

        echo "✅ Database seeded successfully!\n";
        echo "Admin: admin@smartportfolio.com / password\n";
    }
}
