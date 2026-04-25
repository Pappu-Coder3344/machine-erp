<?php

namespace App\Http\Requests\Setup;

use App\Http\Requests\Crud\CrudRequest;
use App\Models\Section;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class LineRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'setup.create' : 'setup.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'floor_id' => ['required', 'exists:floors,id'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', 'unique:lines,code'],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('lines', 'name')->where(fn ($query) => $query->where('floor_id', $this->input('floor_id'))),
            ],
            'machine_capacity' => ['nullable', 'integer', 'min:0'],
            'current_machine_types' => ['nullable', 'string', 'max:255'],
            'supervisor_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'floor_id' => ['required', 'exists:floors,id'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'shift_id' => ['nullable', 'exists:shifts,id'],
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('lines', 'code', 'line')],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('lines', 'name')
                    ->where(fn ($query) => $query->where('floor_id', $this->input('floor_id')))
                    ->ignore($this->route('line')?->id),
            ],
            'machine_capacity' => ['nullable', 'integer', 'min:0'],
            'current_machine_types' => ['nullable', 'string', 'max:255'],
            'supervisor_name' => ['nullable', 'string', 'max:150'],
            'status' => ['required', 'string', 'max:50'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (! $this->filled('section_id') || ! $this->filled('floor_id')) {
                return;
            }

            $section = Section::query()->find($this->input('section_id'));

            if ($section && (int) $section->floor_id !== (int) $this->input('floor_id')) {
                $validator->errors()->add('section_id', 'The selected section does not belong to the selected floor.');
            }
        });
    }
}
