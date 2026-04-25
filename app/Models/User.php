<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $guarded = [];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'status' => UserStatus::class,
    ];

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }

    public function factoryUnit(): BelongsTo
    {
        return $this->belongsTo(FactoryUnit::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')->withTimestamps();
    }

    public function primaryRole(): ?Role
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->sortBy('name')->first();
        }

        return $this->roles()->orderBy('name')->first();
    }

    public function roleNames(): array
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->pluck('name')->filter()->values()->all();
        }

        return $this->roles()->pluck('name')->all();
    }

    public function getRolesLabelAttribute(): string
    {
        return implode(', ', $this->roleNames());
    }

    public function permissionSlugs(): array
    {
        return $this->roles()
            ->with('permissions:id,slug')
            ->get()
            ->flatMap(fn (Role $role) => $role->permissions->pluck('slug'))
            ->unique()
            ->values()
            ->all();
    }

    public function hasRole(string|array $roles): bool
    {
        return $this->hasAnyRole($roles);
    }

    public function hasAnyRole(string|array $roles): bool
    {
        $targets = collect((array) $roles)
            ->filter()
            ->map(function (string $role): array {
                $normalized = Str::of($role)->lower()->trim()->value();

                return [
                    'name' => $normalized,
                    'slug' => Str::of($role)->slug('-')->lower()->value(),
                ];
            })
            ->values();

        if ($targets->isEmpty()) {
            return false;
        }

        return $this->roles()
            ->where(function ($query) use ($targets) {
                foreach ($targets as $target) {
                    $query->orWhereRaw('LOWER(name) = ?', [$target['name']])
                        ->orWhereRaw('LOWER(slug) = ?', [$target['slug']]);
                }
            })
            ->exists();
    }

    public function hasPermission(string|array $permissions): bool
    {
        return $this->hasAnyPermission($permissions);
    }

    public function hasAnyPermission(string|array $permissions): bool
    {
        $permissionSlugs = collect((array) $permissions)
            ->filter()
            ->map(fn (string $permission) => Str::of($permission)->lower()->trim()->value())
            ->values();

        if ($permissionSlugs->isEmpty()) {
            return false;
        }

        if ($this->hasRole('Admin')) {
            return true;
        }

        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionSlugs) {
                $query->whereIn('slug', $permissionSlugs->all());
            })
            ->exists();
    }

    public function canAccessModule(string $moduleKey): bool
    {
        $permission = config("access.modules.{$moduleKey}.permission");

        return is_string($permission) && $permission !== ''
            ? $this->hasPermission($permission)
            : false;
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::ACTIVE;
    }

    public function isInactive(): bool
    {
        return $this->status === UserStatus::INACTIVE;
    }

    public function isLocked(): bool
    {
        return $this->status === UserStatus::LOCKED;
    }

    public function isPendingApproval(): bool
    {
        return $this->status === UserStatus::PENDING_APPROVAL;
    }

    public function isAccessible(): bool
    {
        return $this->isActive();
    }

    public function raisedBreakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class, 'raised_by_user_id');
    }

    public function assignedBreakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class, 'assigned_to_user_id');
    }

    public function closedBreakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class, 'closed_by_user_id');
    }

    public function productionAcceptedBreakdownTickets(): HasMany
    {
        return $this->hasMany(BreakdownTicket::class, 'production_accepted_by_user_id');
    }

    public function breakdownTicketUpdates(): HasMany
    {
        return $this->hasMany(BreakdownTicketUpdate::class, 'updated_by_user_id');
    }

    public function assignedPmPlans(): HasMany
    {
        return $this->hasMany(PmPlan::class, 'assigned_to_user_id');
    }

    public function pmExecutions(): HasMany
    {
        return $this->hasMany(PmExecution::class, 'executed_by_user_id');
    }

    public function approvedPmExecutions(): HasMany
    {
        return $this->hasMany(PmExecution::class, 'approved_by_user_id');
    }

    public function machineAllocations(): HasMany
    {
        return $this->hasMany(MachineAllocation::class, 'allocated_by_user_id');
    }

    public function requestedReturnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class, 'requested_by_user_id');
    }

    public function approvedReturnReplaceRequests(): HasMany
    {
        return $this->hasMany(ReturnReplaceRequest::class, 'approved_by_user_id');
    }

    public function postedStockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class, 'posted_by_user_id');
    }

    public function raisedApprovalRequests(): HasMany
    {
        return $this->hasMany(ApprovalRequest::class, 'requested_by_user_id');
    }

    public function approvalQueue(): HasMany
    {
        return $this->hasMany(ApprovalRequest::class, 'approver_user_id');
    }

    public function machineEvents(): HasMany
    {
        return $this->hasMany(MachineEvent::class, 'updated_by_user_id');
    }
}
