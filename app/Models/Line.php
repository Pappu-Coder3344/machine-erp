<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Line extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function machines(): HasMany
    {
        return $this->hasMany(Machine::class);
    }

    public function breakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class);
    }

    public function returnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class);
    }

    public function fromAllocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class, 'from_line_id');
    }

    public function toAllocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class, 'to_line_id');
    }
}
