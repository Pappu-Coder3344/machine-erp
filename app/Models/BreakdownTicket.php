<?php

namespace App\Models;

use App\Enums\BreakdownPriority;
use App\Enums\BreakdownTicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BreakdownTicket extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'reported_at' => 'datetime',
        'assigned_at' => 'datetime',
        'completed_at' => 'datetime',
        'closed_at' => 'datetime',
        'production_accepted_at' => 'datetime',
        'vendor_support_required' => 'boolean',
        'spare_support_required' => 'boolean',
        'accepted_by_production' => 'boolean',
        'priority' => BreakdownPriority::class,
        'status' => BreakdownTicketStatus::class,
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function line(): BelongsTo
    {
        return $this->belongsTo(Line::class);
    }

    public function raisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'raised_by_user_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by_user_id');
    }

    public function productionAcceptedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'production_accepted_by_user_id');
    }

    public function updates(): HasMany
    {
        return $this->hasMany(BreakdownTicketUpdate::class);
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
