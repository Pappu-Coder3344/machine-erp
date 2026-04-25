<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Permission extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_permissions')->withTimestamps();
    }

    public function scopeForModule(Builder $query, string $module): Builder
    {
        return $query->whereRaw('LOWER(module) = ?', [Str::of($module)->lower()->trim()->value()]);
    }

    public function scopeBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', Str::of($slug)->lower()->trim()->value());
    }
}
