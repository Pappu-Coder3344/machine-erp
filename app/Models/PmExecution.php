<?php

namespace App\Models;

use App\Enums\PmStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PmExecution extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'execution_date' => 'date',
        'next_due_date' => 'date',
        'approved_at' => 'datetime',
        'status' => PmStatus::class,
    ];

    public function pmPlan(): BelongsTo
    {
        return $this->belongsTo(PmPlan::class);
    }

    public function executedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'executed_by_user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PmExecutionItem::class);
    }
}
