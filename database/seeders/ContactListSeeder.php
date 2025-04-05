<?php

namespace Database\Seeders;

use App\Models\ContactList;
use Illuminate\Database\Seeder;

class ContactListSeeder extends Seeder
{
    public function run(): void
    {
        ContactList::create([
            'name' => 'Newsletter Subscribers',
        ]);

        ContactList::create([
            'name' => 'Premium Customers',
        ]);

        ContactList::create([
            'name' => 'Blog Subscribers',
        ]);
    }
}