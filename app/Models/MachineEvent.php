<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineEvent extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by_user_id');
    }

    public function breakdownTicket(): BelongsTo
    {
        return $this->belongsTo(BreakdownTicket::class);
    }

    public function pmPlan(): BelongsTo
    {
        return $this->belongsTo(PmPlan::class);
    }

    public function returnReplaceRequest(): BelongsTo
    {
        return $this->belongsTo(ReturnReplaceRequest::class);
    }

    public function agreement(): BelongsTo
    {
        return $this->belongsTo(Agreement::class);
    }

    public function machineAllocation(): BelongsTo
    {
        return $this->belongsTo(MachineAllocation::class);
    }
}
