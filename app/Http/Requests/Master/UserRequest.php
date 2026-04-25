<?php

namespace App\Http\Requests\Master;

use App\Enums\UserStatus;
use App\Http\Requests\Crud\CrudRequest;
use Illuminate\Validation\Rule;

class UserRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'users.create' : 'users.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'employee_code' => ['nullable', 'string', 'max:50', 'unique:users,employee_code'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'factory_unit_id' => ['nullable', 'exists:factory_units,id'],
            'name' => ['required', 'string', 'max:150'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(collect(UserStatus::cases())->map(fn (UserStatus $case) => $case->value)->all())],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'employee_code' => ['nullable', 'string', 'max:50', $this->uniqueRule('users', 'employee_code', 'user')],
            'department_id' => ['nullable', 'exists:departments,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'factory_unit_id' => ['nullable', 'exists:factory_units,id'],
            'name' => ['required', 'string', 'max:150'],
            'username' => ['required', 'string', 'max:100', $this->uniqueRule('users', 'username', 'user')],
            'email' => ['nullable', 'email', 'max:255', $this->uniqueRule('users', 'email', 'user')],
            'phone' => ['nullable', 'string', 'max:30'],
            'designation' => ['nullable', 'string', 'max:120'],
            'status' => ['required', Rule::in(collect(UserStatus::cases())->map(fn (UserStatus $case) => $case->value)->all())],
            'password' => ['nullable', 'string', 'min:8'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }
}
