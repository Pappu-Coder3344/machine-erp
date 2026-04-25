<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MachineCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }

    public function spareParts(): HasMany
    {
        return $this->hasMany(SparePart::class);
    }
}
