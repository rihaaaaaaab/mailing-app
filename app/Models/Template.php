<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'content',
    ];

    protected $appends = ['preview'];

    public function getPreviewAttribute()
    {
        return substr(strip_tags($this->content), 0, 100) . '...';
    }
}
