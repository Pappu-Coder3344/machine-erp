<?php

namespace App\Http\Requests\Setup;

use App\Enums\PmFrequency;
use App\Http\Requests\Crud\CrudRequest;
use Illuminate\Validation\Rule;

class MachineCategoryRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:machine_categories,code'],
            'name' => ['required', 'string', 'max:100', 'unique:machine_categories,name'],
            'default_pm_frequency' => ['nullable', Rule::in(collect(PmFrequency::cases())->map(fn (PmFrequency $case) => $case->value)->all())],
            'description' => ['nullable', 'string'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('machine_categories', 'code', 'machineCategory')],
            'name' => ['required', 'string', 'max:100', $this->uniqueRule('machine_categories', 'name', 'machineCategory')],
            'default_pm_frequency' => ['nullable', Rule::in(collect(PmFrequency::cases())->map(fn (PmFrequency $case) => $case->value)->all())],
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
