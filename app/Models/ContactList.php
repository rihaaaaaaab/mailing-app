<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name'
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'list_id');
    }
}