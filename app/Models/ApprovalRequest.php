<?php

namespace App\Models;

use App\Enums\ApprovalStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprovalRequest extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'status' => ApprovalStatus::class,
    ];

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_user_id');
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

    public function stockMovement(): BelongsTo
    {
        return $this->belongsTo(StockMovement::class);
    }

    public function sparePart(): BelongsTo
    {
        return $this->belongsTo(SparePart::class);
    }
}
