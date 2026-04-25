<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthenticationException();
        }

        if (! $user->hasAnyPermission($permissions)) {
            abort(403, 'You do not have the required permission to access this area.');
        }

        return $next($request);
    }
}
