<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agreement extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'monthly_cost' => 'decimal:2',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function rentMachineDetails(): HasMany
    {
        return $this->hasMany(RentMachineDetail::class);
    }

    public function returnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class);
    }

    public function machineEvents(): HasMany
    {
        return $this->hasMany(MachineEvent::class);
    }
}
