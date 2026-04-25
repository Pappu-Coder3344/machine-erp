<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleAccess
{
    public function handle(Request $request, Closure $next, ?string $module = null): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthenticationException();
        }

        $moduleKey = $module ?: (string) $request->route('module');
        $definition = config("access.modules.{$moduleKey}");

        if (! is_array($definition)) {
            abort(404);
        }

        $permission = $definition['permission'] ?? null;

        if (! is_string($permission) || $permission === '' || ! $user->hasPermission($permission)) {
            abort(403, 'You do not have access to this module.');
        }

        $request->attributes->set('access_module', array_merge($definition, ['key' => $moduleKey]));

        return $next($request);
    }
}
