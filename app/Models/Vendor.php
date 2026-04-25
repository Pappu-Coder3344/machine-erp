<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function agreements(): HasMany
    {
        return $this->hasMany(Agreement::class);
    }

    public function rentMachineDetails(): HasMany
    {
        return $this->hasMany(RentMachineDetail::class);
    }

    public function spareParts(): HasMany
    {
        return $this->hasMany(SparePart::class);
    }

    public function returnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class);
    }
}
