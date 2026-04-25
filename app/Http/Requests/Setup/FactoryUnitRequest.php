<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;

class FactoryUnitRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:factory_units,code'],
            'name' => ['required', 'string', 'max:150', 'unique:factory_units,name'],
            'area_type' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('factory_units', 'code', 'factoryUnit')],
            'name' => ['required', 'string', 'max:150', $this->uniqueRule('factory_units', 'name', 'factoryUnit')],
            'area_type' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
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
