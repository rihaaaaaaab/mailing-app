<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactList;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        $lists = ContactList::all();

        foreach ($lists as $list) {
            Contact::factory()->count(10)->create([
                'list_id' => $list->id
            ]);
        }
    }
}