<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ContactListSeeder::class,
            ContactSeeder::class,
            TemplateSeeder::class,
        ]);
    }
}