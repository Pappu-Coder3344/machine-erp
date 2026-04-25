<?php

namespace App\Models;

use App\Enums\ReturnReplaceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentMachineDetail extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'receive_date' => 'date',
        'monthly_rent' => 'decimal:2',
        'return_replace_status' => ReturnReplaceStatus::class,
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
}
