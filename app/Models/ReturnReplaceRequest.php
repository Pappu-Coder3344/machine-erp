<?php

namespace App\Models;

use App\Enums\ReturnReplaceStatus;
use App\Enums\ReturnReplaceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnReplaceRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'request_date' => 'date',
        'vendor_reply_date' => 'date',
        'completion_target' => 'date',
        'request_type' => ReturnReplaceType::class,
        'flow_status' => ReturnReplaceStatus::class,
    ];

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function agreement(): BelongsTo
    {
        return $this->belongsTo(Agreement::class);
    }

    public function line(): BelongsTo
    {
        return $this->belongsTo(Line::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
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
