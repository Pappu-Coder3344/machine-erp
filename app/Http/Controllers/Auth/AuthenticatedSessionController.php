<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    public function create(Request $request): View|RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('app.dashboard');
        }

        $preferredRoles = [
            'Admin',
            'Maintenance Head',
            'Supervisor',
            'Technician',
            'Production User',
            'Store User',
            'Production GM',
            'Operation GM',
            'IE Manager',
            'IE Executive',
        ];

        $demoUsers = User::query()
            ->with('roles:id,name')
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'status'])
            ->map(function (User $user): array {
                return [
                    'name' => $user->name,
                    'username' => $user->username,
                    'role' => $user->primaryRole()?->name ?? 'No Role',
                    'status' => $user->status instanceof UserStatus ? $user->status->value : (string) $user->status,
                ];
            })
            ->sortBy(fn (array $user) => array_search($user['role'], $preferredRoles, true) !== false
                ? array_search($user['role'], $preferredRoles, true)
                : 999)
            ->values();

        $quickDemoUsers = $demoUsers
            ->unique('role')
            ->values();

        return view('auth.login', [
            'demoUsers' => $demoUsers,
            'quickDemoUsers' => $quickDemoUsers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $user = $this->resolveUser($credentials['login']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => 'The provided login credentials are invalid.',
            ]);
        }

        if (! $user->isAccessible()) {
            throw ValidationException::withMessages([
                'login' => $this->statusErrorMessage($user),
            ]);
        }

        Auth::login($user, (bool) ($credentials['remember'] ?? false));
        $request->session()->regenerate();

        $user->forceFill([
            'last_login_at' => now(),
        ])->saveQuietly();

        return redirect()->intended(route('app.dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('status', 'You have been signed out successfully.');
    }

    protected function resolveUser(string $login): ?User
    {
        return User::query()
            ->with(['roles.permissions', 'department', 'shift', 'factoryUnit'])
            ->where('username', $login)
            ->orWhere('email', $login)
            ->orWhere('employee_code', $login)
            ->first();
    }

    protected function statusErrorMessage(User $user): string
    {
        return match ($user->status) {
            UserStatus::INACTIVE => 'This account is inactive. Please contact the administrator.',
            UserStatus::LOCKED => 'This account is locked. Please contact the administrator.',
            UserStatus::PENDING_APPROVAL => 'This account is pending approval and cannot sign in yet.',
            default => 'This account cannot sign in at the moment.',
        };
    }
}
