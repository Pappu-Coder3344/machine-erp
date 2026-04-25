<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;
use Illuminate\Validation\Rule;

class FloorRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'factory_unit_id' => ['required', 'exists:factory_units,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', 'unique:floors,code'],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('floors', 'name')->where(fn ($query) => $query->where('factory_unit_id', $this->input('factory_unit_id'))),
            ],
            'area_type' => ['nullable', 'string', 'max:50'],
            'machine_capacity' => ['nullable', 'integer', 'min:0'],
            'supervisor_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'factory_unit_id' => ['required', 'exists:factory_units,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('floors', 'code', 'floor')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('floors', 'name')
                    ->where(fn ($query) => $query->where('factory_unit_id', $this->input('factory_unit_id')))
                    ->ignore($this->route('floor')?->id),
            ],
            'area_type' => ['nullable', 'string', 'max:50'],
            'machine_capacity' => ['nullable', 'integer', 'min:0'],
            'supervisor_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
