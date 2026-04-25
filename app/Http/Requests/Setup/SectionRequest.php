<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;
use Illuminate\Validation\Rule;

class SectionRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'floor_id' => ['required', 'exists:floors,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', 'unique:sections,code'],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('sections', 'name')->where(fn ($query) => $query->where('floor_id', $this->input('floor_id'))),
            ],
            'line_group_name' => ['nullable', 'string', 'max:150'],
            'machine_focus' => ['nullable', 'string', 'max:150'],
            'in_charge_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'floor_id' => ['required', 'exists:floors,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('sections', 'code', 'section')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('sections', 'name')
                    ->where(fn ($query) => $query->where('floor_id', $this->input('floor_id')))
                    ->ignore($this->route('section')?->id),
            ],
            'line_group_name' => ['nullable', 'string', 'max:150'],
            'machine_focus' => ['nullable', 'string', 'max:150'],
            'in_charge_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
