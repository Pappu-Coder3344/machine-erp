<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;

class ShiftRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:shifts,code'],
            'name' => ['required', 'string', 'max:100', 'unique:shifts,name'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('shifts', 'code', 'shift')],
            'name' => ['required', 'string', 'max:100', $this->uniqueRule('shifts', 'name', 'shift')],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
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
