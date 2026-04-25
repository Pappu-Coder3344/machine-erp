<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Role extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permissions')->withTimestamps();
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_roles')->withTimestamps();
    }

    public function permissionSlugs(): array
    {
        if ($this->relationLoaded('permissions')) {
            return $this->permissions->pluck('slug')->filter()->values()->all();
        }

        return $this->permissions()->pluck('slug')->all();
    }

    public function hasPermission(string|array $permissions): bool
    {
        $permissionSlugs = collect((array) $permissions)
            ->filter()
            ->map(fn (string $permission) => Str::of($permission)->lower()->trim()->value())
            ->values();

        if ($permissionSlugs->isEmpty()) {
            return false;
        }

        return $this->permissions()
            ->whereIn('slug', $permissionSlugs->all())
            ->exists();
    }
}
