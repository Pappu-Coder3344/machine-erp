<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::before(function (User $user, string $ability): ?bool {
            if (! $user->isAccessible()) {
                return false;
            }

            if ($user->hasRole('Admin')) {
                return true;
            }

            return null;
        });

        foreach (config('access.permission_slugs', []) as $permissionSlug) {
            Gate::define($permissionSlug, fn (User $user): bool => $user->hasPermission($permissionSlug));
        }

        foreach (config('access.modules', []) as $moduleKey => $module) {
            $permission = $module['permission'] ?? null;

            if (! is_string($permission) || $permission === '') {
                continue;
            }

            Gate::define("module.{$moduleKey}", fn (User $user): bool => $user->hasPermission($permission));
        }
    }
}
