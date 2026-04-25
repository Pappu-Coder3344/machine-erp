<?php

namespace App\Http\Controllers\Master;

use App\Enums\UserStatus;
use App\Http\Controllers\Crud\CrudController;
use App\Http\Requests\Master\UserRequest;
use App\Models\Department;
use App\Models\FactoryUnit;
use App\Models\Role;
use App\Models\Shift;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserController extends CrudController
{
    protected string $modelClass = User::class;
    protected string $moduleKey = 'users-access';
    protected string $resourceKey = 'users';
    protected string $routeNamePrefix = 'app.masters.users';
    protected string $resourceLabel = 'User';
    protected string $resourcePluralLabel = 'Users';
    protected string $viewPermission = 'users.view';
    protected ?string $createPermission = 'users.create';
    protected ?string $updatePermission = 'users.update';
    protected array $with = ['department', 'shift', 'factoryUnit', 'roles'];
    protected array $searchable = ['employee_code', 'name', 'username', 'email', 'designation'];
    protected array $columns = [
        ['label' => 'Employee Code', 'key' => 'employee_code'],
        ['label' => 'Name', 'key' => 'name'],
        ['label' => 'Username', 'key' => 'username'],
        ['label' => 'Role', 'key' => 'roles_label'],
        ['label' => 'Status', 'key' => 'status', 'format' => 'badge', 'badge_map' => ['Active' => 'success', 'Inactive' => 'secondary', 'Locked' => 'danger', 'Pending Approval' => 'warning']],
    ];

    protected function formData(Request $request, ?Model $record = null): array
    {
        return [
            'departments' => Department::query()->where('is_active', true)->orderBy('name')->get(),
            'shifts' => Shift::query()->where('is_active', true)->orderBy('name')->get(),
            'factoryUnits' => FactoryUnit::query()->where('is_active', true)->orderBy('name')->get(),
            'roles' => Role::query()->orderBy('name')->get(),
            'statuses' => collect(UserStatus::cases())->map(fn (UserStatus $case) => $case->value)->all(),
        ];
    }

    protected function persistRecord(Model $record, array $validated, Request $request): void
    {
        $roleId = (int) $validated['role_id'];
        unset($validated['role_id']);

        if (($validated['password'] ?? null) === null || $validated['password'] === '') {
            unset($validated['password']);
        }

        $record->fill($validated);
        $record->save();
        $record->roles()->sync([$roleId]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        return $this->storeRecord($request);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        return $this->updateRecord($request, $user);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        return $this->destroyRecord($request, $user);
    }
}
