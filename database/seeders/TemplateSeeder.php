<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Template;

class TemplateSeeder extends Seeder
{
    public function run()
    {
        Template::create([
            'name' => 'Welcome Email',
        ]);

        Template::create([
            'name' => 'Newsletter',
        ]);

        Template::create([
            'name' => 'Promotion Offer',
        ]);
    }
}
