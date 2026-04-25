<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;

class DepartmentRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:departments,code'],
            'name' => ['required', 'string', 'max:100', 'unique:departments,name'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('departments', 'code', 'department')],
            'name' => ['required', 'string', 'max:100', $this->uniqueRule('departments', 'name', 'department')],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
