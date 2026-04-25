<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shift extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'start_time' => 'datetime:H:i:s',
        'end_time' => 'datetime:H:i:s',
        'is_active' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function floors(): HasMany
    {
        return $this->hasMany(Floor::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(Line::class);
    }
}
