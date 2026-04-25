<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MachineAllocation extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'allocated_at' => 'datetime',
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function fromFloor(): BelongsTo
    {
        return $this->belongsTo(Floor::class, 'from_floor_id');
    }

    public function toFloor(): BelongsTo
    {
        return $this->belongsTo(Floor::class, 'to_floor_id');
    }

    public function fromLine(): BelongsTo
    {
        return $this->belongsTo(Line::class, 'from_line_id');
    }

    public function toLine(): BelongsTo
    {
        return $this->belongsTo(Line::class, 'to_line_id');
    }

    public function allocatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'allocated_by_user_id');
    }

    public function machineEvents(): HasMany
    {
        return $this->hasMany(MachineEvent::class);
    }
}
