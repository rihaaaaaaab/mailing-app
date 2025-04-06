<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'email',
        'first_name',
        'last_name',
        'phone',
        'address',
        'city',
        'state',
        'zip',
        'country',
        'notes',
    ];

    public function list()
    {
        return $this->belongsTo(ContactList::class, 'list_id');
    }

    public function campaigns()
    {
        return $this->belongsToMany(Campaign::class, 'contact_campaigns', 'contact_id', 'campaign_id');
    }
}