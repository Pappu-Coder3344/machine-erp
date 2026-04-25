<?php

namespace App\Models;

use App\Enums\MachineOwnershipType;
use App\Enums\MachineStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Machine extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'repeat_watch' => 'boolean',
        'installed_at' => 'date',
        'ownership_type' => MachineOwnershipType::class,
        'current_status' => MachineStatus::class,
    ];

    public function machineCategory(): BelongsTo
    {
        return $this->belongsTo(MachineCategory::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function line(): BelongsTo
    {
        return $this->belongsTo(Line::class);
    }

    public function rentDetail(): HasOne
    {
        return $this->hasOne(RentMachineDetail::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class);
    }

    public function breakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class);
    }

    public function pmPlans(): HasMany
    {
        return $this->hasMany(PmPlan::class);
    }

    public function returnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class);
    }

    public function spareParts(): BelongsToMany
    {
        return $this->belongsToMany(SparePart::class, 'spare_part_machine_links')->withPivot('notes')->withTimestamps();
    }

    public function machineEvents(): HasMany
    {
        return $this->hasMany(MachineEvent::class);
    }
}
