<?php

namespace App\Http\Requests\Master;

use App\Enums\MachineOwnershipType;
use App\Enums\MachineStatus;
use App\Http\Requests\Crud\CrudRequest;
use App\Models\Line;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class MachineRequest extends CrudRequest
{
    protected function permissionSlug(): string
    {
        return $this->isMethod('POST') ? 'machine-master.create' : 'machine-master.update';
    }

    protected function rulesForStore(): array
    {
        return [
            'machine_category_id' => ['nullable', 'exists:machine_categories,id'],
            'floor_id' => ['nullable', 'exists:floors,id'],
            'line_id' => ['nullable', 'exists:lines,id'],
            'code' => ['required', 'string', 'max:50', 'unique:machines,code'],
            'name' => ['required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_no' => ['nullable', 'string', 'max:120', 'unique:machines,serial_no'],
            'ownership_type' => ['required', Rule::in(collect(MachineOwnershipType::cases())->map(fn (MachineOwnershipType $case) => $case->value)->all())],
            'current_status' => ['required', Rule::in(collect(MachineStatus::cases())->map(fn (MachineStatus $case) => $case->value)->all())],
            'criticality' => ['nullable', 'string', 'max:10'],
            'repeat_watch' => ['required', 'boolean'],
            'installed_at' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
        ];
    }

    protected function rulesForUpdate(): array
    {
        return [
            'machine_category_id' => ['nullable', 'exists:machine_categories,id'],
            'floor_id' => ['nullable', 'exists:floors,id'],
            'line_id' => ['nullable', 'exists:lines,id'],
            'code' => ['required', 'string', 'max:50', $this->uniqueRule('machines', 'code', 'machine')],
            'name' => ['required', 'string', 'max:150'],
            'brand' => ['nullable', 'string', 'max:100'],
            'model' => ['nullable', 'string', 'max:100'],
            'serial_no' => ['nullable', 'string', 'max:120', $this->uniqueRule('machines', 'serial_no', 'machine')],
            'ownership_type' => ['required', Rule::in(collect(MachineOwnershipType::cases())->map(fn (MachineOwnershipType $case) => $case->value)->all())],
            'current_status' => ['required', Rule::in(collect(MachineStatus::cases())->map(fn (MachineStatus $case) => $case->value)->all())],
            'criticality' => ['nullable', 'string', 'max:10'],
            'repeat_watch' => ['required', 'boolean'],
            'installed_at' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'repeat_watch' => $this->boolean('repeat_watch'),
        ]);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if (! $this->filled('line_id') || ! $this->filled('floor_id')) {
                return;
            }

            $line = Line::query()->find($this->input('line_id'));

            if ($line && (int) $line->floor_id !== (int) $this->input('floor_id')) {
                $validator->errors()->add('line_id', 'The selected line does not belong to the selected floor.');
            }
        });
    }
}
