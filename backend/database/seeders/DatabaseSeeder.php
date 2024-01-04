<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $rootUser = new User();
        $rootUser->username = 'root';
        $rootUser->email = 'root@chaostreff-flensburg.de';
        $rootUser->password = Hash::make('password');
        $rootUser->email_verified_at = now();
        $rootUser->save();

        $rootUser = new User();
        $rootUser->username = 'scammo';
        $rootUser->email = 'samuel@chaostreff-flensburg.de';
        $rootUser->password = Hash::make('test123');
        $rootUser->email_verified_at = now();
        $rootUser->save();
    }
}
