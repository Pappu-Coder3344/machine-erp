<?php

namespace App\Models;

use App\Enums\PmFrequency;
use App\Enums\PmStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PmPlan extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'last_pm_date' => 'date',
        'next_due_date' => 'date',
        'vendor_aware' => 'boolean',
        'defer_requested' => 'boolean',
        'frequency' => PmFrequency::class,
        'status' => PmStatus::class,
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function executions(): HasMany
    {
        return $this->hasMany(PmExecution::class);
    }

    public function approvalRequests(): HasMany
    {
        return $this->hasMany(ApprovalRequest::class);
    }

    public function machineEvents(): HasMany
    {
        return $this->hasMany(MachineEvent::class);
    }
}
