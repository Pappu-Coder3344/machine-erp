<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Floor extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function factoryUnit(): BelongsTo
    {
        return $this->belongsTo(FactoryUnit::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(Line::class);
    }

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }

    public function breakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class);
    }

    public function fromAllocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class, 'from_floor_id');
    }

    public function toAllocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class, 'to_floor_id');
    }
}
