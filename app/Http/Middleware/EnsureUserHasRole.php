<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthenticationException();
        }

        if (! $user->hasAnyRole($roles)) {
            abort(403, 'You do not have the required role to access this area.');
        }

        return $next($request);
    }
}
